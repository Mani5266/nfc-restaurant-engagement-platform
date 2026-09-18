"use client";

import { useEffect } from "react";
import Image from "next/image";
import Hero from "./Hero";
import ReviewCTA from "./ReviewCTA";
import ActionButtons from "./ActionButtons";
import OffersSection from "./OffersSection";
import RestaurantInfo from "./RestaurantInfo";
import Footer from "./Footer";
import type { Restaurant } from "@/data/restaurants";

interface RestaurantPageProps {
  restaurant: Restaurant;
  restaurantId: string;
  source: string;
  offer?: {
    title: string;
    description: string;
    badge: string;
    cta: string;
    ctaUrl?: string;
  };
}

export default function RestaurantPage({ restaurant, restaurantId, source, offer }: RestaurantPageProps) {
  const activeOffer = offer || restaurant.offer;

  useEffect(() => {
    // Only track if it's a valid UUID (not the static string fallback)
    if (restaurantId.includes("-")) {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, eventType: "page_view", source }),
        keepalive: true,
      }).catch(() => {});
    }
  }, [restaurantId, source]);

  return (
    <div className="min-h-dvh bg-ivory flex flex-col">
      <main className="flex-1 w-full max-w-lg mx-auto bg-warm-white shadow-sm">
        <Hero restaurant={restaurant} />
        <ReviewCTA
          restaurantId={restaurantId}
          googleReviewUrl={restaurant.googleReviewUrl}
          source={source}
        />
        <ActionButtons
          restaurantId={restaurantId}
          source={source}
          instagramUrl={restaurant.instagramUrl}
          instagramHandle={restaurant.instagramHandle}
          whatsappNumber={restaurant.whatsappNumber}
          whatsappMessage={restaurant.whatsappMessage}
          menuUrl={restaurant.menuUrl}
          websiteUrl={restaurant.websiteUrl}
          mapsUrl={restaurant.mapsUrl}
          address={restaurant.address}
          city={restaurant.city}
        />
        {activeOffer && (
          <OffersSection
            restaurantId={restaurantId}
            source={source}
            title={activeOffer.title}
            description={activeOffer.description}
            badge={activeOffer.badge}
            cta={activeOffer.cta}
            ctaUrl={activeOffer.ctaUrl}
          />
        )}
        <RestaurantInfo
          restaurantId={restaurantId}
          source={source}
          name={restaurant.name}
          address={restaurant.address}
          city={restaurant.city}
          hours={restaurant.hours}
          phone={restaurant.phone}
          mapsUrl={restaurant.mapsUrl}
          whatsappNumber={restaurant.whatsappNumber}
          whatsappMessage={restaurant.whatsappMessage}
        />
        <Footer />
      </main>
    </div>
  );
}
