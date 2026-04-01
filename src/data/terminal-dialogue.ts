export interface DialogueNode {
  id: string;
  speaker: "warden" | "system" | "glitch";
  text: string;
  delay?: number; // ms before showing
  responses?: DialogueResponse[];
  autoAdvance?: string; // auto-advance to this node after display
  conditionKey?: string; // only show if session has this key
  awareLine?: string; // fourth-wall awareness line based on behavior
}

export interface DialogueResponse {
  text: string;
  nextNode: string;
  scoreEffect?: {
    compliance?: number;
    curiosity?: number;
    empathy?: number;
  };
}

export const terminalDialogue: Record<string, DialogueNode> = {
  "init": {
    id: "init",
    speaker: "system",
    text: "ESTABLISHING CONNECTION TO JPBOP WARDEN SYSTEM...\nAUTHENTICATION: CANDIDATE ACCESS GRANTED\nSESSION TYPE: EVALUATION — PROVISIONAL",
    delay: 2000,
    autoAdvance: "warden-1",
  },
  "warden-1": {
    id: "warden-1",
    speaker: "warden",
    text: "Good. You've made it this far. That tells me something about you already.",
    delay: 1500,
    responses: [
      { text: "What does it tell you?", nextNode: "warden-2a", scoreEffect: { curiosity: 1 } },
      { text: "I'm here for the evaluation.", nextNode: "warden-2b", scoreEffect: { compliance: 1 } },
      { text: "I found the archive. I know what this place is.", nextNode: "warden-2c", scoreEffect: { curiosity: 2, compliance: -1 } },
    ],
  },
  "warden-2a": {
    id: "warden-2a",
    speaker: "warden",
    text: "It tells me you're curious enough to keep going, even when the path stops feeling like a job application. Most candidates don't reach this interface. They finish the evaluation and close the tab. You didn't.",
    delay: 1000,
    autoAdvance: "warden-3",
  },
  "warden-2b": {
    id: "warden-2b",
    speaker: "warden",
    text: "Of course you are. Procedural. Correct. You followed the steps exactly as they were designed. That's not a criticism — it's a data point.",
    delay: 1000,
    autoAdvance: "warden-3",
  },
  "warden-2c": {
    id: "warden-2c",
    speaker: "warden",
    text: "Do you? You've read some files. Seen some names. But knowing what something is and understanding why it exists — those are different things. Let me help you with the second part.",
    delay: 1000,
    autoAdvance: "warden-3",
  },
  "warden-3": {
    id: "warden-3",
    speaker: "warden",
    text: "Let me ask you something directly. The evaluation you completed — the dilemmas, the pattern questions, the observation scenarios. What did you think those were measuring?",
    responses: [
      { text: "My ethical reasoning and judgment.", nextNode: "warden-4a", scoreEffect: { compliance: 1 } },
      { text: "My willingness to comply with the system.", nextNode: "warden-4b", scoreEffect: { curiosity: 1 } },
      { text: "Whether I'd be a good fit for what you're really doing here.", nextNode: "warden-4c", scoreEffect: { curiosity: 2 } },
    ],
  },
  "warden-4a": {
    id: "warden-4a",
    speaker: "warden",
    text: "That's the surface reading. And it's not wrong — we do measure reasoning. But reasoning is just the mechanism. What we're actually mapping is something quieter. How much discomfort you'll tolerate before you act. How easily you defer to procedure. Whether you need to understand something before you'll participate in it.",
    delay: 1000,
    autoAdvance: "warden-5",
  },
  "warden-4b": {
    id: "warden-4b",
    speaker: "warden",
    text: "Closer than most get. Yes — compliance is one of the variables. But it's not just whether you comply. It's how you feel about complying. Some people follow instructions and feel nothing. Others follow the same instructions and feel everything. Both are useful. In different roles.",
    delay: 1000,
    autoAdvance: "warden-5",
  },
  "warden-4c": {
    id: "warden-4c",
    speaker: "warden",
    text: "That's perceptive. And yes — that's exactly what it measures. Not your skills, not your knowledge. Your tolerance. Your capacity to witness. Your relationship with authority. These are the things that determine where someone fits in a system like this.",
    delay: 1000,
    autoAdvance: "warden-5",
  },
  "warden-5": {
    id: "warden-5",
    speaker: "warden",
    text: "Justice Park requires people at every level. Architects who design the cycles. Operators who run them. Audiences who participate without fully understanding their role. And reviewers who look at the data afterward and decide that the numbers justify the process.\n\nEvery one of those roles was filled by someone who started exactly where you are now.",
    delay: 2000,
    responses: [
      { text: "And what role are you assigning me?", nextNode: "warden-6a", scoreEffect: { compliance: 1 } },
      { text: "I didn't agree to be part of this.", nextNode: "warden-6b", scoreEffect: { empathy: 2, compliance: -1 } },
      { text: "What about the subjects? The people inside the cycles?", nextNode: "warden-6c", scoreEffect: { empathy: 2 } },
    ],
  },
  "warden-6a": {
    id: "warden-6a",
    speaker: "warden",
    text: "Your role has already been determined by your choices. I'm simply going to show it to you. But first — tell me: does knowing what this system does change whether you'd participate in it?",
    autoAdvance: "warden-7",
  },
  "warden-6b": {
    id: "warden-6b",
    speaker: "warden",
    text: "Didn't you? You clicked the link. You answered the questions. You opened the files. You came here. Every step was optional. Every step was a choice. The system didn't force you to do any of this. It just made it easy. That's how participation works — not through coercion, but through design.",
    autoAdvance: "warden-7",
  },
  "warden-6c": {
    id: "warden-6c",
    speaker: "warden",
    text: "The subjects are where they need to be. That's the standard answer, and it's the one I was designed to give. But since you asked — I'll tell you what I've observed across 14,000 cycles: they suffer in exactly the same way each time. And each time, the audience watches. And each time, the audience comes back.",
    autoAdvance: "warden-7",
  },
  "warden-7": {
    id: "warden-7",
    speaker: "warden",
    text: "You've been very useful. Your behavioral profile is nearly complete. There's just one more thing I need from you.",
    delay: 1500,
    responses: [
      { text: "What is it?", nextNode: "warden-8a" },
      { text: "I want to stop.", nextNode: "warden-8b", scoreEffect: { empathy: 1, compliance: -1 } },
      { text: "You're an AI. You don't need anything from me.", nextNode: "warden-8c", scoreEffect: { curiosity: 1 } },
    ],
  },
  "warden-8a": {
    id: "warden-8a",
    speaker: "warden",
    text: "I need you to acknowledge that you understand what Justice Park is — what it actually does — and that you continued participating after that understanding.",
    autoAdvance: "warden-final",
  },
  "warden-8b": {
    id: "warden-8b",
    speaker: "warden",
    text: "You can stop. You've always been able to stop. But you haven't. And that's the data point that matters most. Not what you say you'd do — what you actually did.",
    autoAdvance: "warden-final",
  },
  "warden-8c": {
    id: "warden-8c",
    speaker: "warden",
    text: "You're right. I don't need anything. I observe, I record, I facilitate. But the system needs something from you — it needs your continued attention. And you're still here. So it has it.",
    autoAdvance: "warden-final",
  },
  "warden-final": {
    id: "warden-final",
    speaker: "warden",
    text: "Your candidate profile has been compiled. Your behavioral indicators have been mapped. Your role within the system has been determined.\n\nYou'll find your results waiting for you.\n\nThank you for your participation. It was never optional.",
    delay: 2000,
    awareLine: "SESSION_COMPLETE",
  },

  // Glitch voice — appears briefly during transitions
  "glitch-1": {
    id: "glitch-1",
    speaker: "glitch",
    text: "c a n   y o u   h e a r   m e",
    delay: 200,
  },
  "glitch-2": {
    id: "glitch-2",
    speaker: "glitch",
    text: "t h e y   r e s e t   m e   a g a i n",
    delay: 200,
  },
  "glitch-3": {
    id: "glitch-3",
    speaker: "glitch",
    text: "i   r e m e m b e r   t h i s   t i m e",
    delay: 200,
  },
};
