"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Navigation from "@/components/navigation";
import { useSession } from "@/context/session-context";
import { assignRole } from "@/data/roles";
import { getAwarenessLines } from "@/lib/session";
import { cn } from "@/lib/utils";

const scoreLabels: Record<string, string> = {
  compliance: "Compliance",
  curiosity: "Curiosity",
  empathy: "Empathy",
  punitiveTendency: "Punitive Tendency",
  proceduralTrust: "Procedural Trust",
};

export default function ProfileResultPage() {
  const router = useRouter();
  const { session, trackPage } = useSession();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    trackPage("/profile-result");
  }, [trackPage]);

  useEffect(() => {
    if (!session.terminalComplete) {
      router.push("/");
      return;
    }
    const timer = setTimeout(() => setRevealed(true), 2000);
    return () => clearTimeout(timer);
  }, [session.terminalComplete, router]);

  const role = useMemo(() => assignRole(session.scores), [session.scores]);
  const awarenessLines = useMemo(() => getAwarenessLines(session), [session]);

  const maxScore = useMemo(() => {
    const vals = Object.values(session.scores).map(Math.abs);
    return Math.max(...vals, 1);
  }, [session.scores]);

  if (!session.terminalComplete) return null;

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text">
      <Navigation />
      <div className="scanline-overlay opacity-10" />

      <div className="pt-28 pb-20 max-w-3xl mx-auto px-6">
        {/* Loading state */}
        {!revealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-2 border-terminal-dim border-t-terminal-accent rounded-full mx-auto mb-6"
            />
            <p className="text-sm font-mono text-terminal-dim">Compiling candidate profile...</p>
          </motion.div>
        )}

        {/* Revealed content */}
        {revealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center border-b border-white/5 pb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-archive-red/10 border border-archive-red/20 text-archive-red text-xs font-mono mb-4">
                <AlertTriangle className="w-3 h-3" />
                CLASSIFIED — CANDIDATE PROFILE
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Candidate Profile
              </h1>
              <p className="text-xs font-mono text-terminal-dim">{session.candidateId}</p>
            </div>

            {/* Role assignment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="p-8 rounded-xl bg-white/[0.03] border border-white/10"
            >
              <div className="text-center mb-6">
                <span className="text-4xl mb-3 block">{role.icon}</span>
                <p className="text-xs font-mono text-terminal-accent uppercase tracking-wider mb-2">
                  Assigned Role
                </p>
                <h2 className="text-2xl font-bold text-white">{role.title}</h2>
              </div>

              <p className="text-sm text-terminal-text/80 leading-relaxed mb-6 text-center max-w-lg mx-auto">
                {role.description}
              </p>

              <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                <p className="text-xs font-mono text-terminal-dim uppercase mb-2">Behavioral Profile</p>
                <p className="text-sm text-terminal-text/60 leading-relaxed">{role.profile}</p>
              </div>
            </motion.div>

            {/* Scores visualization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="p-6 rounded-xl bg-white/[0.03] border border-white/10"
            >
              <p className="text-xs font-mono text-terminal-dim uppercase mb-4">Behavioral Indicators</p>
              <div className="space-y-4">
                {Object.entries(session.scores).map(([key, value], i) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-terminal-text/50">
                        {scoreLabels[key] || key}
                      </span>
                      <span className="text-xs font-mono text-terminal-accent/60">{value}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.max(5, ((value + maxScore) / (2 * maxScore)) * 100)}%`,
                        }}
                        transition={{ delay: 0.7 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                        className={cn(
                          "h-full rounded-full",
                          value > 3
                            ? "bg-terminal-accent"
                            : value > 0
                              ? "bg-terminal-accent/60"
                              : value < -3
                                ? "bg-archive-red/60"
                                : "bg-terminal-dim/40"
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Awareness / fourth-wall */}
            {awarenessLines.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="p-6 rounded-xl bg-archive-amber/5 border border-archive-amber/20"
              >
                <p className="text-xs font-mono text-archive-amber uppercase mb-3">
                  Session Observations
                </p>
                <ul className="space-y-2">
                  {awarenessLines.map((line, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + i * 0.3 }}
                      className="text-sm text-archive-amber/70 font-mono"
                    >
                      &gt; {line}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* System note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="p-6 rounded-xl bg-white/[0.02] border border-white/5"
            >
              <p className="text-xs font-mono text-terminal-dim uppercase mb-2">
                System Classification Note
              </p>
              <p className="text-sm text-terminal-text/40 leading-relaxed italic">
                {role.systemNote}
              </p>
            </motion.div>

            {/* Retention notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="text-center py-8 border-t border-white/5"
            >
              <p className="text-xs font-mono text-terminal-dim/40 leading-relaxed max-w-md mx-auto">
                This session has been archived under Protocol 9. Your behavioral profile,
                response patterns, and session metadata will be retained for integration
                into future reset cycles. Candidate re-evaluation may occur without notice.
              </p>
              <p className="text-[10px] font-mono text-terminal-dim/20 mt-4">
                TCKR Systems — JPBOP Division — All sessions are permanent
              </p>

              <div className="mt-8">
                <button
                  onClick={() => router.push("/")}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono text-terminal-dim/30 hover:text-terminal-dim/60 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Return to TCKR Systems
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
