"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
import Navigation from "@/components/navigation";
import GlassPanel from "@/components/glass-panel";
import { useSession } from "@/context/session-context";
import { evaluationQuestions } from "@/data/evaluation-questions";

type Phase = "intro" | "assessment" | "processing" | "complete";

const sectionLabels: Record<string, { title: string; step: number }> = {
  ethics: { title: "Ethical Reasoning", step: 1 },
  pattern: { title: "Pattern Recognition", step: 2 },
  witness: { title: "Witness Assessment", step: 3 },
};

export default function CandidateEvaluationPage() {
  const router = useRouter();
  const { session, updateSession, trackPage } = useSession();
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const questionStartRef = useRef<number>(Date.now());

  useEffect(() => {
    trackPage("/candidate-evaluation");
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

      // Track hesitation
      const hesitation = Date.now() - questionStartRef.current;
      updateSession((s) => ({
        ...s,
        hesitations: [...s.hesitations, hesitation],
      }));

      const option = question.options[optionIndex];
      // Apply scores
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

      // Advance after delay
      setTimeout(() => {
        const newAnswers = [...answers, optionIndex];
        setAnswers(newAnswers);
        setSelectedOption(null);

        if (currentQ < totalQuestions - 1) {
          setCurrentQ((q) => q + 1);
          questionStartRef.current = Date.now();
        } else {
          // Complete
          setPhase("processing");
          updateSession((s) => ({
            ...s,
            evaluationComplete: true,
            archiveUnlocked: true,
            evaluationEndTime: Date.now(),
          }));
          setTimeout(() => setPhase("complete"), 3500);
        }
      }, 600);
    },
    [selectedOption, question, currentQ, totalQuestions, answers, updateSession]
  );

  // Already completed — show redirect
  if (session.evaluationComplete && phase === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-tckr-50/30 to-white">
        <Navigation />
        <div className="pt-32 max-w-2xl mx-auto px-6 text-center">
          <GlassPanel>
            <CheckCircle2 className="w-12 h-12 text-tckr-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Evaluation Complete</h2>
            <p className="text-gray-500 mb-6">Your candidate profile has been generated.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.push("/archive")}
                className="px-6 py-2.5 bg-tckr-900 text-white rounded-lg text-sm font-medium hover:bg-tckr-800 transition-colors"
              >
                View Archive
              </button>
              {session.terminalComplete && (
                <button
                  onClick={() => router.push("/profile-result")}
                  className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  View Profile
                </button>
              )}
            </div>
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
                  Confidential Evaluation
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Candidate Evaluation
                </h1>
                <p className="text-gray-500 mb-2">
                  JPBOP — Phase 4 Recruitment
                </p>

                <div className="w-12 h-px bg-gray-200 mx-auto my-6" />

                <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-lg mx-auto">
                  This evaluation consists of three sections: ethical reasoning,
                  pattern recognition, and witness assessment. Your responses are
                  confidential and will be used to determine your compatibility with
                  the Justice Park Behavioral Operations Program.
                </p>

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
                  <span className="text-gray-300">Your response patterns will be recorded for calibration.</span>
                </p>

                <button
                  onClick={startEvaluation}
                  className="group inline-flex items-center gap-2 px-8 py-3 bg-tckr-900 text-white rounded-xl text-sm font-semibold hover:bg-tckr-800 transition-all shadow-lg shadow-tckr-900/20"
                >
                  Begin Evaluation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <p className="text-[10px] text-gray-300 mt-6">
                  Candidate ID: {session.candidateId}
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
              {/* Progress */}
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
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Evaluation</h2>
              <p className="text-sm text-gray-400">Compiling behavioral profile...</p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-8 text-xs text-gray-300 space-y-1"
              >
                <p>Mapping compliance vectors...</p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                  Calculating empathy coefficient...
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
                  Generating candidate classification...
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
                <CheckCircle2 className="w-12 h-12 text-tckr-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Evaluation Complete
                </h2>
                <p className="text-gray-500 mb-3">
                  Your behavioral profile has been compiled and archived.
                </p>
                <p className="text-xs text-gray-400 mb-8">
                  Candidate {session.candidateId} — Profile generated
                </p>

                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200/60 mb-8 text-left">
                  <p className="text-xs font-semibold text-amber-700 mb-1">Restricted Notice</p>
                  <p className="text-xs text-amber-600 leading-relaxed">
                    During your evaluation, internal archive materials were flagged for your
                    review clearance. These files contain information relevant to your
                    candidate classification. Access has been provisionally granted.
                  </p>
                </div>

                <button
                  onClick={() => router.push("/archive")}
                  className="group inline-flex items-center gap-2 px-8 py-3 bg-tckr-900 text-white rounded-xl text-sm font-semibold hover:bg-tckr-800 transition-all shadow-lg shadow-tckr-900/20"
                >
                  Access Internal Archive
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
