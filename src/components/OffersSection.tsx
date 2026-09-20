"use client";

import { useRef, useState } from "react";
import { Gift, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import TrackableLink from "./TrackableLink";

export interface OfferItem {
  title: string;
  description: string;
  badge: string;
  cta: string;
  ctaUrl?: string;
}

interface OffersSectionProps {
  restaurantId: string;
  source: string;
  offers: OfferItem[];
}

// ponytail: native scroll-snap, no carousel lib. Add autoplay only if owners ask for it.
export default function OffersSection({ restaurantId, source, offers }: OffersSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  if (offers.length === 0) return null;

  const go = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(i, offers.length - 1));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <section className="py-4" aria-label="Current offers">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3 px-5 md:px-8"
        style={{ scrollbarWidth: "none" }}
      >
        {offers.map((o, i) => (
          <div
            key={`${o.title}-${i}`}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-soft-beige to-warm-white border border-border-light p-6 md:p-8 snap-center shrink-0 w-full"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-muted-gold/0 via-muted-gold to-muted-gold/0" />

            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted-gold/10 text-muted-gold text-xs font-semibold tracking-wide uppercase font-body">
                <Gift className="w-3.5 h-3.5" aria-hidden="true" />
                {o.badge}
              </span>
            </div>

            <div className="text-center">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-charcoal mb-2">
                {o.title}
              </h2>
              <p className="text-charcoal-light text-base md:text-lg font-body mb-5">
                {o.description}
              </p>

              {o.ctaUrl && (
                <TrackableLink
                  href={o.ctaUrl}
                  restaurantId={restaurantId}
                  eventType="offer"
                  source={source}
                  id={`offer-cta-${i}`}
                  className="inline-flex items-center justify-center gap-2 bg-charcoal hover:bg-charcoal-light text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-lg text-sm font-body"
                  ariaLabel={o.cta}
                >
                  {o.cta}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </TrackableLink>
              )}
            </div>

            <div className="absolute bottom-3 right-4 flex gap-1 opacity-20">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-gold" />
              <div className="w-1.5 h-1.5 rounded-full bg-muted-gold" />
              <div className="w-1.5 h-1.5 rounded-full bg-muted-gold" />
            </div>
          </div>
        ))}
      </div>

      {offers.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            onClick={() => go(index - 1)}
            aria-label="Previous offer"
            disabled={index === 0}
            className="p-2 rounded-full border border-border-light text-charcoal disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <div className="flex gap-1.5">
            {offers.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to offer ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-deep-green" : "w-1.5 bg-border-light"}`}
              />
            ))}
          </div>
          <button
            onClick={() => go(index + 1)}
            aria-label="Next offer"
            disabled={index === offers.length - 1}
            className="p-2 rounded-full border border-border-light text-charcoal disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
