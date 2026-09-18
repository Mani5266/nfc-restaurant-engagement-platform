"use client";

import { Star, ArrowRight } from "lucide-react";
import TrackableLink from "./TrackableLink";

interface ReviewCTAProps {
  restaurantId: string;
  googleReviewUrl: string;
  source: string;
}

export default function ReviewCTA({ restaurantId, googleReviewUrl, source }: ReviewCTAProps) {
  return (
    <section
      className="px-5 md:px-8 pt-10 pb-2 animate-fade-in-up stagger-4"
      aria-label="Leave a Google review"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-deep-green to-deep-green-light p-6 md:p-8 text-center shadow-xl">
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5" />

        <div className="relative z-10">
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

          <TrackableLink
            href={googleReviewUrl}
            restaurantId={restaurantId}
            eventType="google_review"
            source={source}
            id="google-review-cta"
            className="inline-flex items-center justify-center gap-2 bg-muted-gold hover:bg-muted-gold-light text-white font-semibold py-3.5 px-7 rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-lg animate-pulse-gold text-sm md:text-base"
            ariaLabel="Review us on Google"
          >
            <Star className="w-4 h-4" aria-hidden="true" />
            Review us on Google
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </TrackableLink>
        </div>
      </div>
    </section>
  );
}
