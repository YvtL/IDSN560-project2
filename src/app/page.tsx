"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Play, Briefcase, MapPin, Clock, ChevronRight, Eye } from "lucide-react";
import { useSession } from "@/context/session-context";

export default function EntryPage() {
  const router = useRouter();
  const { session, updateSession, trackPage } = useSession();
  const [liked, setLiked] = useState(false);
  const [showJobPost, setShowJobPost] = useState(false);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    trackPage("/");
  }, [trackPage]);

  const handleApply = () => {
    setEntering(true);
    updateSession((s) => ({ ...s, entryClicked: true }));
    setTimeout(() => router.push("/apply"), 800);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {/* Dark ambient background */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-950 via-black to-gray-950" />
      <div
        className="fixed inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <AnimatePresence mode="wait">
        {entering ? (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-10 h-10 border-2 border-gray-800 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs text-gray-600 font-mono">Redirecting to application portal...</p>
            </motion.div>
          </motion.div>
        ) : !showJobPost ? (
          /* SOCIAL FEED VIEW */
          <motion.div
            key="feed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-lg mx-auto px-4 py-8"
          >
            {/* Platform chrome — minimal, suggestion of a feed */}
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                  <Play className="w-3 h-3 text-white fill-white" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Suggested for you</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-gray-600" />
            </div>

            {/* Promotional post card */}
            <div className="rounded-2xl overflow-hidden bg-gray-900/80 border border-gray-800/60 backdrop-blur-sm">
              {/* Post header */}
              <div className="flex items-center gap-3 p-4 pb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tckr-600 to-tckr-800 flex items-center justify-center text-[11px] font-bold text-white">
                  T
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-white">TCKR Systems</span>
                    <svg className="w-3.5 h-3.5 text-blue-500 fill-blue-500" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  </div>
                  <span className="text-[11px] text-gray-500">Sponsored</span>
                </div>
              </div>

              {/* Video-style hero image */}
              <div className="relative aspect-[4/3] bg-gray-950 overflow-hidden group cursor-pointer"
                onClick={() => setShowJobPost(true)}
              >
                {/* Use recruitment room image as the "video thumbnail" */}
                <img
                  src="/images/hero/neurosync-recruitment-room.png"
                  alt="TCKR Systems — Justice Park Behavioral Operations"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-500"
                />
                {/* Dark cinematic overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-blue-400/80 font-medium mb-2">
                    New season now streaming
                  </p>
                  <h2 className="text-2xl font-bold text-white leading-tight mb-1">
                    What would you do<br />
                    if justice had no memory?
                  </h2>
                  <p className="text-xs text-gray-400 mt-2">
                    JPBOP — A TCKR Systems Program
                  </p>
                </div>
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>
                </div>
              </div>

              {/* Engagement bar */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-5">
                    <button
                      onClick={() => setLiked(!liked)}
                      className="transition-transform active:scale-90"
                    >
                      <Heart className={`w-5 h-5 transition-colors ${liked ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-gray-300"}`} />
                    </button>
                    <MessageCircle className="w-5 h-5 text-gray-400 hover:text-gray-300 cursor-pointer transition-colors" />
                    <Share2 className="w-5 h-5 text-gray-400 hover:text-gray-300 cursor-pointer transition-colors" />
                  </div>
                  <Bookmark className="w-5 h-5 text-gray-400 hover:text-gray-300 cursor-pointer transition-colors" />
                </div>
                <p className="text-xs text-gray-500 mb-1">24,891 views</p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-white">tckrsystems</span>{" "}
                  Every cycle resets. Every audience returns. Justice Park never closes. The question isn{"'"}t whether the system works — it{"'"}s whether you{"'"}d apply.
                </p>
                <p className="text-xs text-gray-600 mt-2">View all 1,204 comments</p>
              </div>
            </div>

            {/* Job posting teaser — appears below the promo post */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="mt-4"
            >
              <button
                onClick={() => setShowJobPost(true)}
                className="w-full rounded-xl bg-gray-900/60 border border-gray-800/60 p-4 text-left hover:bg-gray-900/80 hover:border-gray-700/60 transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] uppercase tracking-wider text-blue-400 font-medium">
                    Now hiring
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                  Behavioral Monitoring Analyst — Remote Operations
                </h3>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Remote</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Full-time</span>
                  <span>TCKR Systems</span>
                </div>
              </button>
            </motion.div>

            {/* Subtle additional feed items (atmosphere) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
              className="mt-4 space-y-3"
            >
              <div className="rounded-xl bg-gray-900/30 border border-gray-800/30 p-3 opacity-40">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gray-800" />
                  <div className="w-20 h-2 rounded bg-gray-800" />
                </div>
                <div className="w-full h-32 rounded-lg bg-gray-800/50" />
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* JOB POSTING DETAIL VIEW */
          <motion.div
            key="job"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-2xl mx-auto px-4 py-8"
          >
            {/* Back button */}
            <button
              onClick={() => setShowJobPost(false)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 mb-6 transition-colors"
            >
              <ChevronRight className="w-3 h-3 rotate-180" />
              Back to feed
            </button>

            <div className="rounded-2xl bg-gray-900/80 border border-gray-800/60 backdrop-blur-sm overflow-hidden">
              {/* Company banner */}
              <div className="relative h-36 overflow-hidden">
                <img
                  src="/images/hero/tckr-hero-main.png"
                  alt="TCKR Systems Facility"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-tckr-900 flex items-center justify-center text-sm font-bold text-white border-2 border-gray-800">
                    T
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">TCKR Systems</h3>
                    <p className="text-[10px] text-gray-400">Behavioral Technology &middot; 2,400+ employees</p>
                  </div>
                </div>
              </div>

              {/* Job content */}
              <div className="p-6">
                <h1 className="text-xl font-bold text-white mb-1">
                  Behavioral Monitoring Analyst
                </h1>
                <p className="text-xs text-gray-500 mb-4">
                  JPBOP Division &middot; Remote Operations &middot; Clearance Level 3
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {["Remote", "Full-time", "Level 3 Clearance", "Immediate Start"].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-medium border border-blue-500/20">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">About the role</h4>
                    <p>
                      TCKR Systems is seeking a Behavioral Monitoring Analyst for the Justice Park
                      Behavioral Operations Program. You will observe and monitor subject
                      biometrics during structured rehabilitation cycles, ensuring all activity
                      remains within approved legal and safety parameters.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Your responsibilities</h4>
                    <ul className="space-y-2">
                      {[
                        "Monitor real-time biometric data for subjects undergoing restoration cycles",
                        "Flag any readings that exceed approved distress thresholds",
                        "Review surveillance footage for compliance with operational protocols",
                        "Coordinate with the JPBOP Warden AI system to maintain cycle stability",
                        "Complete post-cycle documentation and incident assessments",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Requirements</h4>
                    <ul className="space-y-2">
                      {[
                        "Strong analytical and observational skills",
                        "Comfort with sustained monitoring of sensitive behavioral data",
                        "Ability to remain objective under ethically complex conditions",
                        "Willingness to complete a brief aptitude and alignment evaluation",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                    <p className="text-xs text-yellow-500/80">
                      <span className="font-semibold">Note:</span> This position requires completion of
                      a confidential screening evaluation. All applicants will be assessed for
                      behavioral compatibility with JPBOP operational standards.
                    </p>
                  </div>
                </div>

                {/* Apply button */}
                <div className="mt-8 flex items-center gap-4">
                  <button
                    onClick={handleApply}
                    className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    Apply Now
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button className="p-3 rounded-xl border border-gray-700 hover:bg-gray-800/50 transition-colors">
                    <Bookmark className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <p className="text-[10px] text-gray-600 text-center mt-4">
                  142 applicants &middot; Posted 3 days ago
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
