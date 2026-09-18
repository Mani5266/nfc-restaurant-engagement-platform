import type { Restaurant } from "@/data/restaurants";
import Hero from "./Hero";
import ReviewCTA from "./ReviewCTA";
import ActionButtons from "./ActionButtons";
import OffersSection from "./OffersSection";
import RestaurantInfo from "./RestaurantInfo";
import Footer from "./Footer";

interface RestaurantPageProps {
  restaurant: Restaurant;
}

export default function RestaurantPage({ restaurant }: RestaurantPageProps) {
  return (
    <div className="min-h-dvh bg-ivory flex flex-col">
      <main className="flex-1 w-full max-w-lg mx-auto bg-warm-white shadow-sm">
        <Hero restaurant={restaurant} />
        <ReviewCTA restaurant={restaurant} />
        <ActionButtons restaurant={restaurant} />
        <OffersSection restaurant={restaurant} />
        <RestaurantInfo restaurant={restaurant} />
        <Footer />
      </main>
    </div>
  );
}
