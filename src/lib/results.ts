import type { EventModel } from "./scoring";

export type ResultContent = {
  model: EventModel | "too-early";
  title: string;
  tagline: string;
  description: string;
  // Color system
  accentHex: string;          // for inline styles (cursive text, glows)
  gradient: string;           // hero bg gradient
  borderColor: string;
  accentColor: string;        // stat block bg
  accentLight: string;        // lighter tint for score bar bg
  buttonColor: string;
  buttonHover: string;
  scoreBarColor: string;      // winning score bar
  // Content
  whatIsIt: string;
  whyItFits: string[];
  stats: { label: string; value: string; highlight?: boolean }[];
  whatsPossible: { label: string; value: string; highlight?: boolean }[];
  caseStudy: {
    company: string;
    description: string;
  };
  whyNotOthers: { model: string; reason: string }[];
  ctaText: string;
};

export const resultContent: Record<string, ResultContent> = {
  ascension: {
    model: "ascension",
    title: "Ascension Event",
    tagline: "The Revenue Accelerator",
    description:
      "You\u2019re sitting on an audience that already trusts you, but you\u2019re converting them one-at-a-time. An Ascension Event compresses 6 months of sales conversations into one weekend.",
    accentHex: "#16a34a",
    gradient: "from-green-50 to-emerald-50",
    borderColor: "border-green-200",
    accentColor: "bg-green-50",
    accentLight: "bg-green-100",
    buttonColor: "bg-green-600",
    buttonHover: "hover:bg-green-700",
    scoreBarColor: "bg-green-600",
    whatIsIt:
      "An Ascension Event is designed to convert attendees into clients or move existing clients up your value ladder. You create an immersive experience that breaks limiting beliefs and positions your offer as the obvious next step.",
    whyItFits: [
      "You have the audience leverage to fill seats",
      "Your primary challenge aligns with client acquisition",
      "Your offer is perfect for event positioning",
    ],
    stats: [
      { label: "Event Size", value: "40\u201380 attendees" },
      { label: "Ticket Price", value: "$500\u2013$1,500" },
      { label: "Expected Conversion", value: "15\u201325%" },
      { label: "Projected Revenue", value: "$60K\u2013$180K", highlight: true },
    ],
    whatsPossible: [
      { label: "Attendees", value: "50" },
      { label: "Avg Ticket Price", value: "$997" },
      { label: "Offer Price", value: "$12,000" },
      { label: "Conversion Rate", value: "20%" },
      { label: "Total Revenue", value: "$169,850", highlight: true },
      { label: "Budget", value: "$30,000" },
      { label: "ROI", value: "5.7x", highlight: true },
      { label: "Indirect ROI", value: "Authority, Social Proof, Affinity, & Priceless Marketing Assets" },
    ],
    caseStudy: {
      company: "Fund Launch",
      description:
        "We helped Bridger launch 3 Ascension events for Fund Launch. Each event generated over 7-figures in both ticket sales and high-ticket program sales, totaling over $10M over 3 years.",
    },
    whyNotOthers: [
      {
        model: "Fulfillment Event",
        reason:
          "You have fewer than 50 active clients \u2014 focus on acquisition first",
      },
      {
        model: "Mastermind",
        reason:
          "Build more credibility with successful events before going ultra-premium",
      },
    ],
    ctaText: "Book My Design Sprint ($3K)",
  },
  fulfillment: {
    model: "fulfillment",
    title: "Fulfillment Event",
    tagline: "The Retention Engine",
    description:
      "Your churn problem isn\u2019t a product problem, it\u2019s a relationship problem. Most of your clients have never met you in person. A Fulfillment Event turns digital customers into lifelong advocates.",
    accentHex: "#ea580c",
    gradient: "from-orange-50 to-amber-50",
    borderColor: "border-orange-200",
    accentColor: "bg-orange-50",
    accentLight: "bg-orange-100",
    buttonColor: "bg-orange-600",
    buttonHover: "hover:bg-orange-700",
    scoreBarColor: "bg-orange-600",
    whatIsIt:
      "A Fulfillment Event is included as part of your existing program \u2014 it\u2019s how you over-deliver, build lifetime clients, and generate renewals. Your clients already want to meet you in person.",
    whyItFits: [
      "You have the perfect client base size for high-touch events",
      "Your challenge is retention/renewals \u2014 events solve this directly",
      "Your community is already connected online and ready to meet IRL",
    ],
    stats: [
      { label: "Event Size", value: "60\u2013120 attendees" },
      { label: "Ticket Price", value: "Free (included)" },
      { label: "Renewal Lift", value: "60% \u2192 85%+" },
      { label: "LTV Impact", value: "+$50K\u2013$200K/year", highlight: true },
    ],
    whatsPossible: [
      { label: "Attendees", value: "50" },
      { label: "Renewal Increase", value: "+20%" },
      { label: "LTV Increase", value: "+20%" },
      { label: "New Revenue From LTV Increase & Renewals", value: "$50K\u2013$200K+", highlight: true },
    ],
    caseStudy: {
      company: "High-Ticket Accelerator",
      description:
        "We helped Sergio launch a Fulfillment event for their high-ticket accelerator program which generated renewal revenue of over 6-figures from a free-to-attend event.",
    },
    whyNotOthers: [
      {
        model: "Ascension",
        reason:
          "You\u2019re past acquisition mode \u2014 retention is your unlock",
      },
      {
        model: "Mastermind",
        reason:
          "Build this foundation first, then layer in premium offerings",
      },
    ],
    ctaText: "Book My Design Sprint ($3K)",
  },
  mastermind: {
    model: "mastermind",
    title: "Mastermind Event",
    tagline: "The Premium Play",
    description:
      "You\u2019re undercharging your best clients. The top 10\u201315% would gladly pay 3\u20135x more for proximity to you and each other. A Mastermind Event creates that offer.",
    accentHex: "#9333ea",
    gradient: "from-purple-50 to-violet-50",
    borderColor: "border-purple-200",
    accentColor: "bg-purple-50",
    accentLight: "bg-purple-100",
    buttonColor: "bg-purple-600",
    buttonHover: "hover:bg-purple-700",
    scoreBarColor: "bg-purple-600",
    whatIsIt:
      "A Mastermind Event creates an \u2018inner circle\u2019 within your ecosystem \u2014 the smallest, most exclusive group of your top clients. These are luxury experiences where your best clients pay premium prices for proximity, relationships, and transformational experiences.",
    whyItFits: [
      "Your revenue indicates readiness for ultra-premium positioning",
      "You\u2019re focused on building a category-leading brand",
      "You have the credibility to command premium pricing",
    ],
    stats: [
      { label: "Event Size", value: "15\u201330 attendees" },
      { label: "Ticket Price", value: "$10K\u2013$25K/event" },
      { label: "Annual Model", value: "$25K\u2013$100K/year" },
      { label: "Projected Revenue", value: "$150K\u2013$750K/year", highlight: true },
    ],
    whatsPossible: [],
    caseStudy: {
      company: "Inner Circle Mastermind",
      description:
        "We helped Bridger launch a high-ticket Mastermind program that generated over 6-figures as a yearly membership. We took his inner circle to Utah, Alaska, Hawaii, and Arizona for four premium adventures.",
    },
    whyNotOthers: [
      {
        model: "Ascension",
        reason:
          "You\u2019re beyond acquisition \u2014 focus on premium positioning",
      },
      {
        model: "Fulfillment",
        reason:
          "You could do this, but Mastermind captures more value at your stage",
      },
    ],
    ctaText: "Book My Design Sprint ($3K)",
  },
  affinity: {
    model: "affinity",
    title: "Affinity Event",
    tagline: "The Community Catalyst",
    description:
      "Your competitors are trying to out-content you. You can out-COMMUNITY them. An Affinity Event creates a movement your audience wants to be part of, not just consume.",
    accentHex: "#2563eb",
    gradient: "from-blue-50 to-sky-50",
    borderColor: "border-blue-200",
    accentColor: "bg-blue-50",
    accentLight: "bg-blue-100",
    buttonColor: "bg-blue-600",
    buttonHover: "hover:bg-blue-700",
    scoreBarColor: "bg-blue-600",
    whatIsIt:
      "An Affinity Event is designed to build deep relationships and create a genuine community. It\u2019s about bringing people together, forming connections, and creating a social object around your movement \u2014 not just making sales.",
    whyItFits: [
      "Your priority is building deeper client relationships",
      "You\u2019re focused on standing out through community",
      "You want to create a movement, not just a business",
    ],
    stats: [
      { label: "Event Size", value: "50\u2013200 attendees" },
      { label: "Ticket Price", value: "$300\u2013$2,000" },
      { label: "Key Outcome", value: "Brand loyalty & word-of-mouth" },
      { label: "Long-term Impact", value: "Priceless positioning", highlight: true },
    ],
    whatsPossible: [
      { label: "Attendees", value: "25" },
      { label: "Ticket Price", value: "$4,000" },
      { label: "Sponsor Revenue", value: "$35,000" },
      { label: "Total Revenue", value: "$135,000", highlight: true },
      { label: "Budget", value: "$35,000" },
      { label: "ROI", value: "3.9x", highlight: true },
    ],
    caseStudy: {
      company: "Offline Mode",
      description:
        "We helped Greg launch an Affinity event to gather the best builders within his audience for a 2-day weekend retreat in Miami. The 6-figures in revenue doesn\u2019t hurt, either.",
    },
    whyNotOthers: [
      {
        model: "Ascension",
        reason:
          "You\u2019re more focused on relationships than direct sales",
      },
      {
        model: "Fulfillment",
        reason:
          "You don\u2019t have enough existing clients for pure fulfillment yet",
      },
    ],
    ctaText: "Book My Design Sprint ($3K)",
  },
};
