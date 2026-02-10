"use client";

import { useState, useCallback } from "react";
import {
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  TrendingUp,
  Users,
  Award,
  Check,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { questions, type Question } from "@/lib/questions";
import { calculateResult, type QuizResult } from "@/lib/scoring";
import { resultContent, type ResultContent } from "@/lib/results";

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const handleAnswer = useCallback(
    (questionId: string, value: string) => {
      const question = questions[currentStep];
      if (question.type === "multiple") {
        const current = (answers[questionId] as string[]) || [];
        const updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        setAnswers({ ...answers, [questionId]: updated });
      } else {
        setAnswers({ ...answers, [questionId]: value });
      }
    },
    [currentStep, answers]
  );

  const handleNext = useCallback(async () => {
    setDirection("forward");
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Email step - calculate and submit
      setIsSubmitting(true);
      const calcResult = calculateResult(answers);
      setResult(calcResult);

      try {
        await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, result: calcResult, answers }),
        });
      } catch {
        // Fail silently - still show the result
      }

      setIsSubmitting(false);
    }
  }, [currentStep, answers, name, email]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setDirection("back");
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleRestart = useCallback(() => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setEmail("");
    setName("");
  }, []);

  const canProceed = () => {
    const question = questions[currentStep];
    if (!question) return email.length > 0;
    const answer = answers[question.id];
    if (question.type === "multiple") {
      return Array.isArray(answer) && answer.length > 0;
    }
    return answer !== undefined;
  };

  // ── Result Screen ──────────────────────────────────────────
  if (result) {
    if (!result.qualified) return <TooEarlyResult onRestart={handleRestart} />;
    const content = resultContent[result.primaryModel];
    if (!content) return null;
    return <ModelResult content={content} result={result} onRestart={handleRestart} />;
  }

  // ── Email Capture ──────────────────────────────────────────
  if (currentStep === questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 animate-fadeIn">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Your results are ready
            </h2>
            <p className="text-slate-500 mb-8">
              Enter your email and we&apos;ll send you a personalized event
              strategy breakdown along with your recommendation.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-slate-50 text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-slate-50 text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className={`w-full mt-6 px-6 py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${
                canProceed() && !isSubmitting
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing your answers...
                </>
              ) : (
                <>
                  Show My Results
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-xs text-slate-400 text-center mt-4">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>

          <button
            onClick={handleBack}
            className="w-full mt-4 text-slate-500 hover:text-slate-700 text-sm font-medium flex items-center justify-center gap-1 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to questions
          </button>
        </div>
      </div>
    );
  }

  // ── Question Screen ────────────────────────────────────────
  const question = questions[currentStep];
  const progress = ((currentStep + 1) / (questions.length + 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
            <span>
              {currentStep + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div
          key={currentStep}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-10 animate-fadeIn"
        >
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 leading-snug">
            {question.question}
          </h2>
          {question.subtitle && (
            <p className="text-slate-500 text-sm mb-6 mt-2">
              {question.subtitle}
            </p>
          )}
          {!question.subtitle && <div className="mb-6" />}

          <div className="space-y-2.5">
            {question.options.map((option) => {
              const isSelected =
                question.type === "multiple"
                  ? ((answers[question.id] as string[]) || []).includes(
                      option.value
                    )
                  : answers[question.id] === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(question.id, option.value)}
                  className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all duration-150 ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {question.type === "multiple" ? (
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected
                            ? "border-blue-600 bg-blue-600"
                            : "border-slate-300"
                        }`}
                      >
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                    ) : (
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected
                            ? "border-blue-600"
                            : "border-slate-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                        )}
                      </div>
                    )}
                    <span className="text-slate-800 text-sm md:text-base">
                      {option.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mt-8">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="px-5 py-3.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex-1 px-6 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                canProceed()
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {currentStep === questions.length - 1 ? "See My Results" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Virtual Events Result ───────────────────────────────────────
function TooEarlyResult({ onRestart }: { onRestart: () => void }) {
  const accentHex = "#0d9488";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* ── Hero ── */}
        <div className="text-center mb-10 animate-revealUp">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Your Recommended Event Model
          </p>
          <h1
            className="font-cursive text-5xl md:text-7xl mb-3 leading-tight"
            style={{ color: accentHex }}
          >
            Virtual Events
          </h1>
          <p className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
            The Growth Launchpad
          </p>
          <div
            className="mx-auto mt-5 h-1 w-16 rounded-full"
            style={{ backgroundColor: accentHex }}
          />
        </div>

        {/* ── Description ── */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-2xl p-8 md:p-10 mb-6 animate-fadeIn">
          <p className="text-slate-700 text-lg leading-relaxed">
            You&apos;re in the perfect position to start leveraging virtual events to grow your audience, establish trust, and acquire clients. Virtual events are low-cost, high-impact, and the fastest way to build the foundation for in-person events down the road.
          </p>
        </div>

        {/* ── What Are Virtual Events ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-3">
            Why Virtual Events?
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Virtual events let you leverage the power of events without the overhead of in-person. They build trust faster than content alone, position you as an authority in your space, and give your audience a real taste of what it&apos;s like to work with you. They&apos;re also the best way to build the audience and revenue base you&apos;ll need when you&apos;re ready to go in-person.
          </p>
        </div>

        {/* ── Virtual Event Models ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-5">
            Your Virtual Event Models
          </h2>
          <div className="space-y-5">
            {/* Webinars */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: accentHex + "20" }}
                >
                  <Users className="w-5 h-5" style={{ color: accentHex }} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    Webinars
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    60&ndash;90 minute virtual events designed to acquire clients. Teach on a specific problem, provide massive value, and invite attendees to work with you further. Low cost, high conversion, and repeatable.
                  </p>
                </div>
              </div>
            </div>

            {/* Virtual Workshops & Challenges */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: accentHex + "20" }}
                >
                  <Award className="w-5 h-5" style={{ color: accentHex }} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    Virtual Workshops &amp; Challenges
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    1, 3, or 5-day virtual events designed to establish trust, grow your authority, and acquire high-ticket clients. These give attendees a deeper experience and more time to build a relationship with you before making a buying decision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Why It Fits ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Why This Fits Your Business
          </h2>
          <ul className="space-y-3">
            {[
              "Virtual events are the fastest way to build trust and authority with your audience",
              "Low overhead means you can start immediately with minimal risk",
              "They build the audience and revenue base you need for in-person events down the road",
            ].map((reason) => (
              <li key={reason} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: accentHex + "20" }}
                >
                  <Check className="w-3 h-3" style={{ color: accentHex }} />
                </div>
                <span className="text-slate-700">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── CTA ── */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-2xl p-8 mb-6 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Join Our Free Community
          </h2>
          <p className="text-slate-600 mb-6">
            Join our free community of coaches &amp; community owners leveraging events to scale their business.
          </p>
          <a
            href="https://www.skool.com/event"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all w-full shadow-lg"
          >
            Join for Free
          </a>
        </div>

        <button
          onClick={onRestart}
          className="w-full bg-white border border-slate-200 text-slate-700 px-6 py-3.5 rounded-xl font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Start Over
        </button>
      </div>
    </div>
  );
}

