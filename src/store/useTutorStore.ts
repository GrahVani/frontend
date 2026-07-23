import { create } from "zustand";
import { tutorApi } from "../lib/api/tutor";
import { fetchTutorStream } from "../lib/api/tutor-stream";
import type { InteractiveContext, InteractionState } from "../lib/learning-runtime/interactive/types";
import type { LessonSection } from "../lib/learning-runtime/types";
import { useProgressStore } from "../lib/learning-runtime/progress-store";
import type { TutorRecommendation } from "../lib/learning-runtime/interactive/guidance-engine";
import { aggregateLearnerProfile, generateLearnerRecommendation, generateAdaptiveRecommendations, generateLearningPath, aggregateLearnerMemory, generateStudyPlan, detectLearningRisks, generateMentorGoals, generateAchievements, calculateMomentum, generateLearningInsights, generateWeeklyLearningReport, predictLearningOutcome, generateMentorDashboard, generateCoachingInterventions, generateDailyCoachSummary, generateLearningAlerts, generateSessionSummary, evaluateCoachingEffectiveness, generateAdaptiveReflection, calculateLearningConsistency } from "../lib/learning-runtime/profile/profile-service";
import { runtimeCache } from "../lib/learning-runtime/profile/cache";
import { createRuntimeTrace } from "../lib/learning-runtime/profile/observability-engine";
import { recordRuntimeTrace, getLatestTrace, getRuntimeEvents } from "../lib/learning-runtime/profile/telemetry";
import { recoveryManager } from "../lib/learning-runtime/profile/runtime-recovery-manager";
import {
  RuntimeConfiguration,
  getActivePresetId,
  getActiveRuntimeConfiguration,
  setActivePresetId,
  setActiveRuntimeConfiguration
} from "../lib/learning-runtime/profile/runtime-config";
import { getAllFeatureFlags } from "../lib/learning-runtime/profile/feature-flags";
import { getAllExperiments } from "../lib/learning-runtime/profile/experiment-engine";
import {
  getFallbackProfile,
  getFallbackRecommendation,
  getFallbackAdaptiveRecommendations,
  getFallbackLearningPath,
  getFallbackMemory,
  getFallbackStudyPlan,
  getFallbackLearningRisks,
  getFallbackMentorGoals,
  getFallbackAchievements,
  getFallbackMomentum,
  getFallbackLearningInsights,
  getFallbackWeeklyAnalytics,
  getFallbackLearningPredictions,
  getFallbackDashboard,
  getFallbackCoachingInterventions,
  getFallbackDailyCoachSummary,
  getFallbackLearningAlerts,
  getFallbackSessionSummary,
  getFallbackCoachingEffectiveness,
  getFallbackAdaptiveReflection,
  getFallbackLearningConsistency
} from "../lib/learning-runtime/profile/runtime-fallback";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface RetryMessagePayload {
  lessonSlug: string;
  message: string;
  clientMessageId: string;
}

export interface LessonContextPayload {
  slug: string;
  title: string;
  learningOutcomes?: string[];
  prerequisites?: string[];
}

interface TutorState {
  isOpen: boolean;
  messages: Message[];
  inputValue: string;
  isLoading: boolean;
  error: string | null;
  sessionId: string;

  // PR P5-3 Additions
  isStreaming: boolean;
  streamBuffer: string;
  citations: string[];
  isOffline: boolean;
  retryMessage: RetryMessagePayload | null;
  abortController: AbortController | null;

  // PR P6-1 Additions
  currentLesson: string | null;
  loadedHistoryLessonSlug: string | null;
  currentSection: string | null;
  currentInteractive: string | null;
  lessonContext: LessonContextPayload | null;

  // PR P6-2 Additions
  interactiveContext: InteractiveContext | null;
  interactionState: InteractionState | null;

  // PR P6-4 Additions
  tutorRecommendation: TutorRecommendation | null;

  setIsOpen: (open: boolean) => void;
  setInputValue: (val: string) => void;
  clearError: () => void;
  loadHistory: (lessonSlug: string) => Promise<void>;
  sendMessage: (lessonSlug: string, sections?: LessonSection[], overrideMessageText?: string) => Promise<void>;
  clearConversation: (lessonSlug: string) => void;

  // PR P5-3 Actions
  setOffline: (offline: boolean) => void;
  cancelStreaming: () => void;
  sendMessageStream: (lessonSlug: string, sections?: LessonSection[], overrideMessageText?: string) => Promise<void>;
  retry: (sections?: LessonSection[], overrideMessageText?: string) => Promise<void>;

  // PR P6-1 Actions
  setCurrentLesson: (lessonSlug: string | null) => void;
  setCurrentSection: (sectionNumber: string | null) => void;
  setInteractive: (componentType: string | null) => void;
  syncLessonContext: (context: LessonContextPayload) => void;
  clearLessonContext: () => void;

  // PR P6-2 Actions
  setInteractiveContext: (context: InteractiveContext | null) => void;
  updateInteraction: (state: InteractionState) => void;
  clearInteractiveContext: () => void;
  syncInteractiveState: (state: InteractionState) => void;

