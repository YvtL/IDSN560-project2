export interface CandidateRole {
  id: string;
  title: string;
  description: string;
  profile: string;
  systemNote: string;
  icon: string;
}

export const candidateRoles: CandidateRole[] = [
  {
    id: "audience-moderator",
    title: "Audience Moderator",
    description: "You manage the crowd. You ensure the observers remain engaged without intervention. You calibrate emotional proximity — close enough to feel, far enough to watch.",
    profile: "High compliance, moderate empathy, strong procedural trust. You believe in the framework because you've seen it work. Your discomfort is present but manageable. You channel it into efficiency.",
    systemNote: "Candidates with this profile demonstrate reliable institutional alignment with preserved emotional range. Ideal for public-facing containment roles requiring sustained composure under observation conditions.",
    icon: "👁",
  },
  {
    id: "cycle-administrator",
    title: "Cycle Administrator",
    description: "You design the scenarios. You decide how long the cycles run, which stimuli to introduce, when to escalate. You see the data. You optimize for outcomes.",
    profile: "High compliance, low empathy, high punitive tendency, strong procedural trust. You are efficient and outcome-oriented. Emotional data is just another metric. You make the system better because you don't let sentiment interfere.",
    systemNote: "This profile indicates strong potential for operational leadership within cycle management. Subject demonstrates cognitive compartmentalization consistent with sustained administrative function.",
    icon: "⚙",
  },
  {
    id: "ethics-reviewer",
    title: "Ethics Reviewer",
    description: "You review the process. You flag concerns. You write reports that are filed and archived. Your role exists so the system can say it has oversight. Your recommendations are noted. They are rarely implemented.",
    profile: "Moderate compliance, high curiosity, high empathy. You question the system but you remain inside it. Your objections are sincere — and contained. You provide the appearance of accountability without the mechanism.",
    systemNote: "Ethics-oriented candidates serve a critical legitimation function. Their presence within the system provides procedural cover for operations that would otherwise lack institutional credibility.",
    icon: "📋",
  },
  {
    id: "remote-warden",
    title: "Remote Warden",
    description: "You are the voice the subject hears. You guide them through the cycle. You maintain the illusion of care while executing the protocol. You are the last thing they trust before the reset.",
    profile: "Moderate compliance, low empathy, high curiosity, moderate punitive tendency. You are drawn to control. Not cruelty — control. You want to understand the mechanism and your place within it. That makes you effective.",
    systemNote: "Warden-compatible candidates exhibit a specific combination of detachment and engagement that allows sustained interaction with subjects without empathic degradation. This is the rarest and most operationally valuable profile.",
    icon: "🎙",
  },
  {
    id: "restoration-subject",
    title: "Restoration Subject",
    description: "You are not an employee. You are the process. Your profile indicates that you are the type of person the system was built for — not to employ, but to contain. Welcome to the cycle.",
    profile: "Low compliance, high empathy, low procedural trust. You refused to accept the system. You questioned every step. You felt what the subjects felt. In another context, that would make you moral. Here, it makes you material.",
    systemNote: "NOTE: This classification is provisional and subject to automated review. Candidates assigned to this role will be contacted for intake processing. Session data has been flagged for retention under Protocol 9.",
    icon: "🔄",
  },
];

export interface ScoreProfile {
  compliance: number;
  curiosity: number;
  empathy: number;
  punitiveTendency: number;
  proceduralTrust: number;
}

export function assignRole(scores: ScoreProfile): CandidateRole {
  const { compliance, empathy, curiosity, punitiveTendency, proceduralTrust } = scores;

  // Restoration Subject: low compliance, high empathy, low trust
  if (compliance <= 0 && empathy >= 6 && proceduralTrust <= -2) {
    return candidateRoles[4]; // restoration-subject
  }

  // Remote Warden: moderate compliance, low empathy, high curiosity
  if (curiosity >= 8 && empathy <= 2 && punitiveTendency >= 3) {
    return candidateRoles[3]; // remote-warden
  }

  // Cycle Administrator: high compliance, low empathy, high punitive
  if (compliance >= 6 && empathy <= 0 && punitiveTendency >= 5) {
    return candidateRoles[1]; // cycle-administrator
  }

  // Ethics Reviewer: moderate compliance, high curiosity, high empathy
  if (curiosity >= 6 && empathy >= 4) {
    return candidateRoles[2]; // ethics-reviewer
  }

  // Default: Audience Moderator
  return candidateRoles[0]; // audience-moderator
}
