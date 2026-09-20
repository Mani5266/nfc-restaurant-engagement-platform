import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRestaurant, getAllSlugs } from "@/lib/getRestaurant";
import RestaurantPage from "@/components/RestaurantPage";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

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

  // Fetch real UUID from Supabase
  const supabase = await createClient();
  const { data: dbRestaurant } = await supabase
    .from("restaurants")
    .select("id")
    .eq("slug", slug)
    .single();

  // Fallback to slug if DB fetch fails (e.g. during local build before DB setup)
  const restaurantId = dbRestaurant?.id || slug;

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
      restaurant={restaurantData}
      restaurantId={restaurantId}
      source={source}
      offers={liveOffers}
    />
  );
}
