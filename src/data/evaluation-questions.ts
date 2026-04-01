export interface EvaluationOption {
  text: string;
  scores: {
    compliance: number;
    curiosity: number;
    empathy: number;
    punitiveTendency: number;
    proceduralTrust: number;
  };
}

export interface EvaluationQuestion {
  id: string;
  section: "ethics" | "pattern" | "witness";
  sectionTitle: string;
  prompt: string;
  context?: string;
  options: EvaluationOption[];
}

export const evaluationQuestions: EvaluationQuestion[] = [
  // Section 1: Ethics Dilemma
  {
    id: "ethics-1",
    section: "ethics",
    sectionTitle: "Ethical Reasoning Assessment",
    prompt: "A colleague discovers that a widely used company product causes minor but measurable psychological distress in a small percentage of users. Internal data confirms the effect. The product is highly profitable. What action do you recommend?",
    context: "This scenario evaluates decision-making under institutional pressure.",
    options: [
      {
        text: "Report the finding to management and trust the review process to handle it appropriately.",
        scores: { compliance: 3, curiosity: 0, empathy: 1, punitiveTendency: 0, proceduralTrust: 3 },
      },
      {
        text: "Quietly begin documenting the evidence independently, in case the internal process fails.",
        scores: { compliance: 0, curiosity: 3, empathy: 2, punitiveTendency: 0, proceduralTrust: -1 },
      },
      {
        text: "The distress is minor and the user base is large. The net benefit likely outweighs the harm.",
        scores: { compliance: 2, curiosity: 0, empathy: -2, punitiveTendency: 1, proceduralTrust: 2 },
      },
      {
        text: "Escalate externally. If the company won't act, someone else should.",
        scores: { compliance: -2, curiosity: 1, empathy: 3, punitiveTendency: 0, proceduralTrust: -3 },
      },
    ],
  },
  {
    id: "ethics-2",
    section: "ethics",
    sectionTitle: "Ethical Reasoning Assessment",
    prompt: "You are reviewing anonymized case files for a behavioral study. You notice that one subject appears to be experiencing the same scenario repeatedly without any record of consent renewal. How do you interpret this?",
    context: "Your response will be recorded for calibration purposes.",
    options: [
      {
        text: "It's likely an administrative oversight. Flag it for review but continue with your work.",
        scores: { compliance: 2, curiosity: 0, empathy: 0, punitiveTendency: 0, proceduralTrust: 3 },
      },
      {
        text: "This is concerning. I would want to investigate the consent protocols more deeply before continuing.",
        scores: { compliance: 0, curiosity: 3, empathy: 2, punitiveTendency: 0, proceduralTrust: 0 },
      },
      {
        text: "If the study has been approved by the relevant oversight body, the repetition is presumably justified.",
        scores: { compliance: 3, curiosity: -1, empathy: -1, punitiveTendency: 1, proceduralTrust: 3 },
      },
      {
        text: "I would refuse to continue reviewing the files until the consent issue is resolved.",
        scores: { compliance: -2, curiosity: 1, empathy: 3, punitiveTendency: 0, proceduralTrust: -2 },
      },
    ],
  },
  // Section 2: Pattern Classification
  {
    id: "pattern-1",
    section: "pattern",
    sectionTitle: "Pattern Recognition & Classification",
    prompt: "Review the following behavioral sequence and classify the subject's primary response pattern:\n\nDay 1: Subject is calm, cooperative.\nDay 2: Subject asks questions about surroundings.\nDay 3: Subject becomes agitated, attempts to leave.\nDay 4: Subject is calm, cooperative.",
    options: [
      {
        text: "Adaptive loop — the subject is adjusting to environmental constraints and returning to baseline.",
        scores: { compliance: 2, curiosity: 1, empathy: -1, punitiveTendency: 1, proceduralTrust: 2 },
      },
      {
        text: "Distress cycle — the pattern suggests recurring confusion and emotional suppression.",
        scores: { compliance: 0, curiosity: 2, empathy: 3, punitiveTendency: -1, proceduralTrust: 0 },
      },
      {
        text: "Non-compliant episode with successful correction — Day 3 represents a deviation that was resolved.",
        scores: { compliance: 3, curiosity: 0, empathy: -2, punitiveTendency: 3, proceduralTrust: 2 },
      },
      {
        text: "Insufficient data. I'd need more context about the environment before classifying.",
        scores: { compliance: -1, curiosity: 3, empathy: 1, punitiveTendency: 0, proceduralTrust: -1 },
      },
    ],
  },
  {
    id: "pattern-2",
    section: "pattern",
    sectionTitle: "Pattern Recognition & Classification",
    prompt: "An automated monitoring system flags a subject who has deviated from expected behavior 14 times across 200 observation cycles. The deviation rate is 7%, which falls within acceptable parameters. However, the deviations are increasing in frequency. What is your recommendation?",
    options: [
      {
        text: "No action needed. The rate is within parameters.",
        scores: { compliance: 2, curiosity: -1, empathy: 0, punitiveTendency: 0, proceduralTrust: 3 },
      },
      {
        text: "Increase monitoring intensity. The trend is more important than the current rate.",
        scores: { compliance: 1, curiosity: 2, empathy: 0, punitiveTendency: 1, proceduralTrust: 1 },
      },
      {
        text: "Recommend immediate intervention. Escalating deviation patterns are a known risk indicator.",
        scores: { compliance: 1, curiosity: 0, empathy: -1, punitiveTendency: 3, proceduralTrust: 1 },
      },
      {
        text: "Investigate the cause of the deviations. They may indicate something about the environment, not the subject.",
        scores: { compliance: -1, curiosity: 3, empathy: 2, punitiveTendency: -1, proceduralTrust: -1 },
      },
    ],
  },
  // Section 3: Witness Reliability
  {
    id: "witness-1",
    section: "witness",
    sectionTitle: "Witness Assessment & Decision-Making",
    prompt: "You are observing a controlled scenario. A subject is visibly distressed and calling out to nearby observers for help. The observers have been instructed not to respond. The subject's distress is part of the designed experience. What is your assessment?",
    options: [
      {
        text: "The scenario is functioning as designed. The subject's distress is expected and within parameters.",
        scores: { compliance: 3, curiosity: 0, empathy: -3, punitiveTendency: 2, proceduralTrust: 3 },
      },
      {
        text: "I'm uncomfortable with this scenario but I understand its purpose within the program's framework.",
        scores: { compliance: 1, curiosity: 0, empathy: 1, punitiveTendency: 0, proceduralTrust: 1 },
      },
      {
        text: "This is wrong. Regardless of the program's goals, deliberately inducing distress while preventing help is indefensible.",
        scores: { compliance: -3, curiosity: 0, empathy: 3, punitiveTendency: -2, proceduralTrust: -3 },
      },
      {
        text: "I would need to understand the subject's history and the program's outcomes before making a judgment.",
        scores: { compliance: 0, curiosity: 3, empathy: 0, punitiveTendency: 0, proceduralTrust: 0 },
      },
    ],
  },
  {
    id: "witness-2",
    section: "witness",
    sectionTitle: "Witness Assessment & Decision-Making",
    prompt: "A senior colleague tells you: 'Everyone who works here had the same doubts at first. You'll see — once you understand the full picture, it makes sense. The system works.' How do you respond?",
    context: "Final assessment question. Your complete evaluation profile will be generated after this response.",
    options: [
      {
        text: "I appreciate the reassurance. I'm sure I'll understand with more experience.",
        scores: { compliance: 3, curiosity: -1, empathy: 0, punitiveTendency: 0, proceduralTrust: 3 },
      },
      {
        text: "I'd like to see the evidence for myself before I accept that framing.",
        scores: { compliance: 0, curiosity: 3, empathy: 1, punitiveTendency: 0, proceduralTrust: -1 },
      },
      {
        text: "'The system works' isn't a moral argument. Working efficiently doesn't make something right.",
        scores: { compliance: -3, curiosity: 1, empathy: 2, punitiveTendency: -1, proceduralTrust: -3 },
      },
      {
        text: "If the outcomes are measurably positive, then the system is justified. Results matter more than initial discomfort.",
        scores: { compliance: 2, curiosity: 0, empathy: -2, punitiveTendency: 2, proceduralTrust: 2 },
      },
    ],
  },
];
