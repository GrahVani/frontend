"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Circle,
  Zap,
  ArrowRight,
} from "lucide-react";
import FormulaBlock from "./FormulaBlock";

export interface AlgorithmStep {
  id: string;
  label: string;
  description?: string;
  formula?: string;
  inputs?: { name: string; value: number | string; editable?: boolean }[];
  output?: string;
  condition?: string;
  nextStepTrue?: string;
  nextStepFalse?: string;
  isDecision?: boolean;
}

interface AlgorithmStepperProps {
  steps: AlgorithmStep[];
  title?: string;
  onComplete?: () => void;
}

export default function AlgorithmStepper({
  steps,
  title = "Algorithm Stepper",
  onComplete,
}: AlgorithmStepperProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [decisionPath, setDecisionPath] = useState<Record<string, boolean>>({});

  const currentStep = steps[currentStepIndex];

  const handleInputChange = (stepId: string, name: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [`${stepId}-${name}`]: value,
    }));
  };

  const handleDecision = (stepId: string, decision: boolean) => {
    setDecisionPath((prev) => ({ ...prev, [stepId]: decision }));
    setCompletedSteps((prev) => new Set(prev).add(stepId));

    // Find next step based on decision
    const step = steps.find((s) => s.id === stepId);
    if (step) {
      const nextId = decision ? step.nextStepTrue : step.nextStepFalse;
      if (nextId) {
        const nextIndex = steps.findIndex((s) => s.id === nextId);
        if (nextIndex !== -1) {
          setTimeout(() => setCurrentStepIndex(nextIndex), 400);
        }
      }
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  };

  const markComplete = useCallback(() => {
    setCompletedSteps((prev) => new Set(prev).add(currentStep.id));
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onComplete?.();
    }
  }, [currentStep, currentStepIndex, steps.length, onComplete]);

  const progress = Math.round(
    (completedSteps.size / steps.length) * 100
  );

  return (
    <div className="bg-white rounded-2xl border border-indigo-200/60 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 to-slate-50 border-b border-indigo-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-indigo-900">{title}</h3>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-full">
            {progress}% Complete
          </span>
        </div>
        <div className="mt-3 h-1.5 bg-indigo-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Step Navigator */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {steps.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = completedSteps.has(step.id);
            const isDecision = step.isDecision;

            return (
              <React.Fragment key={step.id}>
                {idx > 0 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                )}
                <button
                  onClick={() => goToStep(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md"
                      : isCompleted
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-white text-slate-500 border border-slate-200"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Circle className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isDecision ? "?" : `${idx + 1}`}. {step.label}
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step Header */}
            <div className="flex items-start gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  currentStep.isDecision
                    ? "bg-amber-100 text-amber-700"
                    : "bg-indigo-100 text-indigo-700"
                }`}
              >
                <span className="font-bold text-sm">
                  {currentStep.isDecision ? "?" : currentStepIndex + 1}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">
                  {currentStep.label}
                </h4>
                {currentStep.description && (
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {currentStep.description}
                  </p>
                )}
              </div>
            </div>

            {/* Formula */}
            {currentStep.formula && (
              <div className="mb-4">
                <FormulaBlock
                  formula={currentStep.formula}
                  label={currentStep.isDecision ? "Decision Gate" : "Formula"}
                  language={currentStep.isDecision ? "logic" : "formula"}
                />
              </div>
            )}

            {/* Inputs */}
            {currentStep.inputs && currentStep.inputs.length > 0 && (
              <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                {currentStep.inputs.map((input) => (
                  <div
                    key={input.name}
                    className="bg-slate-50 rounded-lg border border-slate-200 p-3"
                  >
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      {input.name}
                    </label>
                    {input.editable ? (
                      <input
                        type="text"
                        value={
                          inputValues[`${currentStep.id}-${input.name}`] ??
                          String(input.value)
                        }
                        onChange={(e) =>
                          handleInputChange(
                            currentStep.id,
                            input.name,
                            e.target.value
                          )
                        }
                        className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <span className="text-sm font-mono font-semibold text-indigo-700">
                        {input.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Decision Buttons */}
            {currentStep.isDecision && currentStep.condition && (
              <div className="mb-4">
                <p className="text-sm font-medium text-amber-800 mb-3 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  Condition: {currentStep.condition}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDecision(currentStep.id, true)}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                      decisionPath[currentStep.id] === true
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                    }`}
                  >
                    TRUE → {currentStep.nextStepTrue || "Continue"}
                  </button>
                  <button
                    onClick={() => handleDecision(currentStep.id, false)}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                      decisionPath[currentStep.id] === false
                        ? "bg-rose-600 text-white shadow-md"
                        : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                    }`}
                  >
                    FALSE → {currentStep.nextStepFalse || "Continue"}
                  </button>
                </div>
              </div>
            )}

            {/* Output */}
            {currentStep.output && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-200 p-4"
              >
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  Output
                </span>
                <p className="text-sm font-mono font-semibold text-indigo-900 mt-1">
                  {currentStep.output}
                </p>
              </motion.div>
            )}

            {/* Navigation */}
            {!currentStep.isDecision && (
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => goToStep(currentStepIndex - 1)}
                  disabled={currentStepIndex === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <button
                  onClick={markComplete}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  {currentStepIndex === steps.length - 1 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Complete
                    </>
                  ) : (
                    <>
                      Next Step
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
