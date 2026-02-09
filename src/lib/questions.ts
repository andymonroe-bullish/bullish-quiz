export type Question = {
  id: string;
  question: string;
  subtitle?: string;
  type: "single" | "multiple";
  options: { value: string; label: string }[];
};

export const questions: Question[] = [
  {
    id: "deeperRelationships",
    question:
      "Are you looking to grow your business through deeper relationships with your clients and community?",
    type: "single",
    options: [
      { value: "yes-absolutely", label: "Yes, absolutely" },
      { value: "yes-unsure", label: "Yes, but I'm not sure how" },
      { value: "not-priority", label: "Not a priority right now" },
    ],
  },
  {
    id: "monthlyRevenue",
    question: "What's your current monthly revenue?",
    subtitle: "We ask this to recommend the right event strategy for your stage",
    type: "single",
    options: [
      { value: "under-30k", label: "Under $30K/month" },
      { value: "30k-100k", label: "$30K - $100K/month" },
      { value: "100k-500k", label: "$100K - $500K/month" },
      { value: "500k-plus", label: "$500K+/month" },
    ],
  },
  {
    id: "totalReach",
    question: "How many people could you reach with a single message?",
    subtitle:
      "Email list + social following + community members \u2014 basically, how many people would see it if you announced an event tomorrow?",
    type: "single",
    options: [
      { value: "under-2k", label: "Less than 2,000" },
      { value: "2k-10k", label: "2,000 \u2013 10,000" },
      { value: "10k-100k", label: "10,000 \u2013 100,000" },
      { value: "100k-plus", label: "100,000+" },
    ],
  },
  {
    id: "activeClients",
    question:
      "How many active clients or paying community members do you have right now?",
    type: "single",
    options: [
      { value: "under-25", label: "Less than 25" },
      { value: "25-100", label: "25 \u2013 100" },
      { value: "100-300", label: "100 \u2013 300" },
      { value: "300-plus", label: "300+" },
    ],
  },
  {
    id: "primaryOffer",
    question: "What do you primarily sell?",
    type: "single",
    options: [
      { value: "high-ticket-coaching", label: "High-ticket coaching or program ($3K+)" },
      { value: "community-membership", label: "Community membership (paid)" },
      { value: "courses-digital", label: "Courses or digital products" },
      { value: "services-consulting", label: "Services or consulting" },
      { value: "still-building", label: "I'm still building my offer" },
    ],
  },
  {
    id: "hasCommunity",
    question:
      "Do you have a dedicated space where your clients or community hang out?",
    subtitle: "Slack, Discord, Skool, Circle, Facebook Group, etc.",
    type: "single",
    options: [
      { value: "yes-active", label: "Yes, and it's active" },
      { value: "yes-not-engaged", label: "Yes, but it's not very engaged" },
      { value: "planning", label: "No, but I'm planning to build one" },
      { value: "not-relevant", label: "No, not relevant to my business" },
    ],
  },
  {
    id: "biggestChallenge",
    question: "What's your biggest growth challenge right now?",
    type: "single",
    options: [
      { value: "more-clients", label: "Getting more clients in the door" },
      { value: "retention", label: "Keeping clients longer (retention/churn)" },
      { value: "standing-out", label: "Standing out from competitors" },
      { value: "premium-brand", label: "Building a premium brand" },
      { value: "deeper-relationships", label: "Creating deeper client relationships" },
      { value: "scaling", label: "Scaling without burning out" },
    ],
  },
  {
    id: "eventExperience",
    question: "Have you ever been to an in-person event as an attendee?",
    subtitle: "Industry conference, mastermind, workshop, retreat, etc.",
    type: "single",
    options: [
      { value: "loved-it", label: "Yes, and I loved the experience" },
      { value: "wasnt-great", label: "Yes, but it wasn't great" },
      { value: "curious", label: "No, but I'm curious" },
      { value: "skeptical", label: "No, and I'm skeptical about events" },
    ],
  },
  {
    id: "successVision",
    question:
      "If you hosted an event that went perfectly, what would success look like?",
    subtitle: "Select all that apply",
    type: "multiple",
    options: [
      { value: "revenue", label: "Generated significant revenue" },
      { value: "new-clients", label: "Signed new high-ticket clients" },
      { value: "testimonials", label: "Got incredible testimonials and content" },
      { value: "deeper-relationships", label: "Built deeper relationships with my community" },
      { value: "category-leader", label: "Positioned myself as a category leader" },
      { value: "renewals", label: "My clients renewed or upgraded their programs" },
      { value: "not-sure", label: "I'm not sure yet" },
    ],
  },
  {
    id: "timeline",
    question: "Are you ready to start planning an event in the next 6 months?",
    type: "single",
    options: [
      { value: "move-fast", label: "Yes, I want to move fast (within 3 months)" },
      { value: "need-guidance", label: "Yes, but I need guidance on where to start" },
      { value: "exploring", label: "Maybe, I'm still exploring the idea" },
      { value: "researching", label: "No, just researching for now" },
    ],
  },
];
