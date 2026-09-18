import { MapPin, Clock, Phone, Navigation, MessageCircle } from "lucide-react";
import type { Restaurant } from "@/data/restaurants";

interface RestaurantInfoProps {
  restaurant: Restaurant;
}

export default function RestaurantInfo({ restaurant }: RestaurantInfoProps) {
  return (
    <section
      className="px-5 md:px-8 py-8 animate-fade-in-up stagger-7"
      aria-label="Restaurant information"
    >
      <div className="border-t border-border-light pt-8">
        {/* Restaurant Name */}
        <h2 className="font-heading text-xl font-bold text-charcoal text-center mb-6">
          {restaurant.name}
        </h2>

        {/* Info Items */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Address */}
          <div className="flex items-start gap-3">
            <MapPin
              className="w-5 h-5 text-muted-gold flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="text-charcoal text-sm font-medium font-body">
                {restaurant.address}
              </p>
              <p className="text-warm-gray text-xs font-body">
                {restaurant.city}
              </p>
            </div>
          </div>

          {/* Hours */}
          <div className="flex items-start gap-3">
            <Clock
              className="w-5 h-5 text-muted-gold flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="text-charcoal text-sm font-medium font-body">
                Open today
              </p>
              <p className="text-warm-gray text-xs font-body">
                {restaurant.hours}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3">
            <Phone
              className="w-5 h-5 text-muted-gold flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="text-charcoal text-sm font-medium font-body">
                +91{" "}
                {restaurant.phone
                  .replace(/^\+91/, "")
                  .replace(/(\d{5})(\d{5})/, "$1 $2")}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-3 gap-3">
          <a
            href={`tel:${restaurant.phone}`}
            id="info-call"
            className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-soft-beige hover:bg-border-light transition-colors duration-200"
            aria-label={`Call ${restaurant.name}`}
          >
            <Phone className="w-5 h-5 text-deep-green" aria-hidden="true" />
            <span className="text-xs font-medium text-charcoal font-body">
              Call
            </span>
          </a>

          <a
            href={restaurant.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="info-directions"
            className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-soft-beige hover:bg-border-light transition-colors duration-200"
            aria-label={`Get directions to ${restaurant.name}`}
          >
            <Navigation
              className="w-5 h-5 text-deep-green"
              aria-hidden="true"
            />
            <span className="text-xs font-medium text-charcoal font-body">
              Directions
            </span>
          </a>

          <a
            href={`https://wa.me/${restaurant.whatsappNumber}?text=${encodeURIComponent(restaurant.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            id="info-whatsapp"
            className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-soft-beige hover:bg-border-light transition-colors duration-200"
            aria-label={`WhatsApp ${restaurant.name}`}
          >
            <MessageCircle
              className="w-5 h-5 text-deep-green"
              aria-hidden="true"
            />
            <span className="text-xs font-medium text-charcoal font-body">
              WhatsApp
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
