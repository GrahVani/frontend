"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ToggleLeft, ToggleRight, Zap, ArrowRight } from "lucide-react";

export interface LogicVariable {
  name: string;
  label: string;
  value: boolean;
  description?: string;
}

export interface LogicGate {
  type: "AND" | "OR" | "NOT" | "XOR";
  inputs: string[]; // variable names
  output: string;
  label: string;
}

export interface LogicGateVisualizerProps {
  variables: LogicVariable[];
  gates: LogicGate[];
  finalOutput: {
    condition: string;
    resultTrue: string;
    resultFalse: string;
    icon?: string;
  };
  title?: string;
}

export default function LogicGateVisualizer({
  variables: initialVariables,
  gates,
  finalOutput,
  title = "Logic Gate Visualizer",
}: LogicGateVisualizerProps) {
  const [variables, setVariables] = useState<LogicVariable[]>(initialVariables);

  const toggleVariable = (name: string) => {
    setVariables((prev) =>
      prev.map((v) => (v.name === name ? { ...v, value: !v.value } : v))
    );
  };

  const varMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    variables.forEach((v) => (map[v.name] = v.value));
    return map;
  }, [variables]);

  const evaluateGate = (gate: LogicGate, map: Record<string, boolean> = varMap): boolean => {
    const inputValues = gate.inputs.map((name) => map[name] ?? false);
    switch (gate.type) {
      case "AND":
        return inputValues.every((v) => v);
      case "OR":
        return inputValues.some((v) => v);
      case "NOT":
        return !inputValues[0];
      case "XOR":
        return inputValues.filter((v) => v).length === 1;
      default:
        return false;
    }
  };

  const gateResults = (() => {
    const results: Record<string, boolean> = {};
    const runningMap = { ...varMap };
    gates.forEach((gate) => {
      results[gate.output] = evaluateGate(gate, runningMap);
      runningMap[gate.output] = results[gate.output];
    });
    return results;
  })();

  const finalResult = Object.values(gateResults).every((v) => v);

  return (
    <div className="bg-white rounded-2xl border border-indigo-200/60 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-indigo-100">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-indigo-900">{title}</h3>
        </div>
      </div>

      <div className="p-5">
        {/* Variables */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Input Variables
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {variables.map((variable) => (
              <motion.button
                key={variable.name}
                onClick={() => toggleVariable(variable.name)}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                  variable.value
                    ? "bg-emerald-50 border-emerald-400 text-emerald-900"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                }`}
              >
                <div className="text-left">
                  <span className="text-xs font-bold block">
                    {variable.label}
                  </span>
                  {variable.description && (
                    <span className="text-[10px] opacity-70 block mt-0.5">
                      {variable.description}
                    </span>
                  )}
                </div>
                {variable.value ? (
                  <ToggleRight className="w-6 h-6 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-slate-400" />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Gates */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Logic Gates
          </h4>
          <div className="space-y-3">
            {gates.map((gate) => {
              const result = gateResults[gate.output];
              return (
                <motion.div
                  key={gate.output}
                  animate={{
                    borderColor: result ? "#10b981" : "#f43f5e",
                    backgroundColor: result
                      ? "rgba(16, 185, 129, 0.05)"
                      : "rgba(244, 63, 94, 0.05)",
                  }}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 transition-colors"
                >
                  {/* Gate Type Badge */}
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg ${
                      result
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {gate.type}
                  </div>

                  {/* Gate Details */}
                  <div className="flex-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {gate.label}
                    </span>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {gate.inputs.map((inputName, i) => (
                        <React.Fragment key={inputName}>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                              varMap[inputName]
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {inputName}
                          </span>
                          {i < gate.inputs.length - 1 && (
                            <span className="text-xs text-slate-400 font-bold">
                              {gate.type === "AND"
                                ? "&&"
                                : gate.type === "OR"
                                ? "||"
                                : gate.type === "XOR"
                                ? "⊕"
                                : "!"}
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Result */}
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <span
                      className={`text-sm font-bold px-3 py-1 rounded-full ${
                        result
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {result ? "TRUE" : "FALSE"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Final Output */}
        <motion.div
          animate={{
            backgroundColor: finalResult
              ? "rgba(16, 185, 129, 0.08)"
              : "rgba(244, 63, 94, 0.08)",
            borderColor: finalResult ? "#10b981" : "#f43f5e",
          }}
          className="rounded-xl border-2 p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap
              className={`w-5 h-5 ${
                finalResult ? "text-emerald-600" : "text-rose-600"
              }`}
            />
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                finalResult ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              Final Output
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-2">
            Condition: <strong>{finalOutput.condition}</strong>
          </p>
          <motion.div
            key={finalResult ? "true" : "false"}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm font-semibold p-3 rounded-lg ${
              finalResult
                ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                : "bg-rose-100 text-rose-900 border border-rose-200"
            }`}
          >
            {finalResult ? finalOutput.resultTrue : finalOutput.resultFalse}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
