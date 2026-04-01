"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Star, Archive, Trash2, AlertTriangle, ChevronRight,
  Paperclip, Clock, Shield, Reply,
} from "lucide-react";
import { useSession } from "@/context/session-context";
import { assignRole } from "@/data/roles";
import { getAwarenessLines } from "@/lib/session";
import { cn } from "@/lib/utils";

interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  time: string;
  read: boolean;
  starred: boolean;
  hasAttachment: boolean;
  category: "primary" | "system";
}

const mockEmails: Email[] = [
  {
    id: "tckr-confirm",
    from: "TCKR Systems — HR Division",
    fromEmail: "hr-noreply@tckrsystems.net",
    subject: "Your JPBOP session has been archived",
    preview: "Thank you for participating in the monitoring evaluation. Your behavioral profile has been compiled and your session data...",
    time: "Just now",
    read: false,
    starred: false,
    hasAttachment: true,
    category: "primary",
  },
  {
    id: "welcome",
    from: "TCKR Onboarding",
    fromEmail: "onboarding@tckrsystems.net",
    subject: "Welcome to TCKR Systems — Application Received",
    preview: "Thank you for your application to the Behavioral Monitoring Analyst position. Your screening evaluation has been scheduled...",
    time: "32 min ago",
    read: true,
    starred: false,
    hasAttachment: false,
    category: "primary",
  },
  {
    id: "system-1",
    from: "JPBOP System",
    fromEmail: "system@jpbop.internal",
    subject: "MONITORING SESSION LOG — Analyst " ,
    preview: "Automated session log: monitoring duration, biometric interactions, footage accessed, files opened...",
    time: "12 min ago",
    read: true,
    starred: false,
    hasAttachment: true,
    category: "system",
  },
  {
    id: "promo",
    from: "TCKR Careers",
    fromEmail: "careers@tckrsystems.net",
    subject: "New roles available in the JPBOP program",
    preview: "Based on your profile, you may be interested in other operational positions within the JPBOP division...",
    time: "1 hour ago",
    read: true,
    starred: false,
    hasAttachment: false,
    category: "primary",
  },
];

