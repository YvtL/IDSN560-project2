export interface ArchiveDocument {
  id: string;
  title: string;
  type: "memo" | "report" | "surveillance" | "blueprint" | "transcript" | "directive";
  classification: "standard" | "restricted" | "sealed";
  date: string;
  author: string;
  department: string;
  thumbnail: string;
  excerpt: string;
  fullContent: string;
  redactedSections: number;
  clueKey?: string; // if this doc contains a hidden clue
  contradicts?: string; // ID of doc it contradicts
}

export const archiveDocuments: ArchiveDocument[] = [
  {
    id: "DOC-001",
    title: "JPBOP Program Overview",
    type: "memo",
    classification: "standard",
    date: "2024-01-15",
    author: "Dr. Lena Marsh",
    department: "Cycle Design",
    thumbnail: "/assets/placeholders/doc-memo.svg",
    excerpt: "The Justice Park Behavioral Operations Program represents TCKR Systems' most advanced approach to behavioral rehabilitation through structured environmental conditioning...",
    fullContent: `INTERNAL MEMORANDUM — TCKR SYSTEMS
Classification: Standard
Date: 2024-01-15
Author: Dr. Lena Marsh, Lead Behavioral Architect

RE: Justice Park Behavioral Operations Program — Overview

The Justice Park Behavioral Operations Program (JPBOP) represents TCKR Systems' most advanced approach to behavioral rehabilitation through structured environmental conditioning.

Subjects are placed within carefully designed experiential cycles that simulate high-stress moral decision-making scenarios. Each cycle is monitored by a dedicated Warden operator and supported by audience engagement infrastructure.

Key outcomes:
- Subject behavioral modification rate: 94.2%
- Audience satisfaction index: 8.7/10
- Average cycle duration: 4.2 hours
- Memory persistence between cycles: <0.3%

The program has been approved for Phase 4 expansion. Additional containment facilities are under construction at Sites 7 through 12.

Note: All references to "punishment" in external communications should be replaced with "rehabilitation" or "restoration." Marketing has approved the revised terminology guide (see Attachment C).`,
    redactedSections: 0,
  },
  {
    id: "DOC-002",
    title: "Subject Informed Consent — Audit Findings",
    type: "report",
    classification: "restricted",
    date: "2025-03-22",
    author: "Dr. Aran Osei",
    department: "Compliance",
    thumbnail: "/assets/placeholders/doc-report.svg",
    excerpt: "This audit identifies significant gaps between stated consent protocols and operational reality within the JPBOP program...",
    fullContent: `COMPLIANCE AUDIT — CONFIDENTIAL
Classification: Restricted
Date: 2025-03-22
Author: Dr. Aran Osei, Ethics Review Consultant

RE: Subject Informed Consent — Audit Findings

This audit identifies significant gaps between stated consent protocols and operational reality within the Justice Park Behavioral Operations Program.

Key findings:

1. CONSENT DOCUMENTATION: Subjects sign consent forms during their initial processing phase. However, memory reset protocols ensure subjects have no recollection of having consented. Effective consent is therefore absent from cycle 2 onward.

2. TERMINOLOGY OBFUSCATION: Internal documents consistently use "restoration" and "rehabilitation" to describe processes that meet clinical definitions of ████████████ and ████████████████.

3. AUDIENCE ROLE: Public participants are described as "observers" in compliance documentation but function as active participants in subject distress escalation. No audience member has been informed of this role.

4. RECOMMENDATION: Immediate suspension of all active cycles pending independent ethical review.

STATUS: This report was filed on 2025-03-22. Dr. Osei's access was suspended on 2025-03-23. The report has not been forwarded to the Ethics Board.`,
    redactedSections: 2,
    contradicts: "DOC-001",
  },
  {
    id: "DOC-003",
    title: "Surveillance Log — Containment Suite 9",
    type: "surveillance",
    classification: "restricted",
    date: "2025-10-14",
    author: "Automated System",
    department: "Containment Systems",
    thumbnail: "/assets/placeholders/surveillance-1.svg",
    excerpt: "Automated capture — Subject 0089, Cycle 1,244. Subject exhibits standard disorientation pattern. Warden engagement initiated at T+00:04:12...",
    fullContent: `SURVEILLANCE LOG — AUTOMATED
Classification: Restricted
Facility: Site 3, Containment Suite 9
Date: 2025-10-14
Subject: 0089 | Cycle: 1,244

T+00:00:00 — Cycle initiated. Environmental parameters loaded (Scenario: Town Centre Variant B).
T+00:00:47 — Subject regains awareness. Standard disorientation observed.
T+00:01:23 — Subject examines immediate surroundings. No recognition of previous cycles detected.
T+00:03:08 — Subject encounters first planted stimulus (damaged photograph).
T+00:04:12 — Warden engagement initiated. Subject verbal distress level: moderate.
T+00:08:44 — Audience routing commenced. 342 participants directed to primary observation zone.
T+00:12:30 — Subject attempts to seek help from audience members. Standard non-response protocol in effect.
T+00:18:15 — Subject distress level: elevated. Cycle progression: nominal.
T+00:34:02 — Subject reaches crisis point. Emotional peak recorded.
T+00:41:18 — Cycle concluded. Memory reset initiated.
T+00:41:22 — Reset confirmed. Subject returned to holding.

WARDEN NOTE: Subject 0089 continues to show remarkable consistency across cycles. Recommend continued observation. No modifications to scenario parameters required.`,
    redactedSections: 0,
    clueKey: "SUITE-9",
  },
  {
    id: "DOC-004",
    title: "Facility Layout — Site 3 (Partial)",
    type: "blueprint",
    classification: "restricted",
    date: "2023-08-01",
    author: "Facilities Division",
    department: "Infrastructure",
    thumbnail: "/assets/placeholders/facility-map.svg",
    excerpt: "Partial facility layout showing containment suites, audience routing corridors, Warden operation center, and subject holding areas...",
    fullContent: `FACILITY BLUEPRINT — PARTIAL
Classification: Restricted
Site: 3
Last Updated: 2023-08-01

[THIS DOCUMENT CONTAINS A FACILITY MAP — SEE PLACEHOLDER IMAGE]

Key areas identified:
- SECTOR A: Public reception and audience staging (disguised as "interactive experience center")
- SECTOR B: Containment Suites 1-12 (individual subject environments)
- SECTOR C: Warden Operations Center (remote monitoring, cycle management)
- SECTOR D: Subject Processing (intake, memory reset, medical review)
- SECTOR E: ████████████ (access restricted to Clearance Level 6+)

Note: Audience members enter through Sector A and are routed through designated observation corridors. At no point do audience members have direct access to subjects. One-way environmental interfaces maintain the illusion of proximity.

MAINTENANCE NOTE: Corridors between Sectors B and D require additional soundproofing. Subject vocalizations have been reported in Sector A during peak hours.`,
    redactedSections: 1,
  },
  {
    id: "DOC-005",
    title: "Directive: Terminology Standards Update",
    type: "directive",
    classification: "standard",
    date: "2025-01-08",
    author: "Communications Division",
    department: "Public Engagement",
    thumbnail: "/assets/placeholders/doc-directive.svg",
    excerpt: "Effective immediately, the following terminology changes must be applied to all external-facing materials...",
    fullContent: `INTERNAL DIRECTIVE
Classification: Standard
Date: 2025-01-08
Issued by: Communications Division

RE: Terminology Standards — Mandatory Update

Effective immediately, the following terminology changes must be applied to all external-facing materials, recruitment documentation, and public communications:

REPLACE → WITH
"Punishment cycle" → "Restoration experience"
"Subject" → "Participant" or "Candidate"
"Memory wipe" → "Cognitive reset"
"Containment suite" → "Immersive environment"
"Warden" → "Experience facilitator"
"Audience" → "Community observers"
"Distress metrics" → "Engagement indicators"
"Behavioral harvesting" → "Insight generation"

Additional notes:
- The abbreviation "JPBOP" has been approved for public use.
- References to cycle counts must be removed from all candidate-facing materials.
- Employee social media activity will be monitored for compliance with these standards.

Non-compliance will result in immediate review and potential reassignment.`,
    redactedSections: 0,
  },
  {
    id: "DOC-006",
    title: "Transcript: Warden AI Session — Subject 0089, Cycle 1,247",
    type: "transcript",
    classification: "sealed",
    date: "2025-12-18",
    author: "Park Warden System",
    department: "Containment Systems",
    thumbnail: "/assets/placeholders/doc-transcript.svg",
    excerpt: "WARDEN: Good morning. Do you know where you are? SUBJECT: I... no. I don't know this place. WARDEN: That's expected. Let's begin...",
    fullContent: `TRANSCRIPT — SEALED
Classification: Sealed (Clearance Level 5+ Required)
Session: Warden AI / Subject 0089
Cycle: 1,247
Date: 2025-12-18

[00:00:04] WARDEN: Good morning. Do you know where you are?
[00:00:09] SUBJECT: I... no. I don't know this place.
[00:00:12] WARDEN: That's expected. Let's begin.
[00:00:15] SUBJECT: Begin what? Who are you?
[00:00:18] WARDEN: I'm here to guide you through today's experience.
[00:00:24] SUBJECT: Experience? I don't—I was somewhere else. I was at home.
[00:00:30] WARDEN: You may feel that way. The disorientation will pass.
[00:01:12] SUBJECT: There are people watching. Why are there people watching?
[00:01:18] WARDEN: They're here to observe. It's part of the process.
[00:01:25] SUBJECT: What process? I didn't agree to this.
[00:01:30] WARDEN: You did, actually. But I understand why you don't remember.

[REMAINDER OF TRANSCRIPT SEALED — ACCESS CODE REQUIRED]

ACCESS CODE: JP-████-7741

Note: To obtain the full transcript access code, cross-reference incident report SR-7741 with containment suite assignment logs.`,
    redactedSections: 1,
    clueKey: "7741",
  },
  {
    id: "DOC-007",
    title: "Incident Report SR-7741",
    type: "report",
    classification: "restricted",
    date: "2025-08-15",
    author: "James Whitfield",
    department: "Reset Operations",
    thumbnail: "/assets/placeholders/doc-report.svg",
    excerpt: "During routine cycle reset for Subject 0089, technician observed anomalous memory persistence. Subject verbalized fragments from previous cycles...",
    fullContent: `INCIDENT REPORT
Classification: Restricted
Report ID: SR-7741
Date: 2025-08-15
Filed by: James Whitfield, Subject Restoration Technician

INCIDENT SUMMARY:
During routine cycle reset for Subject 0089 (Cycle 1,241), anomalous memory persistence was observed. Subject verbalized fragments consistent with experiences from Cycles 1,238 and 1,239 during the post-reset stabilization window.

Specific utterances:
- "The photograph again"
- "They just watch"
- "I keep coming back here"

ASSESSMENT:
Standard reset protocols were followed without deviation. Equipment diagnostics returned normal. This suggests potential adaptation by the subject to the reset process — a scenario outlined in Contingency Protocol 14 but previously considered theoretical.

RECOMMENDED ACTION:
Increase reset intensity by 15% for subsequent cycles. Notify Behavioral Architecture team for scenario variation to reduce pattern recognition risk.

FOLLOW-UP:
Technician Whitfield was reassigned to Public Engagement on 2025-08-30. Reason cited: "Role optimization." Whitfield's access to Containment Systems has been revoked.

NOTE: This report should be cross-referenced with DOC-006 for full context.`,
    redactedSections: 0,
    clueKey: "SR-7741",
    contradicts: "DOC-001",
  },
];