// ── Model Result (shared layout) ─────────────────────────────
function ModelResult({
  content,
  result,
  onRestart,
}: {
  content: ResultContent;
  result: QuizResult;
  onRestart: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* ── Premium Reveal Hero ── */}
        <div className="text-center mb-10 animate-revealUp">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Your Event Model
          </p>
          <h1
            className="font-cursive text-5xl md:text-7xl mb-3 leading-tight"
            style={{ color: content.accentHex }}
          >
            {content.title}
          </h1>
          <p className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
            {content.tagline}
          </p>
          <div
            className="mx-auto mt-5 h-1 w-16 rounded-full"
            style={{ backgroundColor: content.accentHex }}
          />
        </div>

        {/* ── Description ── */}
        <div
          className={`bg-gradient-to-br ${content.gradient} border-2 ${content.borderColor} rounded-2xl p-8 md:p-10 mb-6 animate-fadeIn`}
        >
          <p className="text-slate-700 text-lg leading-relaxed">
            {content.description}
          </p>
        </div>

        {/* ── Score Breakdown ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-6 shadow-sm animate-fadeIn">
          <h2 className="text-lg font-bold text-slate-900 mb-5">
            Your Score Breakdown
          </h2>
          <div className="space-y-3">
            {(["ascension", "fulfillment", "mastermind", "affinity"] as const).map(
              (model) => {
                const score = result.scores[model];
                const maxPossible = Math.max(
                  ...Object.values(result.scores)
                );
                const pct = maxPossible > 0 ? (score / maxPossible) * 100 : 0;
                const isWinner = model === result.primaryModel;
                const label =
                  model.charAt(0).toUpperCase() + model.slice(1) + " Event";

                return (
                  <div key={model}>
                    <div className="flex justify-between text-sm mb-1">
                      <span
                        className={
                          isWinner
                            ? "font-bold text-slate-900"
                            : "text-slate-600"
                        }
                      >
                        {label}
                        {isWinner && " \u2190 Best fit"}
                      </span>
                      <span className="font-mono text-slate-500">{score}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-700 ease-out ${
                          isWinner ? content.scoreBarColor : "bg-slate-300"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* ── What Is It ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-3">
            What Is a {content.title}?
          </h2>
          <p className="text-slate-600 leading-relaxed">{content.whatIsIt}</p>
        </div>

        {/* ── Why It Fits ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Why This Fits Your Business
          </h2>
          <ul className="space-y-3">
            {content.whyItFits.map((reason) => (
              <li key={reason} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: content.accentHex + "20" }}
                >
                  <Check className="w-3 h-3" style={{ color: content.accentHex }} />
                </div>
                <span className="text-slate-700">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── What's Possible ── */}
        {content.whatsPossible.length > 0 && (
          <div
            className={`${content.accentColor} border ${content.borderColor} rounded-2xl p-8 mb-6`}
          >
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              What&apos;s Possible
            </h2>
            <p className="text-sm text-slate-500 mb-5">Example scenario</p>
            <div className="space-y-3">
              {content.whatsPossible.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start justify-between gap-4"
                >
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <span
                    className={`text-sm font-bold text-right ${
                      item.highlight ? "" : "text-slate-900"
                    }`}
                    style={item.highlight ? { color: content.accentHex } : undefined}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            {content.model === "affinity" && (
              <div className="mt-5 pt-5 border-t border-blue-200">
                <p className="text-sm text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-900">Keep in mind:</span>{" "}
                  Affinity Events aren&apos;t designed to maximize revenue. Their main
                  objective is to build affinity with your audience &mdash; create
                  community, establish trust, and deliver an insane amount of value.
                  The real ROI is industry authority, positioning, and branding that
                  compounds over time.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Case Study ── */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 mb-6">
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-3"
            style={{ color: content.accentHex }}
          >
            Real Example &mdash; {content.caseStudy.company}
          </p>
          <p className="text-slate-300 leading-relaxed">
            {content.caseStudy.description}
          </p>
          {content.model === "ascension" && (
            <a
              href="https://youtu.be/SQGrBwHd-tA?si=fXct42I95JzKJSoS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-5 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Watch Full Case Study
            </a>
          )}
          {content.model === "fulfillment" && (
            <a
              href="https://youtu.be/AP5BGt4Nr_Q?si=fCzt1b3fkMuqWENo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-5 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Watch Full Case Study
            </a>
          )}
          {content.model === "affinity" && (
            <a
              href="https://youtu.be/-WcwkwiYvUM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Watch Full Case Study
            </a>
          )}
        </div>

        {/* ── CTA ── */}
        <div
          className={`bg-gradient-to-br ${content.gradient} border-2 ${content.borderColor} rounded-2xl p-8 mb-6 text-center`}
        >
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Book Your Free Event Model Implementation Call
          </h2>
          <p className="text-slate-600 mb-6">
            We&apos;ll walk through your results together and map out your event strategy.
          </p>
          <a
            href="https://api.leadconnectorhq.com/widget/bookings/event-model-implementation-cal"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block ${content.buttonColor} ${content.buttonHover} text-white px-8 py-4 rounded-xl font-bold text-lg transition-all w-full shadow-lg`}
          >
            Book My Free Call
          </a>
        </div>

        <button
          onClick={onRestart}
          className="w-full bg-white border border-slate-200 text-slate-700 px-6 py-3.5 rounded-xl font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Start Over
        </button>
      </div>
    </div>
  );
}
