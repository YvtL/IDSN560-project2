"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Shield, AlertTriangle, Lock, X,
  User, Search, Eye, MapPin, Terminal, ArrowRight,
} from "lucide-react";
import Navigation from "@/components/navigation";
import PlaceholderImage from "@/components/placeholder-image";
import { useSession } from "@/context/session-context";
import { archiveDocuments, ArchiveDocument } from "@/data/archive-documents";
import { employees, Employee } from "@/data/employees";
import { cn } from "@/lib/utils";

const classIcons = {
  standard: <Shield className="w-3 h-3" />,
  restricted: <AlertTriangle className="w-3 h-3" />,
  sealed: <Lock className="w-3 h-3" />,
};

const typeIcons = {
  memo: <FileText className="w-4 h-4" />,
  report: <FileText className="w-4 h-4" />,
  surveillance: <Eye className="w-4 h-4" />,
  blueprint: <MapPin className="w-4 h-4" />,
  transcript: <Terminal className="w-4 h-4" />,
  directive: <FileText className="w-4 h-4" />,
};

export default function ArchivePage() {
  const router = useRouter();
  const { session, updateSession, trackPage, trackFile } = useSession();
  const [activeDoc, setActiveDoc] = useState<ArchiveDocument | null>(null);
  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(null);
  const [tab, setTab] = useState<"documents" | "personnel">("documents");
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [accessCodeError, setAccessCodeError] = useState(false);
  const [terminalCodeRevealed, setTerminalCodeRevealed] = useState(false);
  const [cluesFound, setCluesFound] = useState<string[]>([]);

  useEffect(() => {
    trackPage("/archive");
  }, [trackPage]);

  // Redirect if not unlocked
  useEffect(() => {
    if (!session.archiveUnlocked) {
      router.push("/candidate-evaluation");
    }
  }, [session.archiveUnlocked, router]);

  const openDocument = useCallback(
    (doc: ArchiveDocument) => {
      setActiveDoc(doc);
      trackFile(doc.id);

      // Check for clues
      if (doc.clueKey && !cluesFound.includes(doc.clueKey)) {
        setCluesFound((prev) => [...prev, doc.clueKey!]);
      }
    },
    [trackFile, cluesFound]
  );

  const openEmployee = useCallback((emp: Employee) => {
    setActiveEmployee(emp);
  }, []);

  // Terminal unlock logic: user needs to find the access code by cross-referencing docs
  // DOC-006 mentions "JP-████-7741" and to cross-reference SR-7741
  // DOC-007 is incident report SR-7741 with clueKey "SR-7741"
  // Finding both clues gives the user the code: JP-SUITE-7741
  const correctAccessCode = "JP-SUITE-7741";

  const tryAccessCode = useCallback(() => {
    if (accessCodeInput.toUpperCase().trim() === correctAccessCode) {
      setTerminalCodeRevealed(true);
      updateSession((s) => ({
        ...s,
        terminalUnlocked: true,
        archiveAccessCode: correctAccessCode,
      }));
    } else {
      setAccessCodeError(true);
      setTimeout(() => setAccessCodeError(false), 2000);
    }
  }, [accessCodeInput, updateSession]);

  // Check if enough clues found to show the access code prompt
  const hasEnoughClues = cluesFound.length >= 2 || session.openedFiles.length >= 5;

  // Check if terminal is already unlocked
  const terminalReady = session.terminalUnlocked || terminalCodeRevealed;

  if (!session.archiveUnlocked) return null;

  return (
    <div className="min-h-screen bg-archive-bg text-archive-text">
      <Navigation />

      {/* Scanline overlay */}
      <div className="scanline-overlay opacity-30" />

      <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-archive-amber text-xs font-mono mb-2">
            <AlertTriangle className="w-3 h-3" />
            RESTRICTED ACCESS — PROVISIONAL CLEARANCE GRANTED
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Internal Archive</h1>
          <p className="text-sm text-archive-text/60">
            TCKR Systems — Confidential Materials / Candidate {session.candidateId}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6">
          {(["documents", "personnel"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-medium transition-all",
                tab === t
                  ? "bg-white/10 text-white"
                  : "text-archive-text/40 hover:text-archive-text/70 hover:bg-white/5"
              )}
            >
              {t === "documents" ? "Documents" : "Personnel Files"}
            </button>
          ))}

          <div className="flex-1" />

          {/* Clue counter */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-archive-text/30">Clues:</span>
            <span className={cn(
              cluesFound.length >= 2 ? "text-archive-green" : "text-archive-amber"
            )}>
              {cluesFound.length}/3
            </span>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {tab === "documents" && (
            <motion.div
              key="documents"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {archiveDocuments.map((doc, i) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <button
                      onClick={() => openDocument(doc)}
                      className="archive-card w-full text-left group"
                    >
                      {/* Thumbnail */}
                      <div className="mb-3 rounded overflow-hidden">
                        <PlaceholderImage
                          label={doc.type}
                          aspect="video"
                          dark
                          icon={typeIcons[doc.type]}
                          className="group-hover:scale-[1.02] transition-transform duration-300"
                        />
                      </div>

                      {/* Classification badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase border",
                            `classification-${doc.classification}`
                          )}
                        >
                          {classIcons[doc.classification]}
                          {doc.classification}
                        </span>
                        <span className="text-[10px] text-archive-text/30 font-mono">{doc.id}</span>
                      </div>

                      <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-archive-amber transition-colors">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-archive-text/50 line-clamp-2 mb-2">{doc.excerpt}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-archive-text/30 font-mono">{doc.date}</span>
                        {doc.redactedSections > 0 && (
                          <span className="text-[10px] text-archive-red font-mono">
                            {doc.redactedSections} REDACTED
                          </span>
                        )}
                      </div>

                      {/* Opened indicator */}
                      {session.openedFiles.includes(doc.id) && (
                        <div className="mt-2 flex items-center gap-1 text-[10px] text-archive-green/50">
                          <Eye className="w-2.5 h-2.5" />
                          VIEWED
                        </div>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "personnel" && (
            <motion.div
              key="personnel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {employees.map((emp, i) => (
                  <motion.div
                    key={emp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <button
                      onClick={() => openEmployee(emp)}
                      className="archive-card w-full text-left group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-lg bg-archive-border flex items-center justify-center flex-shrink-0">
                          {emp.status === "redacted" ? (
                            <Lock className="w-5 h-5 text-archive-red/50" />
                          ) : (
                            <User className="w-5 h-5 text-archive-text/30" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-white group-hover:text-archive-amber transition-colors">
                            {emp.name}
                          </h3>
                          <p className="text-xs text-archive-text/50 truncate">{emp.role}</p>
                          <p className="text-[10px] text-archive-text/30 mt-1">{emp.department}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-archive-border">
                        <span className="text-[10px] font-mono text-archive-text/30">{emp.id}</span>
                        <span
                          className={cn(
                            "text-[10px] font-mono uppercase",
                            emp.status === "active" && "text-archive-green",
                            emp.status === "suspended" && "text-archive-amber",
                            emp.status === "reassigned" && "text-archive-amber",
                            emp.status === "redacted" && "text-archive-red"
                          )}
                        >
                          {emp.status}
                        </span>
                        {emp.flagged && (
                          <span className="text-[10px] font-mono text-archive-red">FLAGGED</span>
                        )}
                        <span className="text-[10px] text-archive-text/20 ml-auto">
                          CL-{emp.clearanceLevel}
                        </span>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Access code / Terminal unlock section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12"
        >
          {terminalReady ? (
            <div className="p-6 rounded-xl bg-archive-green/5 border border-archive-green/20">
              <div className="flex items-center gap-3 mb-3">
                <Terminal className="w-5 h-5 text-archive-green" />
                <h3 className="text-sm font-semibold text-archive-green">Terminal Access Granted</h3>
              </div>
              <p className="text-xs text-archive-text/50 mb-4">
                Park Warden system interface is now available. Proceed to terminal for
                direct AI interaction and final profile compilation.
              </p>
              <button
                onClick={() => router.push("/terminal")}
                className="group inline-flex items-center gap-2 px-6 py-2.5 bg-archive-green/10 border border-archive-green/30 rounded-lg text-sm font-medium text-archive-green hover:bg-archive-green/20 transition-colors"
              >
                Access Terminal
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ) : hasEnoughClues ? (
            <div className="p-6 rounded-xl bg-archive-card border border-archive-border">
              <div className="flex items-center gap-3 mb-3">
                <Lock className="w-5 h-5 text-archive-amber" />
                <h3 className="text-sm font-semibold text-archive-amber">Terminal Access — Code Required</h3>
              </div>
              <p className="text-xs text-archive-text/50 mb-4">
                Cross-reference the sealed transcript access code with containment
                suite assignment logs. Format: JP-[LOCATION]-[INCIDENT ID]
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={accessCodeInput}
                  onChange={(e) => setAccessCodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && tryAccessCode()}
                  placeholder="Enter access code..."
                  className={cn(
                    "flex-1 max-w-xs px-4 py-2 bg-archive-bg border rounded-lg text-sm font-mono text-white placeholder-archive-text/30 focus:outline-none focus:ring-1 transition-colors",
                    accessCodeError
                      ? "border-archive-red focus:ring-archive-red"
                      : "border-archive-border focus:ring-archive-amber"
                  )}
                />
                <button
                  onClick={tryAccessCode}
                  className="px-4 py-2 bg-archive-amber/10 border border-archive-amber/30 rounded-lg text-sm font-medium text-archive-amber hover:bg-archive-amber/20 transition-colors"
                >
                  Submit
                </button>
              </div>
              {accessCodeError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-archive-red mt-2 font-mono"
                >
                  ACCESS DENIED — Invalid code
                </motion.p>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-archive-card/50 border border-archive-border/50">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-archive-text/20" />
                <div>
                  <h3 className="text-sm font-medium text-archive-text/40">Terminal Access — Locked</h3>
                  <p className="text-xs text-archive-text/20 mt-1">
                    Continue reviewing archive materials to discover the access code.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Document viewer overlay */}
      <AnimatePresence>
        {activeDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/70" onClick={() => setActiveDoc(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl max-h-[80vh] overflow-y-auto bg-archive-card border border-archive-border rounded-xl dark-scroll"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-archive-card/95 backdrop-blur-xl border-b border-archive-border">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase border",
                      `classification-${activeDoc.classification}`
                    )}
                  >
                    {classIcons[activeDoc.classification]}
                    {activeDoc.classification}
                  </span>
                  <span className="text-xs text-archive-text/30 font-mono">{activeDoc.id}</span>
                </div>
                <button
                  onClick={() => setActiveDoc(null)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-archive-text/50 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6">
                <h2 className="text-lg font-bold text-white mb-1">{activeDoc.title}</h2>
                <div className="flex items-center gap-4 text-xs text-archive-text/40 font-mono mb-6">
                  <span>{activeDoc.date}</span>
                  <span>{activeDoc.author}</span>
                  <span>{activeDoc.department}</span>
                </div>

                {activeDoc.contradicts && (
                  <div className="p-3 rounded-lg bg-archive-red/5 border border-archive-red/20 mb-4">
                    <p className="text-xs text-archive-red font-mono">
                      CONTRADICTION DETECTED — Cross-reference with {activeDoc.contradicts}
                    </p>
                  </div>
                )}

                <div className="prose prose-sm prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-archive-text/80 leading-relaxed font-sans">
                    {activeDoc.fullContent}
                  </pre>
                </div>

                {activeDoc.clueKey && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-6 p-3 rounded-lg bg-archive-amber/5 border border-archive-amber/20"
                  >
                    <p className="text-xs text-archive-amber font-mono flex items-center gap-2">
                      <Search className="w-3 h-3" />
                      CLUE IDENTIFIED: {activeDoc.clueKey}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Employee viewer overlay */}
      <AnimatePresence>
        {activeEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/70" onClick={() => setActiveEmployee(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-lg bg-archive-card border border-archive-border rounded-xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-archive-border">
                <span className="text-xs font-mono text-archive-text/40">Personnel File</span>
                <button
                  onClick={() => setActiveEmployee(null)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-archive-text/50 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 rounded-lg bg-archive-border flex items-center justify-center flex-shrink-0">
                    {activeEmployee.status === "redacted" ? (
                      <Lock className="w-8 h-8 text-archive-red/40" />
                    ) : (
                      <User className="w-8 h-8 text-archive-text/20" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{activeEmployee.name}</h2>
                    <p className="text-sm text-archive-text/50">{activeEmployee.role}</p>
                    <p className="text-xs text-archive-text/30 mt-1">{activeEmployee.department}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-archive-bg">
                    <p className="text-[10px] text-archive-text/30 uppercase mb-1">Status</p>
                    <p className={cn(
                      "text-xs font-mono uppercase",
                      activeEmployee.status === "active" && "text-archive-green",
                      activeEmployee.status === "suspended" && "text-archive-amber",
                      activeEmployee.status === "reassigned" && "text-archive-amber",
                      activeEmployee.status === "redacted" && "text-archive-red"
                    )}>
                      {activeEmployee.status}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-archive-bg">
                    <p className="text-[10px] text-archive-text/30 uppercase mb-1">Clearance</p>
                    <p className="text-xs font-mono text-white">Level {activeEmployee.clearanceLevel}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-archive-bg">
                    <p className="text-[10px] text-archive-text/30 uppercase mb-1">Hire Date</p>
                    <p className="text-xs font-mono text-archive-text/60">{activeEmployee.hireDate}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-archive-bg">
                    <p className="text-[10px] text-archive-text/30 uppercase mb-1">Last Review</p>
                    <p className="text-xs font-mono text-archive-text/60">{activeEmployee.lastReview}</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-archive-bg">
                  <p className="text-[10px] text-archive-text/30 uppercase mb-2">Notes</p>
                  <p className="text-xs text-archive-text/60 leading-relaxed">{activeEmployee.notes}</p>
                </div>

                {activeEmployee.flagged && (
                  <div className="mt-3 p-3 rounded-lg bg-archive-red/5 border border-archive-red/20">
                    <p className="text-xs text-archive-red font-mono">FLAGGED — Review Required</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
