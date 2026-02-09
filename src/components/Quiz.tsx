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

// ── Too Early Result ───────────────────────────────────────
function TooEarlyResult({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto animate-fadeIn">
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 md:p-10 mb-6">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-5">
            <TrendingUp className="w-6 h-6 text-amber-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            You&apos;re in the Early Growth Stage
          </h1>
          <p className="text-slate-600 leading-relaxed">
            You&apos;re building a solid foundation. Events work best when you
            have an established audience and revenue base. Here&apos;s what to
            focus on first:
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-5">
            Recommended Next Steps
          </h2>
          <ul className="space-y-4">
            {[
              {
                icon: TrendingUp,
                text: "Focus on reaching $30K+/month in revenue",
              },
              {
                icon: Users,
                text: "Build your audience to 2,000+ people",
              },
              {
                icon: Award,
                text: "Solidify your core offer and client acquisition",
              },
            ].map((item) => (
              <li key={item.text} className="flex items-start gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-slate-700 pt-1.5">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Free Resource
          </h3>
          <p className="text-slate-600 mb-5">
            &ldquo;How to Build an Event-Ready Business&rdquo; &mdash; our
            guide to preparing for your first successful event.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
            Download Free Guide
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 mb-6">
          We&apos;ll keep you updated on event strategies as you grow.
        </p>

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

        {/* ── Stats ── */}
        <div
          className={`${content.accentColor} border ${content.borderColor} rounded-2xl p-8 mb-6`}
        >
          <h2 className="text-lg font-bold text-slate-900 mb-5">
            What You Could Generate
          </h2>
          <div className="grid grid-cols-2 gap-5">
            {content.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  {stat.label}
                </p>
                <p
                  className="text-lg font-bold"
                  style={{ color: stat.highlight ? content.accentHex : undefined }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

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
        </div>

        {/* ── CTA ── */}
        <div
          className={`bg-gradient-to-br ${content.gradient} border-2 ${content.borderColor} rounded-2xl p-8 mb-6 text-center`}
        >
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Want to dive deeper?
          </h2>
          <p className="text-slate-600 mb-6">
            Book your Event Model implementation call below.
          </p>
          <button
            className={`${content.buttonColor} ${content.buttonHover} text-white px-8 py-4 rounded-xl font-bold text-lg transition-all w-full shadow-lg`}
          >
            Create This Event
          </button>
        </div>

        {/* ── Why Not Others ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            Why Not Other Models?
          </h3>
          {content.whyNotOthers.map((item) => (
            <p key={item.model} className="text-sm text-slate-500 mb-2 last:mb-0">
              <span className="font-semibold text-slate-700">
                {item.model}:
              </span>{" "}
              {item.reason}
            </p>
          ))}
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