  // PR P6-4 Actions
  setTutorRecommendation: (rec: TutorRecommendation | null) => void;

  // PR P9-4 Additions
  activePresetId: string;
  activeConfiguration: RuntimeConfiguration;
  setActivePresetId: (presetId: string) => void;
  setActiveConfiguration: (config: RuntimeConfiguration) => void;
}

/**
 * Reusable helper centralizing context payload enrichment formatting.
 */
function _computeEnrichedMessage(
  userMessageText: string,
  tutorState: any,
  progressStoreState: any,
  sections?: LessonSection[]
): string {
  const { currentLesson, currentSection, currentInteractive, interactiveContext, interactionState, tutorRecommendation } = tutorState;

  let progressPct = 0;
  let completedSections: string[] = [];
  let masteryStatus = "Untouched";
  let nextSuggested = "";

  if (currentLesson) {
    const lessonProgress = progressStoreState.lessons[currentLesson];
    if (lessonProgress) {
      completedSections = lessonProgress.sectionsViewed || [];
      masteryStatus = lessonProgress.masteryStatus || "Untouched";
      if (sections && sections.length > 0) {
        progressPct = Math.round((completedSections.length / sections.length) * 100);
        const nextSec = sections.find((s) => !completedSections.includes(s.number));
        if (nextSec) {
          nextSuggested = `Section ${nextSec.number}: ${nextSec.title}`;
        }
      }
    }
  }

  const profile = recoveryManager.executeWithRecovery("profile", getFallbackProfile, () => aggregateLearnerProfile(progressStoreState));
  const rec = recoveryManager.executeWithRecovery("recommendation", getFallbackRecommendation, () => generateLearnerRecommendation(profile, progressStoreState));
  const adaptiveRecs = recoveryManager.executeWithRecovery("recommendation", getFallbackAdaptiveRecommendations, () => generateAdaptiveRecommendations(profile, progressStoreState));
  const learningPath = recoveryManager.executeWithRecovery("recommendation", getFallbackLearningPath, () => generateLearningPath(profile, progressStoreState));
  const memory = recoveryManager.executeWithRecovery("memory", getFallbackMemory, () => aggregateLearnerMemory(progressStoreState));
  const studyPlan = recoveryManager.executeWithRecovery("study_planner", getFallbackStudyPlan, () => generateStudyPlan(profile, memory, adaptiveRecs, learningPath, progressStoreState));
  const learningRisks = recoveryManager.executeWithRecovery("study_planner", getFallbackLearningRisks, () => detectLearningRisks(profile, memory, progressStoreState));
  const mentorGoals = recoveryManager.executeWithRecovery("mentor", getFallbackMentorGoals, () => generateMentorGoals(profile, memory, progressStoreState));
  const achievements = recoveryManager.executeWithRecovery("mentor", getFallbackAchievements, () => generateAchievements(profile, memory, progressStoreState));
  const momentum = recoveryManager.executeWithRecovery("mentor", getFallbackMomentum, () => calculateMomentum(profile, memory, progressStoreState));
  const insights = recoveryManager.executeWithRecovery("analytics", getFallbackLearningInsights, () => generateLearningInsights(profile, memory, progressStoreState));
  const weeklyReport = recoveryManager.executeWithRecovery("analytics", getFallbackWeeklyAnalytics, () => generateWeeklyLearningReport(profile, memory, progressStoreState));
  const prediction = recoveryManager.executeWithRecovery("analytics", getFallbackLearningPredictions, () => predictLearningOutcome(profile, memory, progressStoreState, studyPlan, momentum));
  const dashboard = recoveryManager.executeWithRecovery("dashboard", getFallbackDashboard, () => generateMentorDashboard(profile, memory, progressStoreState, studyPlan, mentorGoals, achievements, momentum, weeklyReport, prediction, learningPath));
  const interventions = recoveryManager.executeWithRecovery("coaching", getFallbackCoachingInterventions, () => generateCoachingInterventions(profile, memory, progressStoreState, studyPlan, momentum, achievements));
  const coachSummary = recoveryManager.executeWithRecovery("coaching", getFallbackDailyCoachSummary, () => generateDailyCoachSummary(profile, memory, progressStoreState, studyPlan));
  const alerts = recoveryManager.executeWithRecovery("coaching", getFallbackLearningAlerts, () => generateLearningAlerts(profile, memory, progressStoreState));
  const sessionSummary = recoveryManager.executeWithRecovery("session", getFallbackSessionSummary, () => generateSessionSummary(profile, memory, progressStoreState));
  const coachingEffectiveness = recoveryManager.executeWithRecovery("session", getFallbackCoachingEffectiveness, () => evaluateCoachingEffectiveness(profile, memory, progressStoreState, interventions));
  const adaptiveReflection = recoveryManager.executeWithRecovery("session", getFallbackAdaptiveReflection, () => generateAdaptiveReflection(profile, memory, progressStoreState, coachingEffectiveness));
  const learningConsistency = recoveryManager.executeWithRecovery("session", getFallbackLearningConsistency, () => calculateLearningConsistency(profile, memory, progressStoreState));

  const recentEvents = getRuntimeEvents(50);
  const trace = createRuntimeTrace(recentEvents);
  recordRuntimeTrace(trace);



  const contextLines = [
    `[Context:`,
    `  Lesson: ${currentLesson || ""}`,
    `  Section: ${currentSection || ""}`,
    `  Interactive Component: ${currentInteractive || ""}`,
    `  Active Component Context: ${interactiveContext ? JSON.stringify(interactiveContext) : ""}`,
    `  Interaction State: ${interactionState ? JSON.stringify(interactionState) : ""}`,
    `  Progress %: ${progressPct}%`,
    `  Completed Sections: ${JSON.stringify(completedSections)}`,
    `  Current Learning Status: ${masteryStatus}`,
    `  Next Suggested Activity: ${nextSuggested}`,
    `  Active Tutor Recommendation: ${tutorRecommendation ? JSON.stringify(tutorRecommendation) : ""}`,
    `  Learner Memory:`,
    `    Preferred Explanation: ${memory.preferredExplanation === "visual" ? "Visual" : memory.preferredExplanation === "step_by_step" ? "Step-by-Step" : memory.preferredExplanation === "short" ? "Short" : "Detailed"}`,
    `    Preferred Difficulty: ${memory.preferredDifficulty === "easy" ? "Easy" : memory.preferredDifficulty === "medium" ? "Medium" : "Advanced"}`,
    `    Strong Topics: ${JSON.stringify(memory.strongestTopics)}`,
    `    Weak Topics: ${JSON.stringify(memory.weakestTopics)}`,
    `    Confidence: ${memory.averageConfidence}%`,
    `    Revision Count: ${memory.revisionCount}`,
    `    Quiz Trend: ${memory.quizTrend === "improving" ? "Improving" : memory.quizTrend === "declining" ? "Declining" : "Stable"}`,
    `    Favourite Interactive: ${memory.favoriteInteractive || memory.favouriteInteractive || "None"}`,
    `    Average Session: ${memory.averageSessionMinutes} minutes`,
    `  Study Plan:`,
    `    Today's Tasks: ${JSON.stringify(studyPlan.todayTasks.map((t) => `${t.lesson} (${t.type}, ${t.estimatedDuration}m)`))}`,
    `    Tomorrow's Tasks: ${JSON.stringify(studyPlan.tomorrowTasks.map((t) => `${t.lesson} (${t.type}, ${t.estimatedDuration}m)`))}`,
    `    Weekly Goals: ${JSON.stringify(studyPlan.weeklyGoals.map((g) => `${g.title}: ${g.progressPct}% (${g.status})`))}`,
    `    Completion Forecast: ${studyPlan.completionForecast} days`,
    `    Burnout Risk: ${studyPlan.burnoutRisk.toUpperCase()}`,
    `  Learning Risks:`,
    ...learningRisks.map((r) => `    - [${r.severity.toUpperCase()}] ${r.type}: ${r.message} -> ${r.recommendation}`),
    `  Mentor Goals:`,
    ...mentorGoals.map((g) => `    - [${g.priority.toUpperCase()}] ${g.title}: ${g.progress}/${g.target} (${g.status})`),
    `  Achievements:`,
    ...achievements.filter((a) => a.unlocked).map((a) => `    - [UNLOCKED] ${a.title}: ${a.description}`),
    `  Momentum:`,
    `    Score: ${momentum.score}% (${momentum.trend.toUpperCase()})`,
    `    Explanation: ${momentum.explanation}`,
    `  Weekly Objectives:`,
    ...mentorGoals.filter((g) => g.type === "weekly").map((g) => `    - ${g.title}: ${g.progress}/${g.target}`),
    `  Current Milestone:`,
    `    ${achievements.find((a) => !a.unlocked)?.title || "All Milestones Unlocked"}: ${achievements.find((a) => !a.unlocked)?.description || ""}`,
    `  Learning Insights:`,
    ...insights.map((i) => `    - [${i.severity.toUpperCase()}] ${i.title}: ${i.description} -> ${i.recommendation}`),
    `  Weekly Learning Report:`,
    `    Total Study Time: ${weeklyReport.totalStudyMinutes} minutes`,
    `    Completed Lessons: ${weeklyReport.completedLessons}`,
    `    Completed Sections: ${weeklyReport.completedSections}`,
    `    Quizzes Taken: ${weeklyReport.quizzesTaken} (Avg: ${weeklyReport.averageQuizScore}%)`,
    `    Revision Sessions: ${weeklyReport.revisionSessions}`,
    `    Overall Rating: ${weeklyReport.overallRating.toUpperCase()}`,
    `  Learning Prediction:`,
    `    Completion Probability: ${prediction.completionProbability}%`,
    `    Mastery Probability: ${prediction.masteryProbability}%`,
    `    Burnout Probability: ${prediction.burnoutProbability}%`,
    `    Predicted Completion: ${prediction.expectedCompletionDays} days (Confidence: ${prediction.confidence}%)`,
    `  === MENTOR DASHBOARD ===`,
    `    Overview: Completion ${dashboard.overview.completion}%, Streak ${dashboard.overview.streak}d, Momentum ${dashboard.overview.momentum}%, Mastery ${dashboard.overview.mastery}%, Confidence ${dashboard.overview.confidence}%, Burnout ${dashboard.overview.burnout}%`,
    `    Current Focus: ${dashboard.currentFocus.lesson} - ${dashboard.currentFocus.section} (${dashboard.currentFocus.priority.toUpperCase()} Priority: ${dashboard.currentFocus.recommendation})`,
    `    Timeline: ${JSON.stringify(dashboard.timeline.slice(0, 5).map((t) => `[${t.status.toUpperCase()}] ${t.title}: ${t.description}`))}`,
    `    Weekly Snapshot: ${dashboard.weeklySnapshot.studyMinutes}m study, ${dashboard.weeklySnapshot.completedLessons} lessons, ${dashboard.weeklySnapshot.quizzes} quizzes, ${dashboard.weeklySnapshot.revisionSessions} revisions, ${dashboard.weeklySnapshot.achievements} achievements`,
    `    Coaching Summary: ${dashboard.coachingSummary.title} - ${dashboard.coachingSummary.summary} (Next Goal: ${dashboard.coachingSummary.nextWeekGoal})`,
    `  === AI COACH ===`,
    `    Daily Summary: ${coachSummary.headline} - ${coachSummary.message} (Focus: ${coachSummary.focusToday.join(", ")}; Avoid: ${coachSummary.avoidToday.join(", ")} | Target: ${coachSummary.estimatedStudyMinutes}m)`,
    `    Interventions:`,
    ...interventions.slice(0, 5).map((i) => `      - [${i.priority.toUpperCase()}] ${i.title}: ${i.message} (Action: ${i.action})`),
    `    Learning Alerts:`,
    ...alerts.slice(0, 5).map((a) => `      - [${a.severity.toUpperCase()}] ${a.title}: ${a.description} -> ${a.recommendation}`),
    `  === SESSION INTELLIGENCE ===`,
    `    Session Summary: ${sessionSummary.summary} (${sessionSummary.durationMinutes}m, ${sessionSummary.sectionsCompleted} sections, ${sessionSummary.quizzesAttempted} quizzes, Productivity ${sessionSummary.productivity}%, Engagement ${sessionSummary.engagement.toUpperCase()})`,
    `    Coaching Effectiveness: Score ${coachingEffectiveness.score}% (Improvement ${coachingEffectiveness.improvement >= 0 ? "+" : ""}${coachingEffectiveness.improvement}%, Intervention Success ${coachingEffectiveness.interventionSuccess}%, Recommendation Acceptance ${coachingEffectiveness.recommendationAcceptance}%, Confidence ${coachingEffectiveness.confidence}%)`,
    `    Adaptive Reflection: ${adaptiveReflection.title} - ${adaptiveReflection.reflection} (Strengths: ${adaptiveReflection.strengths.join(", ")}; Improvements: ${adaptiveReflection.improvements.join(", ")}; Next Focus: ${adaptiveReflection.nextFocus.join(", ")})`,
    `    Learning Consistency: Consistency ${learningConsistency.consistency}% (${learningConsistency.trend.toUpperCase()}, Attendance ${learningConsistency.attendance}%, Focus ${learningConsistency.focusScore}%, Discipline ${learningConsistency.discipline}%)`,

    `  Learner Profile Summary:`,
    `    Mastery: ${profile.completedLessons}/${profile.totalLessons} lessons completed`,
    `    Progress: ${profile.completionPercentage}%`,
    `    Average Quiz Score: ${profile.averageQuizScore}%`,
    `    Weak Topics: ${JSON.stringify(profile.weakTopics)}`,
    `    Strong Topics: ${JSON.stringify(profile.masteredTopics)}`,
    `    Recommendation: ${rec.recommendedNextLesson ? `Next Lesson: ${rec.recommendedNextLesson}` : rec.recommendedQuizRetry ? `Retry Quiz: ${rec.recommendedQuizRetry}` : rec.recommendedRevision ? `Revision: ${rec.recommendedRevision}` : ""}`,
    `    Recommendation Reason: ${rec.reason}`,
    `    Recommendation Confidence: ${rec.confidence}%`,
    `  Adaptive Recommendation Summary:`,
    ...adaptiveRecs.slice(0, 3).map((r) => `    - [${r.priority.toUpperCase()}] ${r.title}: ${r.reasoning} (${r.estimatedTime}m, ${r.confidence}% Conf)`),
    `  Learning Path Summary:`,
    ...learningPath.slice(0, 5).map((p) => `    - ${p.title} (${p.status.toUpperCase()}, ${p.estimatedDuration}m)`),
    `  Recommendation Confidence: ${profile.confidenceScore}%`,
    `  Reason: ${rec.reason}`,
    `  Estimated Study Time: ${adaptiveRecs.reduce((sum, r) => sum + r.estimatedTime, 0)}m`,
    `  === RUNTIME TRACE ===`,
    `    Request ID: ${trace.requestId}`,
    `    Total Execution Time: ${trace.totalDuration}ms (${trace.engineCount} engines, ${trace.cacheHits} hits, ${trace.cacheMisses} misses)`,
    `    Telemetry Events: ${trace.events.slice(0, 5).map((e) => `[${e.category}] ${e.operation} (${e.durationMs}ms, cached: ${e.cached})`).join("; ")}`,
    `  === RUNTIME RECOVERY ===`,
    `    Status: ${recoveryManager.getRecoveryReport().runtimeHealthy ? "Healthy" : "Degraded"}`,
    `    Recovered Failures: ${recoveryManager.getRecoveryReport().recoveredFailures}`,
    `    Unrecovered Failures: ${recoveryManager.getRecoveryReport().unrecoveredFailures}`,
    `    Actions: ${recoveryManager.getActions().map(a => `[${a.strategy}] ${a.description}`).join(" | ") || "None"}`,
    `  === RUNTIME CONFIGURATION ===`,
    `    Active Preset: ${getActivePresetId()}`,
    `    Enabled Engines: ${Object.entries(getActiveRuntimeConfiguration()).filter(([_, enabled]) => enabled).map(([name]) => name).join(", ")}`,
    `    Disabled Engines: ${Object.entries(getActiveRuntimeConfiguration()).filter(([_, enabled]) => !enabled).map(([name]) => name).join(", ") || "None"}`,
    `    Active Feature Flags: ${getAllFeatureFlags().filter(f => f.enabled).map(f => f.id).join(", ") || "None"}`,
    `    Active Experiments: ${getAllExperiments().filter(e => e.enabled).map(e => `${e.id} (${e.variant})`).join(", ") || "None"}`,
    `]`
  ].filter((line) => !line.endsWith(": ") && !line.endsWith(": \"\"") && !line.endsWith(": 0%"));

  if (contextLines.length > 2) {
    return `${userMessageText}\n\n${contextLines.join("\n")}`;
  }
  return userMessageText;
}

