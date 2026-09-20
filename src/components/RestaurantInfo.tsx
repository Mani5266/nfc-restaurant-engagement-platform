"use client";

import { MapPin, Clock, Phone, Navigation, MessageCircle } from "lucide-react";
import TrackableLink from "./TrackableLink";

interface RestaurantInfoProps {
  restaurantId: string;
  source: string;
  name: string;
  address: string;
  city: string;
  hours: string;
  phone: string;
  mapsUrl: string;
  whatsappNumber: string;
  whatsappMessage: string;
}

export default function RestaurantInfo(props: RestaurantInfoProps) {
  const formattedPhone = props.phone
    .replace(/^\+91/, "")
    .replace(/(\d{5})(\d{5})/, "$1 $2");

  return (
    <section
      className="px-5 md:px-8 py-8"
      aria-label="Restaurant information"
    >
      <div className="border-t border-border-light pt-8">
        {/* Restaurant Name */}
        <h2 className="font-heading text-xl font-bold text-charcoal text-center mb-6">
          {props.name}
        </h2>

        {/* Info Items */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-muted-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-charcoal text-sm font-medium font-body">{props.address}</p>
              <p className="text-warm-gray text-xs font-body">{props.city}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-muted-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-charcoal text-sm font-medium font-body">Open today</p>
              <p className="text-warm-gray text-xs font-body">{props.hours}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-muted-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-charcoal text-sm font-medium font-body">+91 {formattedPhone}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-3 gap-3">
          <TrackableLink
            href={`tel:${props.phone}`}
            restaurantId={props.restaurantId}
            eventType="call"
            source={props.source}
            id="info-call"
            className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-soft-beige hover:bg-border-light transition-colors duration-200"
            ariaLabel={`Call ${props.name}`}
          >
            <Phone className="w-5 h-5 text-deep-green" aria-hidden="true" />
            <span className="text-xs font-medium text-charcoal font-body">Call</span>
          </TrackableLink>

          <TrackableLink
            href={props.mapsUrl}
            restaurantId={props.restaurantId}
            eventType="directions"
            source={props.source}
            id="info-directions"
            className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-soft-beige hover:bg-border-light transition-colors duration-200"
            ariaLabel={`Get directions to ${props.name}`}
          >
            <Navigation className="w-5 h-5 text-deep-green" aria-hidden="true" />
            <span className="text-xs font-medium text-charcoal font-body">Directions</span>
          </TrackableLink>

          <TrackableLink
            href={`https://wa.me/${props.whatsappNumber}?text=${encodeURIComponent(props.whatsappMessage)}`}
            restaurantId={props.restaurantId}
            eventType="whatsapp"
            source={props.source}
            id="info-whatsapp"
            className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-soft-beige hover:bg-border-light transition-colors duration-200"
            ariaLabel={`WhatsApp ${props.name}`}
          >
            <MessageCircle className="w-5 h-5 text-deep-green" aria-hidden="true" />
            <span className="text-xs font-medium text-charcoal font-body">WhatsApp</span>
          </TrackableLink>
        </div>
      </div>
    </section>
  );
}
