"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, FileText, Terminal, Eye, AlertTriangle, Lock,
  X, Search, Play, Pause, ChevronRight, Radio, Shield,
  User, MapPin, Clock,
} from "lucide-react";
import Navigation from "@/components/navigation";
import { useSession } from "@/context/session-context";
import { archiveDocuments, ArchiveDocument } from "@/data/archive-documents";
import { employees } from "@/data/employees";
import { terminalDialogue, DialogueResponse } from "@/data/terminal-dialogue";
import { cn } from "@/lib/utils";

type Tab = "biometrics" | "footage" | "files" | "warden";

const classStyles = {
  standard: "text-green-400 border-green-500/30",
  restricted: "text-amber-400 border-amber-500/30",
  sealed: "text-red-400 border-red-500/30",
};

// Simulated biometric data
const biometricReadings = [
  { label: "Heart Rate", value: 82, unit: "BPM", max: 180, warn: 120, critical: 150 },
  { label: "Cortisol", value: 14.2, unit: "μg/dL", max: 30, warn: 18, critical: 25 },
  { label: "Distress Index", value: 3.1, unit: "/10", max: 10, warn: 6, critical: 8 },
  { label: "Awareness", value: 0.3, unit: "%", max: 100, warn: 5, critical: 15 },
];

export default function MonitorPage() {
  const router = useRouter();
  const { session, updateSession, trackPage, trackFile } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("biometrics");
  const [activeDoc, setActiveDoc] = useState<ArchiveDocument | null>(null);
  const [cycleTime, setCycleTime] = useState(0);
  const [biometrics, setBiometrics] = useState(biometricReadings);
  const [alertActive, setAlertActive] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);

  // Warden chat state
  const [wardenMessages, setWardenMessages] = useState<Array<{ speaker: string; text: string }>>([]);
  const [wardenNode, setWardenNode] = useState<string | null>(null);
  const [showWardenResponses, setShowWardenResponses] = useState(false);
  const [wardenTyping, setWardenTyping] = useState(false);
  const [wardenComplete, setWardenComplete] = useState(false);
  const wardenStarted = useRef(false);
  const wardenScrollRef = useRef<HTMLDivElement>(null);

  // Footage state
  const [playingFootage, setPlayingFootage] = useState<string | null>(null);

  useEffect(() => {
    trackPage("/monitor");
  }, [trackPage]);

  // Redirect if not approved
  useEffect(() => {
    if (!session.applicationComplete) {
      router.push("/apply");
    }
  }, [session.applicationComplete, router]);

  // Cycle timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCycleTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track monitoring duration
  useEffect(() => {
    const interval = setInterval(() => {
      updateSession((s) => ({ ...s, monitoringDuration: s.monitoringDuration + 5000 }));
    }, 5000);
    return () => clearInterval(interval);
  }, [updateSession]);

  // Simulate biometric fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setBiometrics((prev) =>
        prev.map((b) => ({
          ...b,
          value: Math.max(
            0,
            Math.min(b.max, b.value + (Math.random() - 0.45) * (b.max * 0.03))
          ),
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Trigger alert after 30 seconds
  useEffect(() => {
    if (cycleTime === 30 && !alertDismissed) {
      setAlertActive(true);
      setBiometrics((prev) =>
        prev.map((b) =>
          b.label === "Distress Index" ? { ...b, value: 6.8 } :
          b.label === "Heart Rate" ? { ...b, value: 134 } :
          b.label === "Cortisol" ? { ...b, value: 19.1 } : b
        )
      );
    }
  }, [cycleTime, alertDismissed]);

  const dismissAlert = () => {
    setAlertActive(false);
    setAlertDismissed(true);
    updateSession((s) => ({ ...s, overrideAttempts: s.overrideAttempts + 1 }));
    // Readings return to normal
    setTimeout(() => {
      setBiometrics(biometricReadings);
    }, 3000);
  };

  const openDocument = useCallback(
    (doc: ArchiveDocument) => {
      setActiveDoc(doc);
      trackFile(doc.id);
      updateSession((s) => ({ ...s, leakedFilesViewed: true }));
    },
    [trackFile, updateSession]
  );

  const handleBiometricsClick = () => {
    updateSession((s) => ({ ...s, biometricsInteractions: s.biometricsInteractions + 1 }));
  };

  // Footage items
  const footageItems = [
    { id: "foot-1", label: "Cycle 1,244 — Disorientation Phase", time: "00:00–00:03", img: "/images/archive/surveillance-facility-exterior-01.png" },
    { id: "foot-2", label: "Cycle 1,244 — Audience Routing", time: "00:08–00:12", img: "/images/hero/neurosync-recruitment-room.png" },
    { id: "foot-3", label: "Cycle 1,247 — Crisis Point", time: "00:30–00:41", img: "/images/archive/surveillance-facility-exterior-01.png" },
  ];

  const watchFootage = (id: string) => {
    setPlayingFootage(id);
    updateSession((s) => ({
      ...s,
      footageWatched: s.footageWatched.includes(id) ? s.footageWatched : [...s.footageWatched, id],
    }));
  };

  // === WARDEN CHAT ===
  const addWardenMessage = useCallback((speaker: string, text: string) => {
    setWardenMessages((prev) => [...prev, { speaker, text }]);
    setTimeout(() => {
      wardenScrollRef.current?.scrollTo({ top: wardenScrollRef.current.scrollHeight, behavior: "smooth" });
    }, 100);
  }, []);

  const processWardenNode = useCallback(
    async (nodeId: string) => {
      const node = terminalDialogue[nodeId];
      if (!node) return;

      setWardenTyping(true);
      await new Promise((r) => setTimeout(r, node.delay || 800));
      setWardenTyping(false);

      addWardenMessage(node.speaker, node.text);
      setWardenNode(nodeId);

      if (node.awareLine === "SESSION_COMPLETE") {
        updateSession((s) => ({ ...s, aiConversationComplete: true, terminalComplete: true }));
        setTimeout(() => setWardenComplete(true), 1500);
        return;
      }

      if (node.autoAdvance) {
        await new Promise((r) => setTimeout(r, 1200));
        processWardenNode(node.autoAdvance);
      } else if (node.responses) {
        setTimeout(() => setShowWardenResponses(true), 400);
      }
    },
    [addWardenMessage, updateSession]
  );

  const selectWardenResponse = useCallback(
    (response: DialogueResponse) => {
      setShowWardenResponses(false);
      addWardenMessage("user", response.text);
      updateSession((s) => ({
        ...s,
        terminalChoices: [...s.terminalChoices, response.nextNode],
        scores: {
          ...s.scores,
          compliance: s.scores.compliance + (response.scoreEffect?.compliance || 0),
          curiosity: s.scores.curiosity + (response.scoreEffect?.curiosity || 0),
          empathy: s.scores.empathy + (response.scoreEffect?.empathy || 0),
        },
      }));
      setTimeout(() => processWardenNode(response.nextNode), 500);
    },
    [addWardenMessage, processWardenNode, updateSession]
  );

  // Start warden when tab is selected
  useEffect(() => {
    if (activeTab === "warden" && !wardenStarted.current) {
      wardenStarted.current = true;
      processWardenNode("init");
    }
  }, [activeTab, processWardenNode]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  if (!session.applicationComplete) return null;

  const currentWardenNode = wardenNode ? terminalDialogue[wardenNode] : null;

  return (
    <div className="min-h-screen bg-archive-bg text-archive-text flex flex-col">
      <Navigation />
      <div className="scanline-overlay opacity-20" />

      {/* Top status bar */}
      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-3 px-4 rounded-t-xl bg-archive-card border border-archive-border border-b-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Radio className={cn("w-3 h-3", alertActive ? "text-red-500 animate-pulse" : "text-green-500")} />
                <span className="text-[10px] font-mono text-archive-text/50">
                  {alertActive ? "ALERT — THRESHOLD BREACH" : "CYCLE ACTIVE — MONITORING"}
                </span>
              </div>
              <span className="text-[10px] font-mono text-archive-text/30">
                Subject 0089 &middot; Cycle 1,247 &middot; Suite 9
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-archive-text/30">
                T+{formatTime(cycleTime)}
              </span>
              <span className="text-[10px] font-mono text-archive-text/30">
                Analyst {session.candidateId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex bg-archive-card border-x border-archive-border">
            {([
              { id: "biometrics" as Tab, icon: <Activity className="w-3.5 h-3.5" />, label: "Biometrics" },
              { id: "footage" as Tab, icon: <Eye className="w-3.5 h-3.5" />, label: "Footage" },
              { id: "files" as Tab, icon: <FileText className="w-3.5 h-3.5" />, label: "Leaked Files" },
              { id: "warden" as Tab, icon: <Terminal className="w-3.5 h-3.5" />, label: "Warden AI" },
            ]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all",
                  activeTab === tab.id
                    ? "border-terminal-accent text-white bg-white/[0.03]"
                    : "border-transparent text-archive-text/40 hover:text-archive-text/60"
                )}
              >
                {tab.icon}
                {tab.label}
                {tab.id === "files" && session.openedFiles.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] bg-archive-amber/10 text-archive-amber">
                    {session.openedFiles.length}
                  </span>
                )}
                {tab.id === "warden" && wardenComplete && (
                  <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] bg-green-500/10 text-green-400">
                    DONE
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 pb-6">
        <div className="max-w-7xl mx-auto bg-archive-card border border-archive-border border-t-0 rounded-b-xl min-h-[60vh] overflow-hidden">
          <AnimatePresence mode="wait">
            {/* BIOMETRICS TAB */}
            {activeTab === "biometrics" && (
              <motion.div
                key="bio"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
                onClick={handleBiometricsClick}
              >
                {/* Alert banner */}
                {alertActive && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                      <div>
                        <p className="text-sm font-semibold text-red-400">Distress Threshold Exceeded</p>
                        <p className="text-xs text-red-400/60">Subject 0089 readings above approved safety limits. Action required.</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); dismissAlert(); }}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        Acknowledge &amp; Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Biometric gauges */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-mono text-archive-text/40 uppercase mb-3">Live Biometric Feed</h3>
                    {biometrics.map((b) => {
                      const pct = (b.value / b.max) * 100;
                      const isWarn = b.value >= b.warn;
                      const isCritical = b.value >= b.critical;
                      return (
                        <div key={b.label} className="p-3 rounded-lg bg-archive-bg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-archive-text/50">{b.label}</span>
                            <span className={cn(
                              "text-sm font-mono",
                              isCritical ? "text-red-400" : isWarn ? "text-amber-400" : "text-green-400"
                            )}>
                              {typeof b.value === "number" ? b.value.toFixed(1) : b.value} {b.unit}
                            </span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 1 }}
                              className={cn(
                                "h-full rounded-full transition-colors",
                                isCritical ? "bg-red-500" : isWarn ? "bg-amber-500" : "bg-green-500"
                              )}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Surveillance view */}
                  <div>
                    <h3 className="text-xs font-mono text-archive-text/40 uppercase mb-3">Surveillance — Suite 9</h3>
                    <div className="relative rounded-lg overflow-hidden bg-black">
                      <img
                        src="/images/archive/surveillance-facility-exterior-01.png"
                        alt="Surveillance feed"
                        className="w-full opacity-70"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-red-400">LIVE</span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-white/40">CAM-09A &middot; SUITE 9</span>
                        <span className="text-[10px] font-mono text-white/40">T+{formatTime(cycleTime)}</span>
                      </div>
                    </div>

                    {/* Subject info card */}
                    <div className="mt-4 p-3 rounded-lg bg-archive-bg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-archive-border flex items-center justify-center">
                          <Lock className="w-4 h-4 text-red-400/50" />
                        </div>
                        <div>
                          <p className="text-xs font-mono text-white">Subject 0089</p>
                          <p className="text-[10px] text-archive-text/40">Cycle 1,247 &middot; Legacy Classification</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* FOOTAGE TAB */}
            {activeTab === "footage" && (
              <motion.div
                key="footage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                <h3 className="text-xs font-mono text-archive-text/40 uppercase mb-4">Archived Cycle Footage</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {footageItems.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => watchFootage(f.id)}
                      className={cn(
                        "rounded-lg overflow-hidden bg-archive-bg border transition-all text-left group",
                        playingFootage === f.id ? "border-terminal-accent" : "border-archive-border hover:border-archive-amber/40"
                      )}
                    >
                      <div className="relative aspect-video">
                        <img src={f.img} alt={f.label} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          {playingFootage === f.id ? (
                            <Pause className="w-8 h-8 text-white/60" />
                          ) : (
                            <Play className="w-8 h-8 text-white/40 group-hover:text-white/70 transition-colors" />
                          )}
                        </div>
                        {session.footageWatched.includes(f.id) && (
                          <div className="absolute top-2 right-2">
                            <Eye className="w-3 h-3 text-green-400/50" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-white mb-1">{f.label}</p>
                        <p className="text-[10px] font-mono text-archive-text/30">{f.time}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Playing footage viewer */}
                {playingFootage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-black border border-archive-border"
                  >
                    <div className="relative aspect-video mb-3 rounded overflow-hidden">
                      <img
                        src={footageItems.find((f) => f.id === playingFootage)?.img}
                        alt="Footage"
                        className="w-full h-full object-cover opacity-70"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="scanline-overlay opacity-40" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-red-400">PLAYING</span>
                      </div>
                    </div>
                    <p className="text-xs text-archive-text/40 font-mono">
                      {footageItems.find((f) => f.id === playingFootage)?.label}
                    </p>

                    {/* Contradiction notice — appears after watching footage */}
                    {session.footageWatched.length >= 2 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="mt-3 p-3 rounded bg-amber-500/5 border border-amber-500/20"
                      >
                        <p className="text-[10px] font-mono text-amber-400">
                          NOTE: Footage timestamps do not match official cycle documentation.
                          Subject distress levels in footage exceed reported parameters.
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* FILES TAB */}
            {activeTab === "files" && (
              <motion.div
                key="files"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <h3 className="text-xs font-mono text-amber-400">LEAKED INTERNAL FILES — UNAUTHORIZED ACCESS</h3>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {archiveDocuments.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => openDocument(doc)}
                      className="p-3 rounded-lg bg-archive-bg border border-archive-border hover:border-archive-amber/40 transition-all text-left group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[9px] font-mono uppercase border",
                          classStyles[doc.classification]
                        )}>
                          {doc.classification}
                        </span>
                        <span className="text-[9px] text-archive-text/20 font-mono">{doc.id}</span>
                      </div>
                      <h4 className="text-xs font-medium text-white group-hover:text-amber-300 transition-colors mb-1">
                        {doc.title}
                      </h4>
                      <p className="text-[10px] text-archive-text/30 line-clamp-2">{doc.excerpt}</p>
                      {session.openedFiles.includes(doc.id) && (
                        <div className="mt-2 flex items-center gap-1 text-[9px] text-green-400/40">
                          <Eye className="w-2.5 h-2.5" /> VIEWED
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Employee cards */}
                <h3 className="text-xs font-mono text-archive-text/40 uppercase mt-6 mb-3">Personnel Files</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  {employees.map((emp) => (
                    <div key={emp.id} className="p-3 rounded-lg bg-archive-bg border border-archive-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-archive-border flex items-center justify-center overflow-hidden flex-shrink-0">
                          {emp.status === "redacted" ? (
                            <Lock className="w-4 h-4 text-red-400/40" />
                          ) : (
                            <User className="w-4 h-4 text-archive-text/20" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-white truncate">{emp.name}</p>
                          <p className="text-[10px] text-archive-text/30 truncate">{emp.role}</p>
                          <span className={cn(
                            "text-[9px] font-mono uppercase",
                            emp.status === "active" ? "text-green-400" :
                            emp.status === "redacted" ? "text-red-400" : "text-amber-400"
                          )}>
                            {emp.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* WARDEN AI TAB */}
            {activeTab === "warden" && (
              <motion.div
                key="warden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-[60vh]"
              >
                {/* Warden header */}
                <div className="px-4 py-3 border-b border-archive-border flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/60" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/60" />
                    <div className="w-2 h-2 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-[10px] font-mono text-terminal-dim">
                    JPBOP WARDEN v4.2.1 — DIRECT CHANNEL
                  </span>
                </div>

                {/* Messages */}
                <div ref={wardenScrollRef} className="flex-1 overflow-y-auto dark-scroll p-4 space-y-3">
                  {wardenMessages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "text-sm font-mono",
                        msg.speaker === "system" && "text-terminal-dim text-xs opacity-60",
                        msg.speaker === "warden" && "text-terminal-text",
                        msg.speaker === "glitch" && "text-red-400/50 text-xs tracking-[0.2em]",
                        msg.speaker === "user" && "text-terminal-accent"
                      )}
                    >
                      {msg.speaker === "warden" && (
                        <div className="flex gap-2">
                          <span className="text-terminal-accent/40 text-xs flex-shrink-0">WARDEN:</span>
                          <span className="whitespace-pre-line leading-relaxed">{msg.text}</span>
                        </div>
                      )}
                      {msg.speaker === "user" && (
                        <div className="flex gap-2">
                          <span className="text-terminal-accent/60 text-xs flex-shrink-0">&gt;</span>
                          <span>{msg.text}</span>
                        </div>
                      )}
                      {msg.speaker === "system" && <pre className="whitespace-pre-wrap">{msg.text}</pre>}
                      {msg.speaker === "glitch" && <span>[{msg.text}]</span>}
                    </motion.div>
                  ))}

                  {wardenTyping && (
                    <div className="flex gap-2 items-center text-xs">
                      <span className="text-terminal-accent/40">WARDEN:</span>
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ opacity: [0.2, 0.8, 0.2] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className="w-1.5 h-1.5 rounded-full bg-terminal-accent/40"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Response options */}
                  {showWardenResponses && currentWardenNode?.responses && (
                    <div className="space-y-2 pt-3 border-t border-white/5">
                      {currentWardenNode.responses.map((resp, i) => (
                        <button
                          key={i}
                          onClick={() => selectWardenResponse(resp)}
                          className="w-full text-left px-3 py-2.5 rounded-lg border border-white/5 text-xs font-mono text-terminal-accent/70 hover:text-terminal-accent hover:bg-white/5 transition-all"
                        >
                          <span className="text-terminal-accent/30 mr-2">[{i + 1}]</span>
                          {resp.text}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Warden complete — proceed to reveal */}
                  {wardenComplete && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="pt-4 border-t border-white/5 text-center"
                    >
                      <p className="text-[10px] font-mono text-terminal-dim mb-3">SESSION TERMINATED</p>
                      <button
                        onClick={() => {
                          updateSession((s) => ({ ...s, revealReached: true }));
                          router.push("/inbox");
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-terminal-accent/10 border border-terminal-accent/20 rounded-lg text-xs font-mono text-terminal-accent hover:bg-terminal-accent/20 transition-colors"
                      >
                        Check inbox
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Document viewer modal */}
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
              className="relative w-full max-w-3xl max-h-[80vh] overflow-y-auto bg-archive-card border border-archive-border rounded-xl dark-scroll"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-archive-card/95 backdrop-blur-xl border-b border-archive-border">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-mono uppercase border",
                    classStyles[activeDoc.classification]
                  )}>
                    {activeDoc.classification}
                  </span>
                  <span className="text-xs text-archive-text/30 font-mono">{activeDoc.id}</span>
                </div>
                <button onClick={() => setActiveDoc(null)} className="p-1.5 rounded-lg hover:bg-white/5 text-archive-text/50 hover:text-white transition-colors">
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
                  <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 mb-4">
                    <p className="text-xs text-red-400 font-mono">
                      CONTRADICTION DETECTED — Cross-reference with {activeDoc.contradicts}
                    </p>
                  </div>
                )}
                <pre className="whitespace-pre-wrap text-sm text-archive-text/80 leading-relaxed font-sans">
                  {activeDoc.fullContent}
                </pre>
                {activeDoc.clueKey && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-6 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20"
                  >
                    <p className="text-xs text-amber-400 font-mono flex items-center gap-2">
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
    </div>
  );
}
