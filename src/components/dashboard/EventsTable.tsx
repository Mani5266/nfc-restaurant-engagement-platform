"use client";

import { Star, Camera, MessageCircle, UtensilsCrossed, Globe, MapPin, Gift, Phone, Eye } from "lucide-react";
import { format } from "date-fns";

interface EventRow {
  id: string;
  event_type: string;
  source: string;
  created_at: string;
}

interface EventsTableProps {
  events: EventRow[];
}

const eventConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  page_view: { label: "Page View", icon: <Eye className="w-4 h-4" />, color: "text-slate-500" },
  google_review: { label: "Google Review", icon: <Star className="w-4 h-4" />, color: "text-yellow-600" },
  instagram: { label: "Instagram", icon: <Camera className="w-4 h-4" />, color: "text-pink-500" },
  whatsapp: { label: "WhatsApp", icon: <MessageCircle className="w-4 h-4" />, color: "text-green-600" },
  menu: { label: "Menu", icon: <UtensilsCrossed className="w-4 h-4" />, color: "text-amber-600" },
  website: { label: "Website", icon: <Globe className="w-4 h-4" />, color: "text-blue-500" },
  directions: { label: "Directions", icon: <MapPin className="w-4 h-4" />, color: "text-red-500" },
  offer: { label: "Offer", icon: <Gift className="w-4 h-4" />, color: "text-purple-500" },
  call: { label: "Call", icon: <Phone className="w-4 h-4" />, color: "text-teal-500" },
};

const sourceLabels: Record<string, string> = {
  nfc: "NFC Tap",
  qr: "QR Scan",
  direct: "Direct",
  unknown: "Unknown",
};

export default function EventsTable({ events }: EventsTableProps) {
  if (events.length === 0) {
    return (
      <div className="py-8 text-center text-warm-gray text-sm font-body">
        No events recorded yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto overflow-y-auto max-h-[420px]">
      <table className="w-full text-sm font-body">
        <thead className="sticky top-0 bg-warm-white z-10">
          <tr className="border-b border-border-light">
            <th className="text-left py-3 px-3 text-xs font-semibold text-warm-gray uppercase tracking-wide">
              Event
            </th>
            <th className="text-left py-3 px-3 text-xs font-semibold text-warm-gray uppercase tracking-wide">
              Source
            </th>
            <th className="text-left py-3 px-3 text-xs font-semibold text-warm-gray uppercase tracking-wide">
              Time
            </th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => {
            const config = eventConfig[event.event_type] || {
              label: event.event_type,
              icon: <Eye className="w-4 h-4" />,
              color: "text-gray-500",
            };
            return (
              <tr
                key={event.id}
                className="border-b border-border-light/50 hover:bg-soft-beige/50 transition-colors"
              >
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <span className={config.color}>{config.icon}</span>
                    <span className="text-charcoal font-medium">{config.label}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-soft-beige text-charcoal-light font-medium">
                    {sourceLabels[event.source] || event.source}
                  </span>
                </td>
                <td className="py-3 px-3 text-warm-gray text-xs">
                  {format(new Date(event.created_at), "MMM d, h:mm a")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