export function getEnrichedMessage(
  userMessageText: string,
  tutorState: TutorState,
  progressStoreState: any,
  sections?: LessonSection[]
): string {
  const cacheKeys = [
    userMessageText,
    tutorState?.currentLesson,
    tutorState?.currentSection,
    tutorState?.currentInteractive,
    tutorState?.interactiveContext,
    tutorState?.interactionState,
    tutorState?.tutorRecommendation,
    progressStoreState,
    sections,
    "enrichedMessage"
  ];
  return runtimeCache.memoize("session", cacheKeys, () => _computeEnrichedMessage(userMessageText, tutorState, progressStoreState, sections));
}

export const useTutorStore = create<TutorState>((set, get) => ({
  isOpen: false,
  messages: [],
  inputValue: "",
  isLoading: false,
  error: null,
  sessionId: "",

  // Initial values
  isStreaming: false,
  streamBuffer: "",
  citations: [],
  isOffline: typeof navigator !== "undefined" ? !navigator.onLine : false,
  retryMessage: null,
  abortController: null,

  // PR P6-1 Initial values
  currentLesson: null,
  loadedHistoryLessonSlug: null,
  currentSection: null,
  currentInteractive: null,
  lessonContext: null,

  // PR P6-2 Initial values
  interactiveContext: null,
  interactionState: null,

  // PR P6-4 Initial values
  tutorRecommendation: null,

  // PR P9-4 Initial values
  activePresetId: getActivePresetId(),
  activeConfiguration: getActiveRuntimeConfiguration(),

  setIsOpen: (isOpen) => set({ isOpen }),
  setInputValue: (inputValue) => set({ inputValue }),
  clearError: () => set({ error: null }),

  loadHistory: async (lessonSlug) => {
    if (typeof window === "undefined") return;

    const { loadedHistoryLessonSlug, isStreaming, messages } = get();
    if (isStreaming) return;

    // If we have already loaded history for THIS exact lessonSlug, do not reload
    if (loadedHistoryLessonSlug === lessonSlug && messages.length > 0) {
      return;
    }

    const storageKey = `grahvani-tutor-session-${lessonSlug}`;
    let sessId = localStorage.getItem(storageKey);
    let historyMessages: Message[] = [];

    const defaultGreeting: Message = {
      id: "greeting",
      role: "assistant",
      content: "Hari Om! I am Gyaneshwara, your AI tutor. Ask me anything about this lesson to deepen your understanding of Jyotiṣa.",
    };

    const historyKey = `grahvani-tutor-history-${lessonSlug}`;
    const savedHistory = localStorage.getItem(historyKey);

    if (savedHistory) {
      try {
        historyMessages = JSON.parse(savedHistory);
      } catch (e) {
        historyMessages = [];
      }
    }

    // Try to sync from backend if local history is empty or invalid
    if (historyMessages.length === 0) {
      try {
        set({ isLoading: true });
        // Fetch sessions for this lesson
        const { sessions } = await tutorApi.listSessions(lessonSlug);
        if (sessions && sessions.length > 0) {
          // Find the most recent session
          const latestSession = sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
          sessId = latestSession.id;
          
          // Fetch messages for this session
          const { messages: dbMessages } = await tutorApi.getMessages(sessId as string);
          
          if (dbMessages && dbMessages.length > 0) {
            // Transform backend messages to frontend format
            historyMessages = dbMessages
              .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
              .map((msg) => ({
                id: msg.id,
                role: msg.role === "ASSISTANT" ? "assistant" : "user",
                content: msg.content,
              }));
          }
        }
      } catch (err) {
        console.warn("Failed to sync chat history from backend:", err);
      } finally {
        set({ isLoading: false });
      }
    }

    // If still empty (new user, or no db history), use default greeting
    if (!historyMessages || !Array.isArray(historyMessages) || historyMessages.length === 0) {
      historyMessages = [defaultGreeting];
    }

    // If we didn't have a session ID locally and didn't get one from the DB, generate a new one
    if (!sessId) {
      sessId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    }
    
    // Save to local storage for fast subsequent loads
    localStorage.setItem(storageKey, sessId);
    localStorage.setItem(historyKey, JSON.stringify(historyMessages));

    set({
      sessionId: sessId,
      messages: historyMessages,
      loadedHistoryLessonSlug: lessonSlug,
      error: null,
      isStreaming: false,
      streamBuffer: "",
      citations: [],
      retryMessage: null,
      abortController: null,
    });
  },

  sendMessage: async (lessonSlug, sections, overrideMessageText) => {
    const {
      inputValue,
      messages,
      sessionId,
      isLoading,
      isOffline,
    } = get();
    const rawText = overrideMessageText || inputValue;
    if (!rawText.trim() || isLoading || isOffline) return;

    const userMessageText = rawText.trim();
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: userMessageText,
    };

    const lastMsg = messages[messages.length - 1];
    const isDuplicate = lastMsg?.role === "user" && lastMsg?.content === userMessageText;
    const updatedMessages = isDuplicate ? messages : [...messages, userMessage];

    // Optimistically update input, loading, error and append user message
    set({
      inputValue: "",
      messages: updatedMessages,
      isLoading: true,
      error: null,
      retryMessage: null,
    });

    if (typeof window !== "undefined") {
      localStorage.setItem(`grahvani-tutor-history-${lessonSlug}`, JSON.stringify(updatedMessages));
    }

    // Context Enrichment using centralized helper
    const enrichedMessage = getEnrichedMessage(
      userMessageText,
      get(),
      useProgressStore.getState(),
      sections
    );

    try {
      const response = await tutorApi.chat({
        lessonSlug,
        sessionId,
        message: enrichedMessage,
        context: {
          sectionNumber: get().currentSection ? parseInt(get().currentSection as string) : undefined,
          componentType: get().currentInteractive || undefined,
        },
      });

      const assistantMessage: Message = {
        id: response.messageId || `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: response.answer,
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      set({ messages: finalMessages });

      if (typeof window !== "undefined") {
        localStorage.setItem(`grahvani-tutor-history-${lessonSlug}`, JSON.stringify(finalMessages));
      }
    } catch (err: any) {
      const isPermissionErr =
        err?.message?.toLowerCase().includes("permission") ||
        err?.message?.toLowerCase().includes("forbidden") ||
        err?.message?.toLowerCase().includes("access this session");

      if (isPermissionErr) {
        console.warn("Stale or unauthorized session detected in sendMessage. Auto-healing with a fresh session ID...");
        const newSessId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
        if (typeof window !== "undefined") {
          localStorage.removeItem(`grahvani-tutor-session-${lessonSlug}`);
          localStorage.setItem(`grahvani-tutor-session-${lessonSlug}`, newSessId);
        }
        set({
          sessionId: newSessId,
          error: null,
          retryMessage: null,
          isLoading: false,
        });
        get().sendMessage(lessonSlug, sections, userMessageText);
        return;
      }

      console.error("Tutor API call failed:", err);
      const clientMessageId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
      set({
        error: err?.message || "Connection timed out. Please check if services are running.",
        retryMessage: { lessonSlug, message: userMessageText, clientMessageId },
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearConversation: (lessonSlug) => {
    // If actively streaming, cancel it first
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem(`grahvani-tutor-history-${lessonSlug}`);
      localStorage.removeItem(`grahvani-tutor-session-${lessonSlug}`);
    }
    const sessId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    if (typeof window !== "undefined") {
      localStorage.setItem(`grahvani-tutor-session-${lessonSlug}`, sessId);
    }
    const defaultGreeting: Message[] = [
      {
        id: "greeting",
        role: "assistant",
        content: "Hari Om! I am Gyaneshwara, your AI tutor. Ask me anything about this lesson to deepen your understanding of Jyotiṣa.",
      },
    ];
    set({
      sessionId: sessId,
      messages: defaultGreeting,
      loadedHistoryLessonSlug: lessonSlug,
      error: null,
      inputValue: "",
      isStreaming: false,
      streamBuffer: "",
      citations: [],
      retryMessage: null,
      abortController: null,
    });
  },

  // PR P5-3 Actions implementation
  setOffline: (isOffline) => set({ isOffline }),

  cancelStreaming: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
    }
    set({
      isStreaming: false,
      isLoading: false,
      streamBuffer: "",
      abortController: null,
    });
  },

  sendMessageStream: async (lessonSlug, sections, overrideMessageText) => {
    const {
      inputValue,
      messages,
      sessionId,
      isLoading,
      isStreaming,
      isOffline,
    } = get();
    const rawText = overrideMessageText || inputValue;
    if (!rawText.trim() || isLoading || isStreaming || isOffline) return;

    const userMessageText = rawText.trim();
    const clientMessageId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: userMessageText,
    };

    const lastMsg = messages[messages.length - 1];
    const isDuplicate = lastMsg?.role === "user" && lastMsg?.content === userMessageText;
    const updatedMessages = isDuplicate ? messages : [...messages, userMessage];

    set({
      inputValue: "",
      messages: updatedMessages,
      isLoading: true,
      isStreaming: true,
      streamBuffer: "",
      citations: [],
      error: null,
      retryMessage: null,
    });

    if (typeof window !== "undefined") {
      localStorage.setItem(`grahvani-tutor-history-${lessonSlug}`, JSON.stringify(updatedMessages));
    }

    const abortController = new AbortController();
    set({ abortController });

    // Context Enrichment using centralized helper
    const enrichedMessage = getEnrichedMessage(
      userMessageText,
      get(),
      useProgressStore.getState(),
      sections
    );

    try {
      await fetchTutorStream(sessionId, {
        lessonSlug,
        message: enrichedMessage,
        clientMessageId,
        context: {
          sectionNumber: get().currentSection ? parseInt(get().currentSection as string) : undefined,
          componentType: get().currentInteractive || undefined,
        },
        signal: abortController.signal,
        onToken: (token) => {
          const newBuffer = get().streamBuffer + token;
          set({ streamBuffer: newBuffer, isLoading: false });
        },
        onDone: ({ messageId, citations }) => {
          const finalBuffer = get().streamBuffer;
          const assistantMessage: Message = {
            id: messageId || `msg-${Date.now()}-assistant`,
            role: "assistant",
            content: finalBuffer,
          };

          const finalMessages = [...updatedMessages, assistantMessage];
          set({
            messages: finalMessages,
            isStreaming: false,
            streamBuffer: "",
            citations,
            abortController: null,
          });

          if (typeof window !== "undefined") {
            localStorage.setItem(`grahvani-tutor-history-${lessonSlug}`, JSON.stringify(finalMessages));
          }
        },
        onError: (err) => {
          const isPermissionErr =
            err?.message?.toLowerCase().includes("permission") ||
            err?.message?.toLowerCase().includes("forbidden") ||
            err?.message?.toLowerCase().includes("access this session");

          if (isPermissionErr) {
            console.warn("Stale or unauthorized session detected. Auto-healing with a fresh session ID...");
            const newSessId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
            if (typeof window !== "undefined") {
              localStorage.removeItem(`grahvani-tutor-session-${lessonSlug}`);
              localStorage.setItem(`grahvani-tutor-session-${lessonSlug}`, newSessId);
            }
            set({
              sessionId: newSessId,
              error: null,
              retryMessage: null,
              isStreaming: false,
              isLoading: false,
              abortController: null,
            });
            get().sendMessageStream(lessonSlug, sections, userMessageText);
            return;
          }

          console.error("Streaming error inside sendMessageStream:", err);
          set({
            error: err?.message || "Connection failure or rate limit during stream.",
            retryMessage: { lessonSlug, message: userMessageText, clientMessageId },
            isStreaming: false,
            isLoading: false,
            abortController: null,
          });
        },
      });
    } catch (err: any) {
      const isPermissionErr =
        err?.message?.toLowerCase().includes("permission") ||
        err?.message?.toLowerCase().includes("forbidden") ||
        err?.message?.toLowerCase().includes("access this session");

      if (isPermissionErr) {
        console.warn("Stale or unauthorized session detected during stream setup. Auto-healing...");
        const newSessId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
        if (typeof window !== "undefined") {
          localStorage.removeItem(`grahvani-tutor-session-${lessonSlug}`);
          localStorage.setItem(`grahvani-tutor-session-${lessonSlug}`, newSessId);
        }
        set({
          sessionId: newSessId,
          error: null,
          retryMessage: null,
          isStreaming: false,
          isLoading: false,
          abortController: null,
        });
        get().sendMessageStream(lessonSlug, sections, userMessageText);
        return;
      }

      console.error("Streaming failed:", err);
      set({
        error: err?.message || "Connection failure during stream.",
        retryMessage: { lessonSlug, message: userMessageText, clientMessageId },
        isStreaming: false,
        isLoading: false,
        abortController: null,
      });
    }
  },

  retry: async (sections, overrideMessageText) => {
    const { retryMessage, sessionId, isOffline, isStreaming } = get();
    if (!retryMessage || isOffline || isStreaming) return;

    const { lessonSlug, clientMessageId } = retryMessage;
    const message = overrideMessageText || retryMessage.message;

    set({
      isLoading: true,
      isStreaming: true,
      streamBuffer: "",
      citations: [],
      error: null,
      retryMessage: null,
    });

    const abortController = new AbortController();
    set({ abortController });

    // Context Enrichment using centralized helper
    const enrichedMessage = getEnrichedMessage(
      message,
      get(),
      useProgressStore.getState(),
      sections
    );

    try {
      await fetchTutorStream(sessionId, {
        lessonSlug,
        message: enrichedMessage,
        clientMessageId,
        context: {
          sectionNumber: get().currentSection ? parseInt(get().currentSection as string) : undefined,
          componentType: get().currentInteractive || undefined,
        },
        signal: abortController.signal,
        onToken: (token) => {
          const newBuffer = get().streamBuffer + token;
          set({ streamBuffer: newBuffer, isLoading: false });
        },
        onDone: ({ messageId, citations }) => {
          const finalBuffer = get().streamBuffer;
          const assistantMessage: Message = {
            id: messageId || `msg-${Date.now()}-assistant`,
            role: "assistant",
            content: finalBuffer,
          };

          const finalMessages = [...get().messages, assistantMessage];
          set({
            messages: finalMessages,
            isStreaming: false,
            streamBuffer: "",
            citations,
            abortController: null,
          });

          if (typeof window !== "undefined") {
            localStorage.setItem(`grahvani-tutor-history-${lessonSlug}`, JSON.stringify(finalMessages));
          }
        },
        onError: (err) => {
          const isPermissionErr =
            err?.message?.toLowerCase().includes("permission") ||
            err?.message?.toLowerCase().includes("forbidden") ||
            err?.message?.toLowerCase().includes("access this session");

          if (isPermissionErr) {
            console.warn("Stale or unauthorized session detected in retry. Auto-healing with a fresh session ID...");
            const newSessId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
            if (typeof window !== "undefined") {
              localStorage.removeItem(`grahvani-tutor-session-${lessonSlug}`);
              localStorage.setItem(`grahvani-tutor-session-${lessonSlug}`, newSessId);
            }
            set({
              sessionId: newSessId,
              error: null,
              isStreaming: false,
              isLoading: false,
              abortController: null,
            });
            get().retry(sections, message);
            return;
          }

          console.error("Streaming error inside retry:", err);
          set({
            error: err?.message || "Connection failure or rate limit during stream retry.",
            retryMessage: { lessonSlug, message, clientMessageId },
            isStreaming: false,
            isLoading: false,
            abortController: null,
          });
        },
      });
    } catch (err: any) {
      const isPermissionErr =
        err?.message?.toLowerCase().includes("permission") ||
        err?.message?.toLowerCase().includes("forbidden") ||
        err?.message?.toLowerCase().includes("access this session");

      if (isPermissionErr) {
        console.warn("Stale or unauthorized session detected during retry setup. Auto-healing...");
        const newSessId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
        if (typeof window !== "undefined") {
          localStorage.removeItem(`grahvani-tutor-session-${lessonSlug}`);
          localStorage.setItem(`grahvani-tutor-session-${lessonSlug}`, newSessId);
        }
        set({
          sessionId: newSessId,
          error: null,
          isStreaming: false,
          isLoading: false,
          abortController: null,
        });
        get().retry(sections, message);
        return;
      }

      console.error("Streaming retry failed:", err);
      set({
        error: err?.message || "Connection failure during retry.",
        retryMessage: { lessonSlug, message, clientMessageId },
        isStreaming: false,
        isLoading: false,
        abortController: null,
      });
    }
  },

  // PR P6-1 Actions implementation
  setCurrentLesson: (currentLesson) => set({ currentLesson }),
  setCurrentSection: (currentSection) => set({ currentSection }),
  setInteractive: (currentInteractive) => set({ currentInteractive }),
  syncLessonContext: (lessonContext) => set({ lessonContext }),
  clearLessonContext: () => set({
    currentLesson: null,
    currentSection: null,
    currentInteractive: null,
    lessonContext: null,
    interactiveContext: null,
    interactionState: null,
    tutorRecommendation: null,
  }),

  // PR P6-2 Actions implementation
  setInteractiveContext: (interactiveContext) => set({ interactiveContext }),
  updateInteraction: (state) => set((s) => ({
    interactionState: {
      ...s.interactionState,
      ...state,
      // Merge sub-objects if they are defined
      quizState: state.quizState ? { ...s.interactionState?.quizState, ...state.quizState } : s.interactionState?.quizState,
      userSelections: state.userSelections ? { ...s.interactionState?.userSelections, ...state.userSelections } : s.interactionState?.userSelections,
      visualizationState: state.visualizationState ? { ...s.interactionState?.visualizationState, ...state.visualizationState } : s.interactionState?.visualizationState,
    },
  })),
  clearInteractiveContext: () => set({
    interactiveContext: null,
    interactionState: null,
  }),
  syncInteractiveState: (state) => set({ interactionState: state }),

  // PR P6-4 Actions implementation
  setTutorRecommendation: (tutorRecommendation) => set({ tutorRecommendation }),

  // PR P9-4 Actions implementation
  setActivePresetId: (presetId) => {
    setActivePresetId(presetId);
    set({
      activePresetId: presetId,
      activeConfiguration: getActiveRuntimeConfiguration(),
    });
  },
  setActiveConfiguration: (config) => {
    setActiveRuntimeConfiguration(config);
    set({
      activeConfiguration: config,
    });
  },
}));