export default function InboxPage() {
  const router = useRouter();
  const { session, trackPage } = useSession();
  const [openEmailId, setOpenEmailId] = useState<string | null>(null);
  const [revealStage, setRevealStage] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    trackPage("/inbox");
    setTimeout(() => setLoaded(true), 800);
  }, [trackPage]);

  // Redirect if not ready
  useEffect(() => {
    if (!session.aiConversationComplete && !session.terminalComplete) {
      router.push("/");
    }
  }, [session.aiConversationComplete, session.terminalComplete, router]);

  const role = useMemo(() => assignRole(session.scores), [session.scores]);
  const awarenessLines = useMemo(() => getAwarenessLines(session), [session]);

  const emails = useMemo(() => {
    return mockEmails.map((e) => {
      if (e.id === "system-1") {
        return { ...e, subject: `MONITORING SESSION LOG — Analyst ${session.candidateId}` };
      }
      return e;
    });
  }, [session.candidateId]);

  const openedEmail = emails.find((e) => e.id === openEmailId);

  // Progressive reveal for the main email
  useEffect(() => {
    if (openEmailId === "tckr-confirm") {
      const timers = [
        setTimeout(() => setRevealStage(1), 500),
        setTimeout(() => setRevealStage(2), 2000),
        setTimeout(() => setRevealStage(3), 4000),
        setTimeout(() => setRevealStage(4), 6500),
        setTimeout(() => setRevealStage(5), 9000),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [openEmailId]);

  if (!session.aiConversationComplete && !session.terminalComplete) return null;

  return (
    <div className="min-h-screen bg-[#f6f8fc] flex flex-col">
      {/* Email client chrome */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-800">Mail</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-tckr-600 flex items-center justify-center text-[10px] font-bold text-white">
            {session.candidateId.charAt(3)}
          </div>
        </div>
      </div>

      <div className="flex flex-1 max-w-6xl w-full mx-auto">
        {/* Sidebar */}
        <div className="w-56 bg-white border-r border-gray-100 p-4 hidden md:block">
          <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium mb-6">
            <Mail className="w-4 h-4" />
            Compose
          </button>
          <nav className="space-y-1">
            {[
              { icon: <Mail className="w-4 h-4" />, label: "Inbox", count: emails.filter((e) => !e.read).length },
              { icon: <Star className="w-4 h-4" />, label: "Starred", count: 0 },
              { icon: <Archive className="w-4 h-4" />, label: "Archive", count: 0 },
              { icon: <Trash2 className="w-4 h-4" />, label: "Trash", count: 0 },
            ].map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer",
                  item.label === "Inbox" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-500 hover:bg-gray-50"
                )}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.count > 0 && (
                  <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Email list / reader */}
        <div className="flex-1 bg-white">
          <AnimatePresence mode="wait">
            {!openEmailId ? (
              /* EMAIL LIST */
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                  <h2 className="text-sm font-medium text-gray-800">Inbox</h2>
                  <span className="text-xs text-gray-400">({emails.length})</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {loaded && emails.map((email, i) => (
                    <motion.button
                      key={email.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setOpenEmailId(email.id)}
                      className={cn(
                        "w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors",
                        !email.read && "bg-blue-50/30"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold",
                        email.id === "tckr-confirm" ? "bg-red-100 text-red-600" :
                        email.category === "system" ? "bg-gray-100 text-gray-500" : "bg-tckr-100 text-tckr-700"
                      )}>
                        {email.from.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={cn("text-sm truncate", !email.read ? "font-semibold text-gray-900" : "text-gray-700")}>
                            {email.from}
                          </span>
                          <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">{email.time}</span>
                        </div>
                        <p className={cn("text-sm truncate", !email.read ? "font-medium text-gray-800" : "text-gray-600")}>
                          {email.subject}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{email.preview}</p>
                      </div>
                      {email.hasAttachment && (
                        <Paperclip className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-1" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* EMAIL READER */
              <motion.div
                key="reader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full overflow-y-auto"
              >
                {/* Back bar */}
                <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-4">
                  <button
                    onClick={() => { setOpenEmailId(null); setRevealStage(0); }}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 rotate-180" />
                    Back
                  </button>
                  <div className="flex items-center gap-2 ml-auto">
                    <Archive className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
                    <Trash2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
                  </div>
                </div>

                {openedEmail && (
                  <div className="p-6 max-w-3xl">
                    <h1 className="text-xl font-semibold text-gray-900 mb-4">{openedEmail.subject}</h1>

                    <div className="flex items-start gap-3 mb-6">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
                        openedEmail.id === "tckr-confirm" ? "bg-red-100 text-red-600" : "bg-tckr-100 text-tckr-700"
                      )}>
                        {openedEmail.from.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{openedEmail.from}</span>
                          <span className="text-xs text-gray-400">&lt;{openedEmail.fromEmail}&gt;</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                          <span>to me</span>
                          <span>&middot;</span>
                          <span>{openedEmail.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* THE REVEAL EMAIL */}
                    {openedEmail.id === "tckr-confirm" && (
                      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <p>Dear Analyst {session.candidateId},</p>
                          <p className="mt-3">
                            Thank you for completing your monitoring session for the Justice Park Behavioral Operations Program.
                            Your work during this evaluation has been recorded and archived under Protocol 9.
                          </p>
                        </motion.div>

                        {revealStage >= 1 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-lg bg-gray-50 border border-gray-200"
                          >
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Session Summary</p>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-gray-400">Pages visited:</span>
                                <span className="ml-1 text-gray-700">{Object.keys(session.pageVisits).length}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Files accessed:</span>
                                <span className="ml-1 text-gray-700">{session.openedFiles.length}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Footage reviewed:</span>
                                <span className="ml-1 text-gray-700">{session.footageWatched.length}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Alert responses:</span>
                                <span className="ml-1 text-gray-700">{session.overrideAttempts}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {revealStage >= 2 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <p>
                              We should clarify something about the nature of your participation.
                            </p>
                            <p className="mt-3">
                              The monitoring task you completed was not a job evaluation. It was a
                              behavioral integration session. Your responses, hesitations, decisions,
                              and interaction patterns were collected to calibrate the system that
                              manages Subject 0089{"'"}s punishment cycle.
                            </p>
                          </motion.div>
                        )}

                        {revealStage >= 3 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-lg bg-red-50 border border-red-200"
                          >
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-semibold text-red-700 mb-2">Reclassification Notice</p>
                                <p className="text-sm text-red-600">
                                  Your role has been reclassified from <strong>Behavioral Monitoring Analyst</strong> to:
                                </p>
                                <p className="text-lg font-bold text-red-800 mt-2">{role.icon} {role.title}</p>
                                <p className="text-xs text-red-500 mt-2 leading-relaxed">{role.description}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {revealStage >= 4 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            {awarenessLines.length > 0 && (
                              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 mb-4">
                                <p className="text-xs font-semibold text-amber-700 mb-2">Behavioral Observations</p>
                                <ul className="space-y-1.5">
                                  {awarenessLines.map((line, i) => (
                                    <motion.li
                                      key={i}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: i * 0.4 }}
                                      className="text-xs text-amber-600 flex items-start gap-2"
                                    >
                                      <span className="text-amber-400 mt-0.5">&gt;</span>
                                      {line}
                                    </motion.li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <p>
                              Every interaction you had — every file you opened, every second you
                              spent watching the footage, every time you checked the biometrics —
                              was used to refine the behavioral parameters of Victoria{"'"}s cycle.
                            </p>
                            <p className="mt-3">
                              You were not observing the system. You were part of it.
                              The audience always is.
                            </p>
                          </motion.div>
                        )}

                        {revealStage >= 5 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                          >
                            <div className="p-4 rounded-lg bg-gray-900 text-gray-400">
                              <p className="text-xs font-mono leading-relaxed italic">
                                {role.systemNote}
                              </p>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                              <p className="text-xs text-gray-400 leading-relaxed">
                                This session has been archived under Protocol 9. Your behavioral
                                profile, response patterns, and session metadata will be retained
                                for integration into future reset cycles. Candidate re-evaluation
                                may occur without notice.
                              </p>
                              <p className="text-xs text-gray-300 mt-3">
                                TCKR Systems — JPBOP Division<br />
                                All sessions are permanent.
                              </p>
                            </div>

                            {/* Attachment */}
                            {openedEmail.hasAttachment && (
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                                <Paperclip className="w-4 h-4 text-gray-400" />
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-gray-700">candidate-profile-{session.candidateId}.pdf</p>
                                  <p className="text-[10px] text-gray-400">Behavioral profile &middot; 2.4 MB</p>
                                </div>
                                <img
                                  src="/images/ui/candidate-dossier-graphic.png"
                                  alt="Profile attachment"
                                  className="w-16 h-10 rounded object-cover border border-gray-200"
                                />
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Welcome / other emails — simple body */}
                    {openedEmail.id === "welcome" && (
                      <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                        <p>Dear applicant,</p>
                        <p>
                          Thank you for your interest in the Behavioral Monitoring Analyst position
                          at TCKR Systems. Your application has been received and your screening
                          evaluation has been scheduled.
                        </p>
                        <p>
                          Please complete the evaluation at your earliest convenience. Upon approval,
                          you will be granted access to your assigned monitoring station.
                        </p>
                        <p className="text-xs text-gray-400 mt-6">
                          TCKR Systems — Human Resources Division<br />
                          This is an automated message. Do not reply.
                        </p>
                      </div>
                    )}

                    {openedEmail.id === "system-1" && (
                      <div className="text-sm text-gray-700 leading-relaxed">
                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 font-mono text-xs space-y-2">
                          <p className="text-gray-500">SESSION LOG — AUTOMATED</p>
                          <p>Analyst: {session.candidateId}</p>
                          <p>Subject: 0089 | Cycle: 1,247</p>
                          <p>Monitoring Duration: {Math.floor(session.monitoringDuration / 1000)}s</p>
                          <p>Files Accessed: {session.openedFiles.length}</p>
                          <p>Footage Segments Viewed: {session.footageWatched.length}</p>
                          <p>Biometric Panel Interactions: {session.biometricsInteractions}</p>
                          <p>Override Attempts: {session.overrideAttempts}</p>
                          <p className="text-gray-400 mt-3">
                            Status: ARCHIVED — Protocol 9
                          </p>
                        </div>
                      </div>
                    )}

                    {openedEmail.id === "promo" && (
                      <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                        <p>Based on your behavioral profile, you may be suited for additional roles within the JPBOP program:</p>
                        <ul className="space-y-2 text-xs text-gray-600">
                          <li>- Cycle Administrator (Operations)</li>
                          <li>- Remote Warden Operator (Containment Systems)</li>
                          <li>- Audience Experience Coordinator (Public Engagement)</li>
                        </ul>
                        <p className="text-xs text-gray-400 mt-4">
                          Positions are filled on a rolling basis. Your profile remains on file.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
