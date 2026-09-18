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

export default async function RestaurantLandingPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const restaurant = getRestaurant(slug);

  if (!restaurant) {
    notFound();
  }

  // Detect source from query param (?src=nfc or ?src=qr)
  const source = typeof sp.src === "string" ? sp.src : "direct";

  // Use slug as restaurant ID for static fallback
  // When Supabase is connected, this will be the actual UUID
  const restaurantId = slug;

  return (
    <RestaurantPage
      restaurant={restaurant}
      restaurantId={restaurantId}
      source={source}
    />
  );
}
