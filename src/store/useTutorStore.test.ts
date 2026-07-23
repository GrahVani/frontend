import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTutorStore, getEnrichedMessage } from "./useTutorStore";
import { tutorApi } from "../lib/api/tutor";
import { fetchTutorStream } from "../lib/api/tutor-stream";
import { useProgressStore } from "../lib/learning-runtime/progress-store";

vi.mock("../lib/api/tutor", () => ({
  tutorApi: {
    chat: vi.fn(),
  },
}));

vi.mock("../lib/api/tutor-stream", () => ({
  fetchTutorStream: vi.fn((sessionId, options) => {
    options.onToken("Mock ");
    options.onToken("Streamed ");
    options.onToken("Tokens");
    options.onDone({ messageId: "msg-stream-id", citations: ["source:lesson-1"] });
    return Promise.resolve();
  }),
}));

describe("useTutorStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Reset state values manually before each test
    useTutorStore.setState({
      isOpen: false,
      messages: [],
      inputValue: "",
      isLoading: false,
      error: null,
      sessionId: "",
      isStreaming: false,
      streamBuffer: "",
      citations: [],
      isOffline: false,
      retryMessage: null,
      abortController: null,
      currentLesson: null,
      currentSection: null,
      currentInteractive: null,
      lessonContext: null,
      interactiveContext: null,
      interactionState: null,
      tutorRecommendation: null,
    });
  });

  it("should initialize with default states", () => {
    const state = useTutorStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.messages).toEqual([]);
    expect(state.inputValue).toBe("");
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.isStreaming).toBe(false);
    expect(state.isOffline).toBe(false);
    expect(state.currentLesson).toBeNull();
    expect(state.currentSection).toBeNull();
    expect(state.currentInteractive).toBeNull();
    expect(state.lessonContext).toBeNull();
    expect(state.interactiveContext).toBeNull();
    expect(state.interactionState).toBeNull();
    expect(state.tutorRecommendation).toBeNull();
  });

  it("should toggle isOpen state", () => {
    useTutorStore.getState().setIsOpen(true);
    expect(useTutorStore.getState().isOpen).toBe(true);

    useTutorStore.getState().setIsOpen(false);
    expect(useTutorStore.getState().isOpen).toBe(false);
  });

  it("should update input value state", () => {
    useTutorStore.getState().setInputValue("Hello");
    expect(useTutorStore.getState().inputValue).toBe("Hello");
  });

  it("should load history from local storage or set default", () => {
    const slug = "jyotisha-as-vedanga";
    useTutorStore.getState().loadHistory(slug);

    const state = useTutorStore.getState();
    expect(state.sessionId).toBeDefined();
    expect(state.messages.length).toBe(1);
    expect(state.messages[0].id).toBe("greeting");
  });

  it("should call tutorApi.chat and append messages on sendMessage", async () => {
    const slug = "jyotisha-as-vedanga";
    const mockResponse = {
      answer: "Response content text.",
      sessionId: "session-123",
      messageId: "msg-456",
      promptVersion: "gyaneshwara:1.0.0",
    };
    vi.mocked(tutorApi.chat).mockResolvedValueOnce(mockResponse);

    useTutorStore.setState({
      sessionId: "session-123",
      inputValue: "Query content",
    });

    const sendPromise = useTutorStore.getState().sendMessage(slug);
    expect(useTutorStore.getState().isLoading).toBe(true);

    await sendPromise;

    const state = useTutorStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.messages.length).toBe(2);
    expect(state.messages[0].role).toBe("user");
    expect(state.messages[0].content).toBe("Query content");
    expect(state.messages[1].role).toBe("assistant");
    expect(state.messages[1].content).toBe("Response content text.");
  });

  it("should handle error states during chat delivery failures", async () => {
    const slug = "jyotisha-as-vedanga";
    vi.mocked(tutorApi.chat).mockRejectedValueOnce(new Error("API Timeout"));

    useTutorStore.setState({
      sessionId: "session-123",
      inputValue: "Fail Query",
    });

    await useTutorStore.getState().sendMessage(slug);

    const state = useTutorStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe("API Timeout");
  });

  it("should clear conversation caches and state on clearConversation", () => {
    const slug = "jyotisha-as-vedanga";
    useTutorStore.setState({
      messages: [{ id: "test", role: "user", content: "test" }],
      inputValue: "test",
    });

    useTutorStore.getState().clearConversation(slug);

    const state = useTutorStore.getState();
    expect(state.messages.length).toBe(1);
    expect(state.messages[0].id).toBe("greeting");
    expect(state.inputValue).toBe("");
    expect(state.error).toBeNull();
  });

  // PR P5-3 Store Action tests
  it("should change offline status state on setOffline", () => {
    useTutorStore.getState().setOffline(true);
    expect(useTutorStore.getState().isOffline).toBe(true);

    useTutorStore.getState().setOffline(false);
    expect(useTutorStore.getState().isOffline).toBe(false);
  });

  it("should handle streaming success stream message workflows", async () => {
    const slug = "jyotisha-as-vedanga";
    useTutorStore.setState({
      sessionId: "session-123",
      inputValue: "Stream Query",
    });

    await useTutorStore.getState().sendMessageStream(slug);

    const state = useTutorStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.isStreaming).toBe(false);
    expect(state.messages.length).toBe(2);
    expect(state.messages[0].role).toBe("user");
    expect(state.messages[1].role).toBe("assistant");
    expect(state.messages[1].content).toBe("Mock Streamed Tokens");
    expect(state.citations).toEqual(["source:lesson-1"]);
    expect(fetchTutorStream).toHaveBeenCalledWith("session-123", expect.any(Object));
  });

  it("should save retryMessage state if stream execution fails", async () => {
    const slug = "jyotisha-as-vedanga";
    vi.mocked(fetchTutorStream).mockRejectedValueOnce(new Error("Stream Timeout"));

    useTutorStore.setState({
      sessionId: "session-123",
      inputValue: "Fail Stream Query",
    });

    await useTutorStore.getState().sendMessageStream(slug);

    const state = useTutorStore.getState();
    expect(state.isStreaming).toBe(false);
    expect(state.error).toBe("Stream Timeout");
    expect(state.retryMessage).toEqual({
      lessonSlug: slug,
      message: "Fail Stream Query",
      clientMessageId: expect.any(String),
    });
  });

  it("should support cancelStreaming / abort methods", () => {
    const abortMock = vi.fn();
    const controllerMock = {
      abort: abortMock,
    } as unknown as AbortController;

    useTutorStore.setState({
      isStreaming: true,
      isLoading: true,
      streamBuffer: "Partial text",
      abortController: controllerMock,
    });

    useTutorStore.getState().cancelStreaming();

    expect(abortMock).toHaveBeenCalled();
    const state = useTutorStore.getState();
    expect(state.isStreaming).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.streamBuffer).toBe("");
    expect(state.abortController).toBeNull();
  });

  // PR P6-1 Store Action tests
  it("should update currentLesson on setCurrentLesson", () => {
    useTutorStore.getState().setCurrentLesson("my-lesson-slug");
    expect(useTutorStore.getState().currentLesson).toBe("my-lesson-slug");
  });

  it("should update currentSection on setCurrentSection", () => {
    useTutorStore.getState().setCurrentSection("4");
    expect(useTutorStore.getState().currentSection).toBe("4");
  });

  it("should update currentInteractive on setInteractive", () => {
    useTutorStore.getState().setInteractive("vedic-ecosystem-orbital");
    expect(useTutorStore.getState().currentInteractive).toBe("vedic-ecosystem-orbital");
  });

  it("should update lessonContext on syncLessonContext", () => {
    const payload = {
      slug: "jyotisha-as-vedanga",
      title: "Jyotiṣa as a Vedāṅga",
      learningOutcomes: ["Understand 6 limbs"],
    };
    useTutorStore.getState().syncLessonContext(payload);
    expect(useTutorStore.getState().lessonContext).toEqual(payload);
  });

  it("should reset all contextual state variables on clearLessonContext", () => {
    useTutorStore.setState({
      currentLesson: "slug",
      currentSection: "5",
      currentInteractive: "viz",
      lessonContext: { slug: "slug", title: "title" },
      interactiveContext: { componentId: "id", componentType: "type", componentTitle: "title" },
      interactionState: { currentStep: 1 },
      tutorRecommendation: { recommendation: "test", whySuggested: "test", nextAction: "test", type: "continue", priority: "low", timestamp: 0 },
    });

    useTutorStore.getState().clearLessonContext();

    const state = useTutorStore.getState();
    expect(state.currentLesson).toBeNull();
    expect(state.currentSection).toBeNull();
    expect(state.currentInteractive).toBeNull();
    expect(state.lessonContext).toBeNull();
    expect(state.interactiveContext).toBeNull();
    expect(state.interactionState).toBeNull();
    expect(state.tutorRecommendation).toBeNull();
  });

  // PR P6-2 Store Action tests
  it("should set interactiveContext on setInteractiveContext", () => {
    const context = { componentId: "wheel", componentType: "viz", componentTitle: "Wheel" };
    useTutorStore.getState().setInteractiveContext(context);
    expect(useTutorStore.getState().interactiveContext).toEqual(context);
  });

  it("should merge state updates on updateInteraction", () => {
    useTutorStore.setState({
      interactionState: { currentStep: 1, completionPercentage: 20 },
    });

    useTutorStore.getState().updateInteraction({
      completionPercentage: 40,
      selectedOption: "A",
    });

    const state = useTutorStore.getState().interactionState;
    expect(state?.currentStep).toBe(1);
    expect(state?.completionPercentage).toBe(40);
    expect(state?.selectedOption).toBe("A");
  });

  it("should reset interactiveContext and interactionState on clearInteractiveContext", () => {
    useTutorStore.setState({
      interactiveContext: { componentId: "id", componentType: "type", componentTitle: "title" },
      interactionState: { currentStep: 2 },
    });

    useTutorStore.getState().clearInteractiveContext();

    const state = useTutorStore.getState();
    expect(state.interactiveContext).toBeNull();
    expect(state.interactionState).toBeNull();
  });

  it("should sync state completely on syncInteractiveState", () => {
    const stateObj = { currentStep: 3, completionPercentage: 80 };
    useTutorStore.getState().syncInteractiveState(stateObj);
    expect(useTutorStore.getState().interactionState).toEqual(stateObj);
  });

  // PR P6-3 Progress Sync tests
  it("should enrich messages with progress percentage and next suggested activity", () => {
    const tutorState = {
      currentLesson: "jyotisha-as-vedanga",
      currentSection: "3",
      currentInteractive: "vedanga-body-map",
      interactiveContext: { componentId: "body", componentType: "viz", componentTitle: "Body Map" },
      interactionState: { currentStep: 1 },
      tutorRecommendation: null,
    };

    const progressState = {
      lessons: {
        "jyotisha-as-vedanga": {
          sectionsViewed: ["1", "2"],
          masteryStatus: "Started",
        },
      },
    };

    const sections = [
      { number: "1", title: "Introduction" },
      { number: "2", title: "Six Limbs" },
      { number: "3", title: "Visual Map" },
    ] as any[];

    const result = getEnrichedMessage("My Query text", tutorState as any, progressState, sections);
    expect(result).toContain("[Context:");
    expect(result).toContain("Progress %: 67%");
    expect(result).toContain('Completed Sections: ["1","2"]');
    expect(result).toContain("Current Learning Status: Started");
    expect(result).toContain("Next Suggested Activity: Section 3: Visual Map");
  });

  // PR P6-4 Guidance tests
  it("should set and clear recommendations via setTutorRecommendation", () => {
    const recObj = {
      recommendation: "Review Prereq",
      whySuggested: "Suggested context",
      nextAction: "Go to page",
      type: "review_prerequisite" as const,
      priority: "medium" as const,
      timestamp: Date.now(),
    };

    useTutorStore.getState().setTutorRecommendation(recObj);
    expect(useTutorStore.getState().tutorRecommendation).toEqual(recObj);

    useTutorStore.getState().setTutorRecommendation(null);
    expect(useTutorStore.getState().tutorRecommendation).toBeNull();
  });
});
