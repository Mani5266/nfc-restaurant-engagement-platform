import Image from "next/image";
import type { Restaurant } from "@/data/restaurants";

interface HeroProps {
  restaurant: Restaurant;
}

export default function Hero({ restaurant }: HeroProps) {
  return (
    <section className="relative w-full" aria-label="Restaurant hero">
      {/* Logo & Identity */}
      <div className="relative z-10 flex flex-col items-center pt-10 pb-6 px-6 animate-fade-in-up">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-lg mb-4 bg-white">
          <Image
            src={restaurant.logo}
            alt={`${restaurant.name} logo`}
            width={80}
            height={80}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-charcoal tracking-wide text-center">
          {restaurant.name}
        </h1>
        <p className="text-warm-gray text-sm tracking-[0.2em] uppercase mt-1 font-body">
          {restaurant.category}
        </p>
      </div>

      {/* Hero Image */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/7] overflow-hidden animate-fade-in stagger-2">
        <Image
          src={restaurant.heroImage}
          alt={`${restaurant.name} — ${restaurant.category}`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/30 via-transparent to-ivory" />
      </div>

      {/* Tagline */}
      <div className="relative z-10 -mt-8 text-center px-6 animate-fade-in-up stagger-3">
        <p className="font-heading text-xl md:text-2xl text-charcoal-light italic leading-relaxed">
          &ldquo;{restaurant.tagline}&rdquo;
        </p>
      </div>
    </section>
  );
}
