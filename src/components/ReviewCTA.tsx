"use client";

import { useRef, useState } from "react";
import { Star, ArrowRight, Copy, Check, Sparkles } from "lucide-react";

interface ReviewCTAProps {
  restaurantId: string;
  googleReviewUrl: string;
  source: string;
  restaurantName?: string;
  slug?: string;
}

// ponytail: static templates, no AI API. Call /api/suggest-review when templates measurably underperform.
function suggestionsFor(name: string): string[] {
  const n = name || "this place";
  return [
    `Loved ${n}! Great food, cozy vibe and super friendly staff. Highly recommend! ⭐⭐⭐⭐⭐`,
    `Amazing experience at ${n} — tasty dishes, quick service and perfect ambience. Will visit again! 😋`,
    `Such a gem! Clean, welcoming and delicious. ${n} never disappoints. Worth 5 stars! ✨`,
  ];
}

export default function ReviewCTA({ restaurantId, googleReviewUrl, source, restaurantName = "this restaurant", slug }: ReviewCTAProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const suggestions = suggestionsFor(restaurantName);

  // ponytail: direct DOM transform, no re-render per mousemove. Gyro variant only if desktop tilt tests well.
  const onTilt = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transition = "transform 0.08s linear, box-shadow 0.2s ease";
    el.style.transform = `perspective(900px) rotateX(${(-py * 10).toFixed(2)}deg) rotateY(${(px * 12).toFixed(2)}deg) translateZ(6px) scale(1.015)`;
    el.style.boxShadow = `${(-px * 22).toFixed(1)}px ${(22 + py * 18).toFixed(1)}px 44px -12px rgba(0,0,0,0.45)`;
    const g = glareRef.current;
    if (g) {
      g.style.opacity = "1";
      g.style.background = `radial-gradient(circle at ${((px + 0.5) * 100).toFixed(1)}% ${((py + 0.5) * 100).toFixed(1)}%, rgba(255,255,255,0.22), transparent 55%)`;
    }
  };
  const resetTilt = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.6s ease";
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)";
    el.style.boxShadow = "";
    const g = glareRef.current;
    if (g) g.style.opacity = "0";
  };

  const track = (eventType: string) => {
    // ponytail: skip tracking for static-slug fallback (no UUID = FK fail)
    if (!restaurantId.includes("-")) return;
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId, eventType, source }),
      keepalive: true,
    }).catch(() => {});
  };

  const pick = async (text: string, i: number) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(i);
    track("google_review");
    setTimeout(() => window.open(googleReviewUrl, "_blank", "noopener"), 350);
  };
  return (
    <section
      className="px-5 md:px-8 pt-10 pb-2"
      aria-label="Leave a Google review"
    >
      <div
        ref={cardRef}
        onMouseMove={onTilt}
        onMouseLeave={resetTilt}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-deep-green to-deep-green-light p-6 md:p-8 text-center shadow-xl [transform-style:preserve-3d] will-change-transform"
      >
        {/* Pointer-tracked light sheen */}
        <div ref={glareRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300" />
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5" />

        <div className="relative z-10 [transform:translateZ(28px)]">
          <div className="flex items-center justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-muted-gold text-muted-gold"
                aria-hidden="true"
              />
            ))}
          </div>

          <h2 className="font-heading text-xl md:text-2xl font-semibold text-white mb-2">
            Loved your experience?
          </h2>
          <p className="text-white/80 text-sm mb-5 font-body">
            Share your experience on Google
          </p>

          <button
            onClick={() => setOpen((v) => !v)}
            id="google-review-cta"
            aria-expanded={open}
            aria-label="Review us on Google"
            className="inline-flex items-center justify-center gap-2 bg-muted-gold hover:bg-muted-gold-light text-white font-semibold py-3.5 px-7 rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-lg animate-pulse-gold text-sm md:text-base"
          >
            <Star className="w-4 h-4" aria-hidden="true" />
            Review us on Google
            <ArrowRight className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`} aria-hidden="true" />
          </button>

          {slug && (
            <div className="mt-3">
              <a
                href={`/r/${slug}/review?src=${source}`}
                className="inline-flex items-center gap-1.5 text-white/85 hover:text-white text-xs font-body underline underline-offset-4"
              >
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Generate a personalized review instead
              </a>
            </div>
          )}

          {open && (
            <div className="mt-5 text-left animate-scale-in">
              <p className="flex items-center gap-1.5 text-white/90 text-xs font-body mb-3 justify-center">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Tap one — we&apos;ll copy it & open Google
              </p>              <div className="flex flex-col gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => pick(s, i)}
                    className="flex items-start gap-3 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl p-3.5 text-left transition-colors"
                  >
                    <span className="flex-1 text-white text-[13px] leading-relaxed font-body">{s}</span>
                    <span className="flex-shrink-0 mt-0.5 text-muted-gold">
                      {copied === i ? (
                        <Check className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Copy className="w-4 h-4" aria-hidden="true" />
                      )}
                    </span>
                  </button>
                ))}
              </div>
              {copied !== null && (
                <p className="text-center text-white/80 text-xs mt-3 font-body">
                  Copied! Paste it in the Google review box ✍️
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
