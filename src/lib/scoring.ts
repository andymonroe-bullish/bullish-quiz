// ============================================================
// Scoring Configuration for Bullish Events Quiz
// ============================================================
// Edit the point values below to adjust how quiz answers
// map to event model recommendations. Each answer awards
// points to the four models: ascension, fulfillment,
// mastermind, and affinity. The model with the highest
// total score becomes the primary recommendation.
//
// "qualifier" tags are used for disqualification logic.
// "urgency" is used to tag lead temperature.
// ============================================================

export type Scores = {
  ascension: number;
  fulfillment: number;
  mastermind: number;
  affinity: number;
};

export type ScoringEntry = Partial<Scores> & {
  qualifier?: string;
  urgency?: string;
};

export type ScoringRules = Record<string, Record<string, ScoringEntry>>;

export const SCORING_RULES: ScoringRules = {
  deeperRelationships: {
    "yes-absolutely": { ascension: 0, fulfillment: 0, mastermind: 0, affinity: 0 },
    "yes-unsure": { ascension: 0, fulfillment: 0, mastermind: 0, affinity: 0 },
    "not-priority": { ascension: 0, fulfillment: 0, mastermind: 0, affinity: 0 },
  },
  monthlyRevenue: {
    "under-30k": { ascension: 5, fulfillment: 0, mastermind: 0, affinity: 5, qualifier: "too-early" },
    "30k-100k": { ascension: 15, fulfillment: 10, mastermind: 5, affinity: 10, qualifier: "emerging-fit" },
    "100k-500k": { ascension: 10, fulfillment: 25, mastermind: 20, affinity: 15, qualifier: "icp-fit" },
    "500k-plus": { ascension: 15, fulfillment: 30, mastermind: 30, affinity: 20, qualifier: "whale-fit" },
  },
  totalReach: {
    "under-2k": { ascension: 5, fulfillment: 0, mastermind: 0, affinity: 5, qualifier: "too-early" },
    "2k-10k": { ascension: 15, fulfillment: 10, mastermind: 5, affinity: 10, qualifier: "emerging-fit" },
    "10k-100k": { ascension: 25, fulfillment: 20, mastermind: 15, affinity: 20, qualifier: "icp-fit" },
    "100k-plus": { ascension: 30, fulfillment: 25, mastermind: 25, affinity: 25, qualifier: "whale-fit" },
  },
  activeClients: {
    "under-25": { ascension: 20, fulfillment: 0, mastermind: 0, affinity: 10 },
    "25-100": { ascension: 20, fulfillment: 15, mastermind: 10, affinity: 15 },
    "100-300": { ascension: 10, fulfillment: 30, mastermind: 20, affinity: 15 },
    "300-plus": { ascension: 5, fulfillment: 35, mastermind: 25, affinity: 20 },
  },
  primaryOffer: {
    "high-ticket-coaching": { ascension: 15, fulfillment: 25, mastermind: 20, affinity: 10 },
    "community-membership": { ascension: 15, fulfillment: 20, mastermind: 15, affinity: 25 },
    "courses-digital": { ascension: 20, fulfillment: 10, mastermind: 5, affinity: 15 },
    "services-consulting": { ascension: 15, fulfillment: 5, mastermind: 10, affinity: 10 },
    "still-building": { ascension: 0, fulfillment: 0, mastermind: 0, affinity: 0, qualifier: "too-early" },
  },
  hasCommunity: {
    "yes-active": { ascension: 10, fulfillment: 30, mastermind: 15, affinity: 25 },
    "yes-not-engaged": { ascension: 10, fulfillment: 20, mastermind: 10, affinity: 25 },
    "planning": { ascension: 10, fulfillment: 5, mastermind: 5, affinity: 15 },
    "not-relevant": { ascension: 20, fulfillment: 0, mastermind: 5, affinity: 10 },
  },
  biggestChallenge: {
    "more-clients": { ascension: 35, fulfillment: 0, mastermind: 0, affinity: 10 },
    "retention": { ascension: 0, fulfillment: 35, mastermind: 10, affinity: 20 },
    "standing-out": { ascension: 20, fulfillment: 10, mastermind: 15, affinity: 30 },
    "premium-brand": { ascension: 10, fulfillment: 15, mastermind: 30, affinity: 25 },
    "deeper-relationships": { ascension: 5, fulfillment: 25, mastermind: 15, affinity: 35 },
    "scaling": { ascension: 10, fulfillment: 30, mastermind: 20, affinity: 10 },
  },
  eventExperience: {
    "loved-it": { ascension: 15, fulfillment: 15, mastermind: 15, affinity: 15 },
    "wasnt-great": { ascension: 10, fulfillment: 15, mastermind: 10, affinity: 20 },
    "curious": { ascension: 10, fulfillment: 10, mastermind: 5, affinity: 15 },
    "skeptical": { ascension: 5, fulfillment: 5, mastermind: 5, affinity: 10 },
  },
  successVision: {
    "revenue": { ascension: 15, fulfillment: 10, mastermind: 10, affinity: 5 },
    "new-clients": { ascension: 20, fulfillment: 5, mastermind: 5, affinity: 10 },
    "testimonials": { ascension: 10, fulfillment: 10, mastermind: 10, affinity: 15 },
    "deeper-relationships": { ascension: 5, fulfillment: 20, mastermind: 10, affinity: 20 },
    "category-leader": { ascension: 10, fulfillment: 10, mastermind: 20, affinity: 15 },
    "renewals": { ascension: 5, fulfillment: 25, mastermind: 15, affinity: 10 },
    "not-sure": { ascension: 0, fulfillment: 0, mastermind: 0, affinity: 0 },
  },
  timeline: {
    "move-fast": { urgency: "HOT" },
    "need-guidance": { urgency: "WARM" },
    "exploring": { urgency: "COOL" },
    "researching": { urgency: "COLD" },
  },
};

