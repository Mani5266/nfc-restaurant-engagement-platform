import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRestaurant } from "@/lib/getRestaurant";
import RestaurantPage from "@/components/RestaurantPage";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Force dynamic rendering — always fetch fresh data from Supabase
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = getRestaurant(slug);

  if (!restaurant) {
    return { title: "Restaurant Not Found — TapDine" };
  }

  return {
    title: `${restaurant.name} — ${restaurant.category} | TapDine`,
    description: `${restaurant.tagline} Explore our menu, offers, and connect with ${restaurant.name}.`,
    openGraph: {
      title: `${restaurant.name} — ${restaurant.category}`,
      description: restaurant.tagline,
      images: [{ url: restaurant.heroImage, width: 1200, height: 630, alt: restaurant.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${restaurant.name} — ${restaurant.category}`,
      description: restaurant.tagline,
    },
  };
}

import { createClient } from "@/lib/supabase/server";

export default async function RestaurantLandingPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const restaurantData = getRestaurant(slug);

  if (!restaurantData) {
    notFound();
  }

  // Detect source from query param (?src=nfc or ?src=qr)
  const source = typeof sp.src === "string" ? sp.src : "direct";

  // Fetch real UUID + live data from Supabase
  const supabase = await createClient();
  const { data: dbRestaurant } = await supabase
    .from("restaurants")
    .select("id, logo_url, hero_image_url, name, category, tagline, phone, address, city, hours, google_review_url, instagram_url, instagram_handle, whatsapp_number, whatsapp_message, website_url, menu_url, maps_url")
    .eq("slug", slug)
    .single();

  // Fallback to slug if DB fetch fails (e.g. during local build before DB setup)
  const restaurantId = dbRestaurant?.id || slug;

  // ponytail: profile-page links aren't images — fall back to samples instead of crashing next/image
  const asImage = (url: string | null, fallback: string) => {
    if (!url) return fallback;
    if (url.startsWith("/")) return url;
    try {
      const u = new URL(url);
      return /\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i.test(u.pathname) ? url : fallback;
    } catch {
      return fallback;
    }
  };

  // Merge DB data (live) over static fallback
  const restaurant = dbRestaurant
    ? {
        ...restaurantData,
        name: dbRestaurant.name || restaurantData.name,
        category: dbRestaurant.category || restaurantData.category,
        tagline: dbRestaurant.tagline || restaurantData.tagline,
        logo: asImage(dbRestaurant.logo_url, restaurantData.logo),
        heroImage: asImage(dbRestaurant.hero_image_url, restaurantData.heroImage),
        phone: dbRestaurant.phone || restaurantData.phone,
        address: dbRestaurant.address || restaurantData.address,
        city: dbRestaurant.city || restaurantData.city,
        hours: dbRestaurant.hours || restaurantData.hours,
        googleReviewUrl: dbRestaurant.google_review_url || restaurantData.googleReviewUrl,
        instagramUrl: dbRestaurant.instagram_url || restaurantData.instagramUrl,
        instagramHandle: dbRestaurant.instagram_handle || restaurantData.instagramHandle,
        whatsappNumber: dbRestaurant.whatsapp_number || restaurantData.whatsappNumber,
        whatsappMessage: dbRestaurant.whatsapp_message || restaurantData.whatsappMessage,
        websiteUrl: dbRestaurant.website_url || restaurantData.websiteUrl,
        menuUrl: dbRestaurant.menu_url || restaurantData.menuUrl,
        mapsUrl: dbRestaurant.maps_url || restaurantData.mapsUrl,
      }
    : restaurantData;

  // Live offers from dashboard (falls back to static offer inside RestaurantPage)
  let liveOffers = undefined;
  if (dbRestaurant?.id) {
    const { data: dbOffers } = await supabase
      .from("offers")
      .select("title, description, badge, cta, cta_url")
      .eq("restaurant_id", dbRestaurant.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (dbOffers && dbOffers.length > 0) {
      liveOffers = dbOffers.map((o) => ({
        title: o.title,
        description: o.description,
        badge: o.badge,
        cta: o.cta,
        ctaUrl: o.cta_url || undefined,
      }));
    }
  }

  return (
    <RestaurantPage
      restaurant={restaurant}
      restaurantId={restaurantId}
      source={source}
      offers={liveOffers}
    />
  );
}
