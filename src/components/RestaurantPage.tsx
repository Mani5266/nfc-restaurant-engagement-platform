"use client";

import { useEffect } from "react";
import Image from "next/image";
import Hero from "./Hero";
import Reveal from "./Reveal";
import ReviewCTA from "./ReviewCTA";
import ActionButtons from "./ActionButtons";
import OffersSection, { type OfferItem } from "./OffersSection";
import RestaurantInfo from "./RestaurantInfo";
import Footer from "./Footer";
import type { Restaurant } from "@/data/restaurants";

interface RestaurantPageProps {
  restaurant: Restaurant;
  restaurantId: string;
  source: string;
  offers?: OfferItem[];
  offer?: OfferItem;
}

export default function RestaurantPage({ restaurant, restaurantId, source, offers, offer }: RestaurantPageProps) {
  const allOffers: OfferItem[] =
    offers && offers.length > 0 ? offers : offer ? [offer] : restaurant.offer ? [restaurant.offer] : [];

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
        <Reveal>
          <ReviewCTA
            restaurantId={restaurantId}
            googleReviewUrl={restaurant.googleReviewUrl}
            source={source}
            restaurantName={restaurant.name}
            slug={restaurant.slug}
          />
        </Reveal>
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
        {allOffers.length > 0 && (
          <Reveal>
            <OffersSection
              restaurantId={restaurantId}
              source={source}
              offers={allOffers}
            />
          </Reveal>
        )}
        <Reveal>
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
        </Reveal>
        <Footer />
      </main>
    </div>
  );
}
