"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  SessionData,
  getDefaultSession,
  loadSession,
  saveSession,
  resetSession as resetSessionStorage,
  trackPageVisit as trackPageVisitFn,
  trackFileOpen as trackFileOpenFn,
} from "@/lib/session";

interface SessionContextType {
  session: SessionData;
  updateSession: (updater: (prev: SessionData) => SessionData) => void;
  trackPage: (page: string) => void;
  trackFile: (fileId: string) => void;
  resetAll: () => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionData>(getDefaultSession);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveSession(session);
    }
  }, [session, loaded]);

  const updateSession = useCallback((updater: (prev: SessionData) => SessionData) => {
    setSession((prev) => updater(prev));
  }, []);

  const trackPage = useCallback((page: string) => {
    setSession((prev) => trackPageVisitFn(prev, page));
  }, []);

  const trackFile = useCallback((fileId: string) => {
    setSession((prev) => trackFileOpenFn(prev, fileId));
  }, []);

  const resetAll = useCallback(() => {
    setSession(resetSessionStorage());
  }, []);

  return (
    <SessionContext.Provider value={{ session, updateSession, trackPage, trackFile, resetAll }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
