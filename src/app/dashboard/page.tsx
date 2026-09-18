import { createClient } from "@/lib/supabase/server";
import { subDays } from "date-fns";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardOverview() {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get user's restaurant
  const { data: membership } = await supabase
    .from("restaurant_members")
    .select("restaurant_id")
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-charcoal mb-2">No Restaurant Found</h2>
          <p className="text-warm-gray text-sm font-body">
            Your account is not linked to any restaurant yet. Contact support.
          </p>
        </div>
      </div>
    );
  }

  const restaurantId = membership.restaurant_id;

  // Get restaurant info
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("name, slug")
    .eq("id", restaurantId)
    .single();

  // Get events from last 7 days
  const sevenDaysAgo = subDays(new Date(), 7).toISOString();
  const fourteenDaysAgo = subDays(new Date(), 14).toISOString();

  const { data: currentEvents } = await supabase
    .from("events")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .gte("created_at", sevenDaysAgo)
    .order("created_at", { ascending: false });

  const { data: previousEvents } = await supabase
    .from("events")
    .select("id")
    .eq("restaurant_id", restaurantId)
    .gte("created_at", fourteenDaysAgo)
    .lt("created_at", sevenDaysAgo);

  const events = currentEvents || [];
  const prevCount = previousEvents?.length || 0;

  return (
    <DashboardClient 
      restaurantId={restaurantId}
      restaurantName={restaurant?.name || "Your Restaurant"}
      initialEvents={events}
      prevCount={prevCount}
    />
  );
}
