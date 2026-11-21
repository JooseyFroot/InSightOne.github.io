export type DemoRole = "admin" | "employee";

export type Policy = {
  id: string;
  title: string;
  topic: string;
  text: string;
  access: "everyone" | "admin";
};

export const samplePolicies: Policy[] = [
  {
    id: "leave",
    title: "Annual Leave Policy",
    topic: "annual holiday leave days time off",
    text:
      "Full-time employees receive 25 days of annual leave plus public holidays. Submit requests through your line manager at least two weeks before your planned leave. Approval depends on team cover.",
    access: "everyone",
  },
  {
    id: "hybrid",
    title: "Hybrid Working Guide",
    topic: "hybrid remote home office work days",
    text:
      "Employees normally work three days in the office and two days remotely each week. Agree your working pattern with your manager. Your manager must approve changes to the agreed pattern.",
    access: "everyone",
  },
  {
    id: "expenses",
    title: "Expenses and Approvals",
    topic: "expenses expense claims receipts spending 500 approval",
    text:
      "Expense claims above £500 require director approval before spending. Submit itemised receipts within 30 days. Your line manager reviews claims of £500 or less.",
    access: "everyone",
  },
  {
    id: "onboarding",
    title: "New Starter Checklist",
    topic: "onboarding new starter induction equipment first week",
    text:
      "During your first week, collect your laptop from IT, activate multi-factor authentication, complete your HR forms and meet your assigned buddy. Your manager schedules a first-week check-in.",
    access: "everyone",
  },
  {
    id: "planning",
    title: "Workforce Planning Example",
    topic: "workforce planning budget recruitment",
    text:
      "Fictional example: the leadership team is reviewing two proposed recruitment roles. This sample document demonstrates an admin-only audience. It contains no real personnel information.",
    access: "admin",
  },
];

export function visiblePolicies(
  policies: Policy[],
  role: DemoRole,
) {
  return policies.filter(
    (policy) => role === "admin" || policy.access === "everyone",
  );
}

export function searchPolicies(
  policies: Policy[],
  role: DemoRole,
  question: string,
) {
  const stopWords = new Set([
    "what", "when", "where", "which", "about", "have",
    "does", "with", "many", "much", "your", "company",
    "policy", "please", "there", "that", "this", "from",
    "our", "how", "can", "the", "and", "are", "for",
    "get", "who",
  ]);

  const words = [
    ...new Set(question.toLowerCase().match(/[a-z0-9]+/g) ?? []),
  ].filter(
    (word) => word.length > 2 && !stopWords.has(word),
  );

  return visiblePolicies(policies, role)
    .map((policy) => {
      const searchableText =
        `${policy.title} ${policy.topic} ${policy.text}`.toLowerCase();

      return {
        policy,
        score: words.filter((word) =>
          searchableText.includes(word),
        ).length,
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((result) => result.policy);
}
