export interface RestaurantOffer {
  title: string;
  description: string;
  badge: string;
  cta: string;
  ctaUrl?: string;
}

export interface Restaurant {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  logo: string;
  heroImage: string;

  // Contact
  phone: string;
  address: string;
  city: string;
  hours: string;

  // External Links
  googleReviewUrl: string;
  instagramUrl: string;
  instagramHandle: string;
  whatsappNumber: string;
  whatsappMessage: string;
  websiteUrl: string;
  menuUrl: string;
  mapsUrl: string;

  // Offers
  offer: RestaurantOffer;
}

const restaurants: Restaurant[] = [
  {
    slug: "daily-bean",
    name: "The Daily Bean",
    category: "Café & Kitchen",
    tagline: "Good Food. Brighter Days.",
    logo: "/images/logo.png",
    heroImage: "/images/hero.jpg",

    // Contact
    phone: "+919876543210",
    address: "Road No. 12, Banjara Hills",
    city: "Hyderabad",
    hours: "11:00 AM – 11:00 PM",

    // External Links
    googleReviewUrl:
      "https://search.google.com/local/writereview?placeid=PLACEHOLDER",
    instagramUrl: "https://instagram.com/thedailybean",
    instagramHandle: "@thedailybean",
    whatsappNumber: "919876543210",
    whatsappMessage: "Hi! I found you through your TapDine page.",
    websiteUrl: "https://thedailybean.in",
    menuUrl: "https://thedailybean.in/menu",
    mapsUrl: "https://maps.google.com/?q=The+Daily+Bean+Banjara+Hills+Hyderabad",

    // Offers
    offer: {
      title: "Weekend Special",
      description: "Buy 2 Desserts, Get 1 Free",
      badge: "🎁 Today's Offer",
      cta: "Explore Offer",
      ctaUrl: "https://thedailybean.in/offers",
    },
  },
];

export default restaurants;
