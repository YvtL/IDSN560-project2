export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  clearanceLevel: number;
  status: "active" | "suspended" | "reassigned" | "redacted";
  portrait: string; // placeholder path
  notes: string;
  hireDate: string;
  lastReview: string;
  flagged: boolean;
}

export const employees: Employee[] = [
  {
    id: "EMP-4491",
    name: "Dr. Lena Marsh",
    role: "Lead Behavioral Architect",
    department: "Cycle Design",
    clearanceLevel: 5,
    status: "active",
    portrait: "/assets/placeholders/portrait-1.svg",
    notes: "Primary architect of Reset Protocol v3.2. Annual ethics review waived by department head.",
    hireDate: "2019-03-15",
    lastReview: "2025-11-02",
    flagged: false,
  },
  {
    id: "EMP-2208",
    name: "Marcus Hale",
    role: "Audience Experience Coordinator",
    department: "Public Engagement",
    clearanceLevel: 3,
    status: "active",
    portrait: "/assets/placeholders/portrait-2.svg",
    notes: "Manages crowd routing and emotional calibration for live demonstration events.",
    hireDate: "2021-07-22",
    lastReview: "2025-09-18",
    flagged: false,
  },
  {
    id: "EMP-3317",
    name: "Dr. Aran Osei",
    role: "Ethics Review Consultant",
    department: "Compliance",
    clearanceLevel: 4,
    status: "suspended",
    portrait: "/assets/placeholders/portrait-3.svg",
    notes: "Filed internal objection RE: informed consent gap in subject onboarding. Review pending. Access restricted.",
    hireDate: "2020-01-10",
    lastReview: "2025-06-14",
    flagged: true,
  },
  {
    id: "EMP-1105",
    name: "Yuna Park",
    role: "Remote Warden Operator",
    department: "Containment Systems",
    clearanceLevel: 5,
    status: "active",
    portrait: "/assets/placeholders/portrait-4.svg",
    notes: "Highest retention score among Warden operators. Operates cycles 8-14. Zero incident reports.",
    hireDate: "2018-11-03",
    lastReview: "2025-12-01",
    flagged: false,
  },
  {
    id: "EMP-5560",
    name: "James Whitfield",
    role: "Subject Restoration Technician",
    department: "Reset Operations",
    clearanceLevel: 4,
    status: "reassigned",
    portrait: "/assets/placeholders/portrait-5.svg",
    notes: "Transferred from Restoration to Public Engagement following incident report SR-7741. Memory audit completed.",
    hireDate: "2022-04-18",
    lastReview: "2025-08-30",
    flagged: true,
  },
  {
    id: "EMP-0089",
    name: "[REDACTED]",
    role: "Cycle Subject — Legacy",
    department: "Containment Systems",
    clearanceLevel: 0,
    status: "redacted",
    portrait: "/assets/placeholders/portrait-redacted.svg",
    notes: "Record sealed under Protocol 9. Original identity archived. Current cycle: 1,247.",
    hireDate: "2017-06-01",
    lastReview: "—",
    flagged: true,
  },
];
