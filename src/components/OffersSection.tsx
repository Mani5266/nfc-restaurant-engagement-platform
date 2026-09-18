import { Gift, ArrowRight } from "lucide-react";
import type { Restaurant } from "@/data/restaurants";

interface OffersSectionProps {
  restaurant: Restaurant;
}

export default function OffersSection({ restaurant }: OffersSectionProps) {
  const { offer } = restaurant;

  return (
    <section className="px-5 md:px-8 py-4 animate-fade-in-up stagger-6" aria-label="Current offers">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-soft-beige to-warm-white border border-border-light p-6 md:p-8">
        {/* Decorative gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-muted-gold/0 via-muted-gold to-muted-gold/0" />

        {/* Badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted-gold/10 text-muted-gold text-xs font-semibold tracking-wide uppercase font-body">
            <Gift className="w-3.5 h-3.5" aria-hidden="true" />
            {offer.badge}
          </span>
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-charcoal mb-2">
            {offer.title}
          </h2>
          <p className="text-charcoal-light text-base md:text-lg font-body mb-5">
            {offer.description}
          </p>

          {offer.ctaUrl && (
            <a
              href={offer.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="offer-cta"
              className="inline-flex items-center justify-center gap-2 bg-charcoal hover:bg-charcoal-light text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-lg text-sm font-body"
              aria-label={offer.cta}
            >
              {offer.cta}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
        </div>

        {/* Decorative dots */}
        <div className="absolute bottom-3 right-4 flex gap-1 opacity-20">
          <div className="w-1.5 h-1.5 rounded-full bg-muted-gold" />
          <div className="w-1.5 h-1.5 rounded-full bg-muted-gold" />
          <div className="w-1.5 h-1.5 rounded-full bg-muted-gold" />
        </div>
      </div>
    </section>
  );
}