export type EventModel = "ascension" | "fulfillment" | "mastermind" | "affinity";

export type QuizResult = {
  qualified: boolean;
  primaryModel: EventModel | "too-early";
  secondaryModels: EventModel[];
  scores: Scores;
  urgency: string;
};

export function calculateResult(answers: Record<string, string | string[]>): QuizResult {
  // Disqualification checks
  if (
    answers.primaryOffer === "still-building" ||
    answers.monthlyRevenue === "under-30k" ||
    answers.totalReach === "under-2k"
  ) {
    return {
      qualified: false,
      primaryModel: "too-early",
      secondaryModels: [],
      scores: { ascension: 0, fulfillment: 0, mastermind: 0, affinity: 0 },
      urgency: "COLD",
    };
  }

  const scores: Scores = { ascension: 0, fulfillment: 0, mastermind: 0, affinity: 0 };

  for (const [questionId, answer] of Object.entries(answers)) {
    const rule = SCORING_RULES[questionId];
    if (!rule) continue;

    const values = Array.isArray(answer) ? answer : [answer];
    for (const value of values) {
      const points = rule[value];
      if (points) {
        scores.ascension += points.ascension || 0;
        scores.fulfillment += points.fulfillment || 0;
        scores.mastermind += points.mastermind || 0;
        scores.affinity += points.affinity || 0;
      }
    }
  }

  const models: EventModel[] = ["ascension", "fulfillment", "mastermind", "affinity"];
  const maxScore = Math.max(...models.map((m) => scores[m]));
  const primaryModel = models.find((m) => scores[m] === maxScore) || "ascension";

  const secondaryModels = models.filter(
    (m) => m !== primaryModel && scores[m] >= maxScore - 20
  );

  const urgency = SCORING_RULES.timeline[answers.timeline as string]?.urgency || "COOL";

  return { qualified: true, primaryModel, secondaryModels, scores, urgency };
}
