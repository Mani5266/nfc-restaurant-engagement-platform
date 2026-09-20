"use client";

import { useState } from "react";
import { Star, Copy, Check, Sparkles } from "lucide-react";

interface ReviewGeneratorProps {
  restaurantId: string;
  restaurantName: string;
  googleReviewUrl: string;
  source: string;
}

// ponytail: rule-based text, no LLM API. Swap buildReview() for POST /api/generate-review when needed.
function buildReview(
  name: string,
  rating: number,
  food: number,
  service: number,
  ambience: number,
  feedback: string
): string {
  const praise: string[] = [];
  if (food >= 4) praise.push("The food was incredible");
  else if (food === 3) praise.push("The food was good");
  if (service >= 4) praise.push("the service was warm and quick");
  else if (service === 3) praise.push("the service was decent");
  if (ambience >= 4) praise.push("the ambience was perfect");
  else if (ambience === 3) praise.push("the vibe was nice");

  const bits = praise.length > 0 ? praise.join(", ").replace(/^The/, "The") + "." : "";
  const clean = feedback.trim().replace(/\s+/g, " ");
  const fb = clean ? ` ${clean.charAt(0).toUpperCase() + clean.slice(1)}${/[.!?…]$/.test(clean) ? "" : "."}` : "";

  if (rating >= 5)
    return `Absolutely loved my meal at ${name}! ${bits}${fb} Highly recommend — 5 stars! ⭐⭐⭐⭐⭐`.replace(/\s+/g, " ").trim();
  if (rating === 4)
    return `Had a great time at ${name}! ${bits}${fb} Definitely worth a visit. 😋`.replace(/\s+/g, " ").trim();
  // honest low-rating text — never fabricate praise
  return `Visited ${name}. ${bits}${fb} Thanks for having me.`.replace(/\s+/g, " ").trim();
}

function Stars({ value, onPick, label, size = "lg" }: { value: number; onPick: (n: number) => void; label: string; size?: "lg" | "md" }) {
  const star = size === "lg" ? "w-8 h-8 sm:w-9 sm:h-9" : "w-6 h-6 sm:w-7 sm:h-7";
  return (
    <div className="flex items-center gap-1 sm:gap-1.5" role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onPick(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className="p-1.5 -m-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-110 transition-transform"
        >
          <Star
            className={`${star} transition-colors ${n <= value ? "fill-muted-gold text-muted-gold" : "text-border-light"}`}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}

const RATING_LABELS = ["", "Poor", "Okay", "Good", "Great", "Excellent!"];

export default function ReviewGenerator({ restaurantId, restaurantName, googleReviewUrl, source }: ReviewGeneratorProps) {
  const [rating, setRating] = useState(5);
  const [food, setFood] = useState(5);
  const [service, setService] = useState(5);
  const [ambience, setAmbience] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [draft, setDraft] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setDraft(buildReview(restaurantName, rating, food, service, ambience, feedback));
    setCopied(false);
  };

  const copyAndOpen = async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = draft;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    if (restaurantId.includes("-")) {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, eventType: "google_review", source }),
        keepalive: true,
      }).catch(() => {});
    }
    setTimeout(() => window.open(googleReviewUrl, "_blank", "noopener"), 350);
  };

  return (
    <div className="px-4 sm:px-8 py-6 flex flex-col gap-4 -mt-4">
      {/* Step 1 */}
      <section aria-label="Step 1 rate" className="bg-white rounded-2xl border border-border-light shadow-sm p-5">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-gold font-body">Step 1 · Rate</p>
        <div className="flex items-center justify-between gap-2 mt-2 flex-wrap">
          <p className="text-sm font-medium text-charcoal font-body">Overall rating</p>
          <p className="text-xs font-semibold text-deep-green font-body" aria-live="polite">{RATING_LABELS[rating]}</p>
        </div>
        <div className="mt-1 -ml-1.5">
          <Stars value={rating} onPick={setRating} label="Overall rating" size="lg" />
        </div>

        <div className="mt-4 pt-4 border-t border-border-light/70 flex flex-col gap-1">
          {[
            { label: "Food", v: food, s: setFood },
            { label: "Service", v: service, s: setService },
            { label: "Ambience", v: ambience, s: setAmbience },
          ].map((c) => (
            <div key={c.label} className="flex items-center justify-between gap-3 py-1">
              <p className="text-sm text-charcoal font-body">{c.label}</p>
              <Stars value={c.v} onPick={c.s} label={c.label} size="md" />
            </div>
          ))}
        </div>
      </section>

      {/* Step 2 */}
      <section aria-label="Step 2 details" className="bg-white rounded-2xl border border-border-light shadow-sm p-5">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-gold font-body">Step 2 · Details</p>
        <label htmlFor="rg-feedback" className="block text-sm font-medium text-charcoal mt-2 mb-1.5 font-body">
          What did you love? <span className="text-warm-gray font-normal">(optional)</span>
        </label>
        <textarea
          id="rg-feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={3}
          maxLength={300}
          placeholder="e.g. the special thali was incredible"
          className="w-full px-4 py-3 rounded-xl border border-border-light bg-ivory text-charcoal text-[16px] sm:text-sm font-body focus:outline-none focus:ring-2 focus:ring-deep-green/30 focus:border-deep-green resize-y min-h-[76px]"
        />
      </section>

      <div className="sticky bottom-[max(1rem,env(safe-area-inset-bottom))] z-10">
        <button
          onClick={generate}
          className="w-full inline-flex items-center justify-center gap-2 bg-deep-green hover:bg-deep-green-light active:scale-[0.99] text-white font-semibold py-4 px-7 rounded-full transition-all text-[15px] shadow-lg"
        >
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          Generate my review
        </button>
      </div>

      {draft !== null && (
        <section aria-label="Step 3 post" className="animate-scale-in bg-deep-green/[0.04] rounded-2xl border border-deep-green/15 p-5 flex flex-col gap-3">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-deep-green font-body">Step 3 · Post</p>
          <label htmlFor="rg-draft" className="text-sm font-medium text-charcoal font-body">
            Your review — edit freely before posting
          </label>
          <textarea
            id="rg-draft"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-charcoal text-[16px] sm:text-sm leading-relaxed font-body focus:outline-none focus:ring-2 focus:ring-deep-green/30 focus:border-deep-green resize-y min-h-[120px]"
          />
          <button
            onClick={copyAndOpen}
            className="w-full inline-flex items-center justify-center gap-2 bg-muted-gold hover:bg-muted-gold-light active:scale-[0.99] text-white font-semibold py-4 px-7 rounded-full transition-all text-[15px] shadow-lg"
          >
            {copied ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
            {copied ? "Copied! Opening Google…" : "Copy & open Google review"}
          </button>
          {copied && (
            <p className="text-center text-warm-gray text-xs font-body">Paste it in the Google review box ✍️</p>
          )}
        </section>
      )}
    </div>
  );
}
