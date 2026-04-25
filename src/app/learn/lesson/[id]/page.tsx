"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { learnApi, type Lesson } from "@/lib/api";

interface Concept {
  id: number;
  title: string;
  description: string;
}

interface QuizQuestion {
  questionId: number;
  question: string;
  options: Record<string, string>;
  correctAnswer: string;
  explanation: string;
}

interface LessonContent {
  intro: string;
  concepts: Concept[];
  quiz: QuizQuestion[];
}

export default function LessonPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; correctAnswers: number; totalQuestions: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    learnApi.getLesson(id as string)
      .then((res: { success: boolean; data: Lesson }) => {
        if (res.success) setLesson(res.data);
      })
      .catch((err: Error) => console.error("Failed to fetch lesson:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAnswer = (questionId: number, answer: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!user || !lesson) return;

    const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
      questionId: parseInt(questionId),
      answer
    }));

    try {
      const res = await learnApi.submitLesson(id as string, user.id, answersArray);
      if (res.success) {
        setResult(res.data);
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  if (loading) return <div className="text-center py-20 text-amber-700">Loading lesson...</div>;
  if (!lesson) return <div className="text-center py-20 text-red-600">Lesson not found</div>;

  const content = lesson.contentJson as unknown as LessonContent;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/learn" className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-800 text-sm mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>
        <h1 className="text-2xl font-bold text-amber-900">{lesson.title}</h1>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-2xl border border-amber-200/60 p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-amber-600" />
          <span className="text-sm font-semibold text-amber-700 uppercase tracking-wide">Introduction</span>
        </div>
        <p className="text-amber-800 leading-relaxed">{content.intro}</p>
      </div>

      {/* Concepts */}
      <div className="space-y-4 mb-8">
        {content.concepts.map((concept) => (
          <div key={concept.id} className="bg-white rounded-2xl border border-amber-200/60 p-6">
            <h3 className="text-lg font-bold text-amber-900 mb-2">{concept.title}</h3>
            <p className="text-amber-700 leading-relaxed">{concept.description}</p>
          </div>
        ))}
      </div>

      {/* Quiz */}
      <div className="bg-white rounded-2xl border border-amber-200/60 p-6">
        <h2 className="text-xl font-bold text-amber-900 mb-4">Knowledge Check</h2>
        <div className="space-y-6">
          {content.quiz.map((q, idx) => (
            <div key={q.questionId} className="border-b border-amber-100 last:border-0 pb-6 last:pb-0">
              <p className="font-medium text-amber-900 mb-3">
                {idx + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {Object.entries(q.options).map(([key, value]) => {
                  const isSelected = answers[q.questionId] === key;
                  const isCorrect = q.correctAnswer === key;
                  const showCorrect = submitted && isCorrect;
                  const showWrong = submitted && isSelected && !isCorrect;

                  return (
                    <button
                      key={key}
                      onClick={() => handleAnswer(q.questionId, key)}
                      disabled={submitted}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        showCorrect
                          ? "bg-green-50 border-green-300 text-green-800"
                          : showWrong
                          ? "bg-red-50 border-red-300 text-red-800"
                          : isSelected
                          ? "bg-amber-100 border-amber-300 text-amber-900"
                          : "bg-amber-50/30 border-amber-100 hover:bg-amber-50 text-amber-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          showCorrect ? "bg-green-500 text-white" :
                          showWrong ? "bg-red-500 text-white" :
                          isSelected ? "bg-amber-500 text-white" :
                          "bg-amber-200 text-amber-700"
                        }`}>
                          {showCorrect ? <CheckCircle className="w-4 h-4" /> :
                           showWrong ? <XCircle className="w-4 h-4" /> :
                           key}
                        </span>
                        <span>{value}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <p className={`mt-2 text-sm ${answers[q.questionId] === q.correctAnswer ? "text-green-600" : "text-red-600"}`}>
                  {q.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Submit / Result */}
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== content.quiz.length}
            className="mt-6 w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-semibold rounded-xl transition-colors"
          >
            Submit Answers ({Object.keys(answers).length}/{content.quiz.length})
          </button>
        ) : (
          <div className="mt-6 text-center">
            <div className={`text-3xl font-bold mb-2 ${result && result.score >= 70 ? "text-green-600" : "text-amber-600"}`}>
              {result?.score}%
            </div>
            <p className="text-amber-700 mb-4">
              You got {result?.correctAnswers} out of {result?.totalQuestions} correct!
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setSubmitted(false); setAnswers({}); setResult(null); }}
                className="px-6 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium rounded-xl transition-colors"
              >
                Retry
              </button>
              <Link
                href="/learn"
                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-colors"
              >
                Back to Courses
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
