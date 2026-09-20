import { notFound } from "next/navigation";
import { getRestaurant } from "@/lib/getRestaurant";
import { createClient } from "@/lib/supabase/server";
import ReviewGenerator from "@/components/ReviewGenerator";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ReviewPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const restaurant = getRestaurant(slug);
  if (!restaurant) notFound();

  const source = typeof sp.src === "string" ? sp.src : "direct";

  const supabase = await createClient();
  const { data: db } = await supabase.from("restaurants").select("id").eq("slug", slug).single();
  const restaurantId = db?.id || slug;

  return (
    <div className="min-h-dvh bg-ivory flex flex-col">
      <main className="flex-1 w-full max-w-lg mx-auto bg-warm-white shadow-sm pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="relative overflow-hidden bg-gradient-to-br from-deep-green to-deep-green-light px-5 sm:px-8 pt-6 pb-8 text-center">
          <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/5" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/5" />
          <a
            href={`/r/${slug}?src=${source}`}
            className="relative z-10 inline-block text-white/70 hover:text-white text-xs font-body mb-4"
          >
            ← Back
          </a>
          <h1 className="relative z-10 font-heading text-[clamp(1.4rem,6vw,1.75rem)] font-bold text-white leading-tight">
            How was {restaurant.name}?
          </h1>
          <p className="relative z-10 text-white/75 text-[clamp(0.8rem,3.5vw,0.9rem)] mt-1.5 font-body">
            Rate us — we&apos;ll draft your Google review
          </p>
          <div className="relative z-10 flex items-center justify-center gap-1.5 mt-4 text-[11px] font-body text-white/80">
            <span className="bg-white/15 rounded-full px-3 py-1">1 Rate</span>
            <span aria-hidden="true">→</span>
            <span className="bg-white/15 rounded-full px-3 py-1">2 Generate</span>
            <span aria-hidden="true">→</span>
            <span className="bg-white/15 rounded-full px-3 py-1">3 Post</span>
          </div>
        </div>
        <ReviewGenerator
          restaurantId={restaurantId}
          restaurantName={restaurant.name}
          googleReviewUrl={restaurant.googleReviewUrl}
          source={source}
        />
      </main>
    </div>
  );
}
