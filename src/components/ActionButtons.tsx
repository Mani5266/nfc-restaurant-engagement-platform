import {
  Camera,
  MessageCircle,
  UtensilsCrossed,
  Globe,
  MapPin,
  ArrowRight,
} from "lucide-react";
import type { Restaurant } from "@/data/restaurants";

interface ActionButtonsProps {
  restaurant: Restaurant;
}

interface ActionItem {
  id: string;
  label: string;
  sublabel: string;
  href: string;
  icon: React.ReactNode;
  bgClass: string;
  iconBgClass: string;
  stagger: string;
}

export default function ActionButtons({ restaurant }: ActionButtonsProps) {
  const actions: ActionItem[] = [
    {
      id: "action-instagram",
      label: "Follow us on Instagram",
      sublabel: restaurant.instagramHandle,
      href: restaurant.instagramUrl,
      icon: <Camera className="w-5 h-5" aria-hidden="true" />,
      bgClass: "bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 border border-pink-100",
      iconBgClass: "bg-gradient-to-br from-pink-500 to-purple-600 text-white",
      stagger: "stagger-1",
    },
    {
      id: "action-whatsapp",
      label: "Chat on WhatsApp",
      sublabel: "Quick message",
      href: `https://wa.me/${restaurant.whatsappNumber}?text=${encodeURIComponent(restaurant.whatsappMessage)}`,
      icon: <MessageCircle className="w-5 h-5" aria-hidden="true" />,
      bgClass: "bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-100",
      iconBgClass: "bg-gradient-to-br from-green-500 to-emerald-600 text-white",
      stagger: "stagger-2",
    },
    {
      id: "action-menu",
      label: "View Menu",
      sublabel: "Explore our dishes",
      href: restaurant.menuUrl,
      icon: <UtensilsCrossed className="w-5 h-5" aria-hidden="true" />,
      bgClass: "bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-100",
      iconBgClass: "bg-gradient-to-br from-amber-500 to-orange-600 text-white",
      stagger: "stagger-3",
    },
    {
      id: "action-website",
      label: "Visit Website",
      sublabel: restaurant.websiteUrl.replace(/^https?:\/\//, ""),
      href: restaurant.websiteUrl,
      icon: <Globe className="w-5 h-5" aria-hidden="true" />,
      bgClass: "bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-100",
      iconBgClass: "bg-gradient-to-br from-blue-500 to-cyan-600 text-white",
      stagger: "stagger-4",
    },
    {
      id: "action-directions",
      label: "Get Directions",
      sublabel: `${restaurant.address}, ${restaurant.city}`,
      href: restaurant.mapsUrl,
      icon: <MapPin className="w-5 h-5" aria-hidden="true" />,
      bgClass: "bg-gradient-to-r from-rose-50 to-red-50 hover:from-rose-100 hover:to-red-100 border border-rose-100",
      iconBgClass: "bg-gradient-to-br from-rose-500 to-red-600 text-white",
      stagger: "stagger-5",
    },
  ];

  return (
    <section className="px-5 md:px-8 py-6" aria-label="Quick actions">
      <div className="flex flex-col gap-3">
        {actions.map((action) => (
          <a
            key={action.id}
            id={action.id}
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-md animate-fade-in-up ${action.stagger} ${action.bgClass}`}
            aria-label={action.label}
          >
            {/* Icon */}
            <div
              className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${action.iconBgClass}`}
            >
              {action.icon}
            </div>

            {/* Label */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-charcoal text-[15px] font-body">
                {action.label}
              </p>
              <p className="text-warm-gray text-xs mt-0.5 truncate font-body">
                {action.sublabel}
              </p>
            </div>

            {/* Arrow */}
            <ArrowRight
              className="w-4 h-4 text-warm-gray flex-shrink-0"
              aria-hidden="true"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
