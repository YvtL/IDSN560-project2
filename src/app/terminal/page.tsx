"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/navigation";
import { useSession } from "@/context/session-context";
import { terminalDialogue, DialogueNode, DialogueResponse } from "@/data/terminal-dialogue";
import { cn } from "@/lib/utils";

interface TerminalMessage {
  id: string;
  speaker: "warden" | "system" | "glitch" | "user";
  text: string;
  timestamp: number;
}

const glitchNodes = ["glitch-1", "glitch-2", "glitch-3"];

export default function TerminalPage() {
  const router = useRouter();
  const { session, updateSession, trackPage } = useSession();
  const [messages, setMessages] = useState<TerminalMessage[]>([]);
  const [currentNode, setCurrentNode] = useState<DialogueNode | null>(null);
  const [showResponses, setShowResponses] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [complete, setComplete] = useState(false);
  const [glitchCount, setGlitchCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    trackPage("/terminal");
  }, [trackPage]);

  // Redirect if not unlocked
  useEffect(() => {
    if (!session.terminalUnlocked) {
      router.push("/archive");
    }
  }, [session.terminalUnlocked, router]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showResponses]);

  const addMessage = useCallback(
    (speaker: TerminalMessage["speaker"], text: string) => {
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random()}`, speaker, text, timestamp: Date.now() },
      ]);
    },
    []
  );

  const processNode = useCallback(
    async (nodeId: string) => {
      const node = terminalDialogue[nodeId];
      if (!node) return;

      // Maybe insert a glitch before certain nodes
      if (glitchCount < 3 && (nodeId === "warden-5" || nodeId === "warden-7" || nodeId === "warden-final")) {
        const glitchNode = terminalDialogue[glitchNodes[glitchCount]];
        if (glitchNode) {
          await new Promise((r) => setTimeout(r, 300));
          addMessage("glitch", glitchNode.text);
          setGlitchCount((c) => c + 1);
          await new Promise((r) => setTimeout(r, 1200));
        }
      }

      setIsTyping(true);
      await new Promise((r) => setTimeout(r, node.delay || 800));
      setIsTyping(false);

      addMessage(node.speaker, node.text);
      setCurrentNode(node);

      if (node.awareLine === "SESSION_COMPLETE") {
        updateSession((s) => ({ ...s, terminalComplete: true }));
        setTimeout(() => setComplete(true), 2000);
        return;
      }

      if (node.autoAdvance) {
        await new Promise((r) => setTimeout(r, 1500));
        processNode(node.autoAdvance);
      } else if (node.responses) {
        setTimeout(() => setShowResponses(true), 500);
      }
    },
    [addMessage, glitchCount, updateSession]
  );

  const selectResponse = useCallback(
    (response: DialogueResponse) => {
      setShowResponses(false);
      addMessage("user", response.text);

      // Track choice
      updateSession((s) => ({
        ...s,
        terminalChoices: [...s.terminalChoices, response.nextNode],
        scores: {
          compliance: s.scores.compliance + (response.scoreEffect?.compliance || 0),
          curiosity: s.scores.curiosity + (response.scoreEffect?.curiosity || 0),
          empathy: s.scores.empathy + (response.scoreEffect?.empathy || 0),
          punitiveTendency: s.scores.punitiveTendency,
          proceduralTrust: s.scores.proceduralTrust,
        },
      }));

      setTimeout(() => processNode(response.nextNode), 600);
    },
    [addMessage, processNode, updateSession]
  );

  // Start conversation
  useEffect(() => {
    if (startedRef.current || !session.terminalUnlocked) return;
    startedRef.current = true;
    processNode("init");
  }, [session.terminalUnlocked, processNode]);

  if (!session.terminalUnlocked) return null;

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text flex flex-col">
      <Navigation />

      {/* Scanline */}
      <div className="scanline-overlay opacity-20" />

      {/* Terminal header */}
      <div className="pt-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 py-3 border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-archive-red/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-archive-amber/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-archive-green/60" />
            </div>
            <span className="text-[10px] font-mono text-terminal-dim">
              JPBOP WARDEN SYSTEM v4.2.1 — SESSION: {session.candidateId}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto dark-scroll px-6 py-6"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "terminal-line",
                msg.speaker === "system" && "text-terminal-dim",
                msg.speaker === "warden" && "text-terminal-text",
                msg.speaker === "glitch" && "text-archive-red/60",
                msg.speaker === "user" && "text-terminal-accent"
              )}
            >
              {msg.speaker === "system" && (
                <pre className="whitespace-pre-wrap text-xs opacity-60">{msg.text}</pre>
              )}
              {msg.speaker === "warden" && (
                <div className="flex gap-3">
                  <span className="text-terminal-accent/40 flex-shrink-0 text-xs mt-0.5">WARDEN:</span>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                </div>
              )}
              {msg.speaker === "glitch" && (
                <motion.div
                  animate={{ x: [0, -2, 3, -1, 0] }}
                  transition={{ duration: 0.2, repeat: 3 }}
                  className="text-xs font-mono tracking-[0.3em] opacity-50"
                >
                  [{msg.text}]
                </motion.div>
              )}
              {msg.speaker === "user" && (
                <div className="flex gap-3">
                  <span className="text-terminal-accent/60 flex-shrink-0 text-xs mt-0.5">&gt;</span>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 items-center"
            >
              <span className="text-terminal-accent/40 text-xs">WARDEN:</span>
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
            </motion.div>
          )}

          {/* Response options */}
          <AnimatePresence>
            {showResponses && currentNode?.responses && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 pt-4 border-t border-white/5"
              >
                {currentNode.responses.map((resp, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => selectResponse(resp)}
                    className="w-full text-left px-4 py-3 rounded-lg border border-white/5 text-sm font-mono text-terminal-accent/70 hover:text-terminal-accent hover:bg-white/5 hover:border-terminal-accent/20 transition-all duration-200 group"
                  >
                    <span className="text-terminal-accent/30 mr-2">[{i + 1}]</span>
                    {resp.text}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Completion */}
          {complete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-8 border-t border-white/5"
            >
              <div className="text-center">
                <p className="text-xs font-mono text-terminal-dim mb-4">
                  SESSION TERMINATED — PROFILE COMPILED
                </p>
                <button
                  onClick={() => router.push("/profile-result")}
                  className="group inline-flex items-center gap-2 px-6 py-2.5 bg-terminal-accent/10 border border-terminal-accent/20 rounded-lg text-sm font-mono text-terminal-accent hover:bg-terminal-accent/20 transition-colors"
                >
                  View Your Profile
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
