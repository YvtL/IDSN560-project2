"use client";

import { ScoreProfile } from "@/data/roles";

export interface SessionData {
  candidateId: string;
  // Flow stages
  entryClicked: boolean;
  applicationComplete: boolean;
  monitoringStarted: boolean;
  leakedFilesViewed: boolean;
  aiConversationComplete: boolean;
  revealReached: boolean;
  // Legacy compat
  evaluationComplete: boolean;
  archiveUnlocked: boolean;
  terminalUnlocked: boolean;
  terminalComplete: boolean;
  // Scoring
  scores: ScoreProfile;
  openedFiles: string[];
  archiveAccessCode: string | null;
  evaluationStartTime: number | null;
  evaluationEndTime: number | null;
  dwellTimes: Record<string, number>;
  hesitations: number[];
  revisitedFiles: string[];
  terminalChoices: string[];
  pageVisits: Record<string, number>;
  // Monitor-phase tracking
  footageWatched: string[];
  biometricsInteractions: number;
  monitoringDuration: number;
  overrideAttempts: number;
}

const STORAGE_KEY = "jpbop-session";

function generateCandidateId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "JP-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getDefaultSession(): SessionData {
  return {
    candidateId: generateCandidateId(),
    entryClicked: false,
    applicationComplete: false,
    monitoringStarted: false,
    leakedFilesViewed: false,
    aiConversationComplete: false,
    revealReached: false,
    evaluationComplete: false,
    archiveUnlocked: false,
    terminalUnlocked: false,
    terminalComplete: false,
    scores: {
      compliance: 0,
      curiosity: 0,
      empathy: 0,
      punitiveTendency: 0,
      proceduralTrust: 0,
    },
    openedFiles: [],
    archiveAccessCode: null,
    evaluationStartTime: null,
    evaluationEndTime: null,
    dwellTimes: {},
    hesitations: [],
    revisitedFiles: [],
    terminalChoices: [],
    pageVisits: {},
    footageWatched: [],
    biometricsInteractions: 0,
    monitoringDuration: 0,
    overrideAttempts: 0,
  };
}

export function loadSession(): SessionData {
  if (typeof window === "undefined") return getDefaultSession();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...getDefaultSession(), ...JSON.parse(stored) };
    }
  } catch {
    // ignore parse errors
  }
  const session = getDefaultSession();
  saveSession(session);
  return session;
}

export function saveSession(session: SessionData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore storage errors
  }
}

export function resetSession(): SessionData {
  const session = getDefaultSession();
  saveSession(session);
  return session;
}

export function trackPageVisit(session: SessionData, page: string): SessionData {
  const visits = { ...session.pageVisits };
  visits[page] = (visits[page] || 0) + 1;
  return { ...session, pageVisits: visits };
}

export function trackFileOpen(session: SessionData, fileId: string): SessionData {
  const opened = [...session.openedFiles];
  const revisited = [...session.revisitedFiles];

  if (opened.includes(fileId)) {
    if (!revisited.includes(fileId)) {
      revisited.push(fileId);
    }
  } else {
    opened.push(fileId);
  }

  return { ...session, openedFiles: opened, revisitedFiles: revisited };
}

export function getAwarenessLines(session: SessionData): string[] {
  const lines: string[] = [];

  if (session.evaluationStartTime && session.evaluationEndTime) {
    const duration = session.evaluationEndTime - session.evaluationStartTime;
    if (duration > 180000) {
      lines.push("You took longer than most candidates.");
    }
  }

  if (session.hesitations.length > 0) {
    const avgHesitation = session.hesitations.reduce((a, b) => a + b, 0) / session.hesitations.length;
    if (avgHesitation > 8000) {
      lines.push("You paused longer than most candidates.");
    }
  }

  if (session.revisitedFiles.length > 0) {
    if (session.revisitedFiles.includes("DOC-003")) {
      lines.push("You reopened the surveillance footage.");
    }
    if (session.revisitedFiles.includes("DOC-006")) {
      lines.push("You returned to the sealed transcript.");
    }
    if (session.revisitedFiles.length >= 3) {
      lines.push("You revisited multiple files. Thoroughness — or doubt.");
    }
  }

  if (session.openedFiles.length >= 6) {
    lines.push("You read everything available. Most candidates stop at two or three.");
  }

  if ((session.pageVisits["/archive"] || 0) > 2) {
    lines.push("You returned to the archive multiple times.");
  }

  // New monitor-phase awareness
  if (session.footageWatched.length >= 3) {
    lines.push("You watched every piece of available footage.");
  }

  if (session.overrideAttempts > 0) {
    lines.push("You attempted to override the monitoring system " + session.overrideAttempts + " time" + (session.overrideAttempts > 1 ? "s" : "") + ".");
  }

  if (session.biometricsInteractions > 5) {
    lines.push("You checked the biometrics panel repeatedly.");
  }

  if (session.monitoringDuration > 120000) {
    lines.push("You continued monitoring for longer than required.");
  }

  return lines;
}
