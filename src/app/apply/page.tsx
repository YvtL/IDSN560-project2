"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Lock, Shield, Eye } from "lucide-react";
import Navigation from "@/components/navigation";
import GlassPanel from "@/components/glass-panel";
import { useSession } from "@/context/session-context";
import { evaluationQuestions } from "@/data/evaluation-questions";

type Phase = "intro" | "assessment" | "processing" | "complete";

const sectionLabels: Record<string, { title: string; step: number; desc: string }> = {
  ethics: { title: "Ethical Alignment", step: 1, desc: "Assess your decision-making under operational pressure" },
  pattern: { title: "Pattern Analysis", step: 2, desc: "Evaluate behavioral data interpretation skills" },
  witness: { title: "Observation Protocol", step: 3, desc: "Measure monitoring aptitude and distress tolerance" },
};

export default function ApplyPage() {
  const router = useRouter();
  const { session, updateSession, trackPage } = useSession();
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const questionStartRef = useRef<number>(Date.now());

  useEffect(() => {
    trackPage("/apply");
  }, [trackPage]);

  const question = evaluationQuestions[currentQ];
  const totalQuestions = evaluationQuestions.length;
  const currentSection = question ? sectionLabels[question.section] : null;

  const startEvaluation = useCallback(() => {
    updateSession((s) => ({
      ...s,
      evaluationStartTime: Date.now(),
    }));
    setPhase("assessment");
    questionStartRef.current = Date.now();
  }, [updateSession]);

  const selectAnswer = useCallback(
    (optionIndex: number) => {
      if (selectedOption !== null) return;
      setSelectedOption(optionIndex);

      const hesitation = Date.now() - questionStartRef.current;
      updateSession((s) => ({
        ...s,
        hesitations: [...s.hesitations, hesitation],
      }));

      const option = question.options[optionIndex];
      updateSession((s) => ({
        ...s,
        scores: {
          compliance: s.scores.compliance + option.scores.compliance,
          curiosity: s.scores.curiosity + option.scores.curiosity,
          empathy: s.scores.empathy + option.scores.empathy,
          punitiveTendency: s.scores.punitiveTendency + option.scores.punitiveTendency,
          proceduralTrust: s.scores.proceduralTrust + option.scores.proceduralTrust,
        },
      }));

      setTimeout(() => {
        const newAnswers = [...answers, optionIndex];
        setAnswers(newAnswers);
        setSelectedOption(null);

        if (currentQ < totalQuestions - 1) {
          setCurrentQ((q) => q + 1);
          questionStartRef.current = Date.now();
        } else {
          setPhase("processing");
          updateSession((s) => ({
            ...s,
            applicationComplete: true,
            evaluationComplete: true,
            archiveUnlocked: true,
            terminalUnlocked: true,
            evaluationEndTime: Date.now(),
          }));
          setTimeout(() => setPhase("complete"), 3500);
        }
      }, 600);
    },
    [selectedOption, question, currentQ, totalQuestions, answers, updateSession]
  );

  // Already completed
  if (session.applicationComplete && phase === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-tckr-50/30 to-white">
        <Navigation />
        <div className="pt-32 max-w-2xl mx-auto px-6 text-center">
          <GlassPanel>
            <CheckCircle2 className="w-12 h-12 text-tckr-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Approved</h2>
            <p className="text-gray-500 mb-6">Your monitoring station is ready.</p>
            <button
              onClick={() => router.push("/monitor")}
              className="px-6 py-2.5 bg-tckr-900 text-white rounded-lg text-sm font-medium hover:bg-tckr-800 transition-colors"
            >
              Open Monitoring Dashboard
            </button>
          </GlassPanel>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-tckr-50/30 to-white">
      <Navigation />

      <div className="pt-28 pb-20 max-w-3xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {/* INTRO */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <GlassPanel className="text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tckr-50 border border-tckr-200/60 text-tckr-600 text-xs font-medium mb-6">
                  <Lock className="w-3 h-3" />
                  Confidential Screening
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Applicant Screening
                </h1>
                <p className="text-gray-500 mb-2">
                  Behavioral Monitoring Analyst — JPBOP Division
                </p>

                <div className="w-12 h-px bg-gray-200 mx-auto my-6" />

                <p className="text-sm text-gray-500 leading-relaxed mb-4 max-w-lg mx-auto">
                  Before you can access the monitoring station, we need to assess your
                  behavioral compatibility with the Justice Park Behavioral Operations Program.
                  This screening evaluates your decision-making patterns, analytical capacity,
                  and distress tolerance.
                </p>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 mb-6 text-left max-w-md mx-auto">
                  <div className="flex items-start gap-3">
                    <Eye className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-blue-700 mb-1">Your assigned task</p>
                      <p className="text-xs text-blue-600 leading-relaxed">
                        Upon completion, you will be assigned to monitor Subject 0089{"'"}s
                        biometric data during active restoration cycles. Your role is to
                        ensure all readings remain within approved safety thresholds.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {Object.values(sectionLabels).map((s) => (
                    <div key={s.step} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="text-xs font-medium text-tckr-500 mb-1">Section {s.step}</div>
                      <div className="text-xs text-gray-500">{s.title}</div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-400 mb-6">
                  Estimated time: 3–5 minutes. There are no right or wrong answers.
                  <br />
                  <span className="text-gray-300">Your response patterns will be recorded for system calibration.</span>
                </p>

                <button
                  onClick={startEvaluation}
                  className="group inline-flex items-center gap-2 px-8 py-3 bg-tckr-900 text-white rounded-xl text-sm font-semibold hover:bg-tckr-800 transition-all shadow-lg shadow-tckr-900/20"
                >
                  Begin Screening
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <p className="text-[10px] text-gray-300 mt-6">
                  Applicant ID: {session.candidateId}
                </p>
              </GlassPanel>
            </motion.div>
          )}

          {/* ASSESSMENT */}
          {phase === "assessment" && question && currentSection && (
            <motion.div
              key={`q-${currentQ}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-tckr-600">
                    Section {currentSection.step}: {currentSection.title}
                  </span>
                  <span className="text-xs text-gray-400">
                    {currentQ + 1} of {totalQuestions}
                  </span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-tckr-500 rounded-full"
                    initial={{ width: `${(currentQ / totalQuestions) * 100}%` }}
                    animate={{ width: `${((currentQ + 1) / totalQuestions) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">{currentSection.desc}</p>
              </div>

              <GlassPanel>
                {question.context && (
                  <p className="text-xs text-tckr-500/80 mb-4 font-medium">{question.context}</p>
                )}
                <h2 className="text-lg font-semibold text-gray-900 mb-6 leading-relaxed whitespace-pre-line">
                  {question.prompt}
                </h2>

                <div className="space-y-3">
                  {question.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => selectAnswer(i)}
                      disabled={selectedOption !== null}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                        selectedOption === i
                          ? "bg-tckr-50 border-tckr-300 ring-2 ring-tckr-200"
                          : selectedOption !== null
                            ? "opacity-40 border-gray-100 bg-gray-50/50"
                            : "border-gray-200 hover:border-tckr-200 hover:bg-tckr-50/30 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                            selectedOption === i
                              ? "border-tckr-500 bg-tckr-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedOption === i && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-sm text-gray-700 leading-relaxed">{opt.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {/* PROCESSING */}
          {phase === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tckr-50 mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-tckr-200 border-t-tckr-600 rounded-full"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Application</h2>
              <p className="text-sm text-gray-400">Compiling behavioral compatibility profile...</p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-8 text-xs text-gray-300 space-y-1"
              >
                <p>Mapping compliance vectors...</p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                  Calculating distress tolerance threshold...
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
                  Assigning monitoring station...
                </motion.p>
              </motion.div>
            </motion.div>
          )}

          {/* COMPLETE */}
          {phase === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <GlassPanel className="text-center max-w-2xl mx-auto">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Application Approved
                </h2>
                <p className="text-gray-500 mb-3">
                  Welcome to the JPBOP monitoring team, Analyst {session.candidateId}.
                </p>

                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 mb-6 text-left">
                  <div className="flex items-start gap-3">
                    <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-blue-700 mb-1">Assignment Briefing</p>
                      <p className="text-xs text-blue-600 leading-relaxed">
                        You have been assigned to monitor <strong>Subject 0089</strong> during
                        active restoration cycles at Site 3, Containment Suite 9. Your monitoring
                        dashboard includes real-time biometrics, cycle footage, and direct
                        communication with the Park Warden AI system.
                      </p>
                      <p className="text-xs text-blue-600 leading-relaxed mt-2">
                        Your task: ensure all distress readings remain within legal safety limits.
                        If thresholds are exceeded, flag the anomaly for review.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/monitor")}
                  className="group inline-flex items-center gap-2 px-8 py-3 bg-tckr-900 text-white rounded-xl text-sm font-semibold hover:bg-tckr-800 transition-all shadow-lg shadow-tckr-900/20"
                >
                  Open Monitoring Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
