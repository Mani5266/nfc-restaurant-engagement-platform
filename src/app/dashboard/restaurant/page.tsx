import { createClient } from "@/lib/supabase/server";
import RestaurantForm from "@/components/dashboard/RestaurantForm";

export default async function RestaurantEditPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("restaurant_members")
    .select("restaurant_id")
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-warm-gray text-sm font-body">No restaurant linked to your account.</p>
      </div>
    );
  }

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", membership.restaurant_id)
    .single();

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-warm-gray text-sm font-body">Restaurant not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-charcoal">
          Edit Restaurant
        </h1>
        <p className="text-warm-gray text-sm font-body mt-1">
          Update your restaurant information. Changes appear on your landing page immediately.
        </p>
      </div>

      <div className="bg-warm-white rounded-2xl border border-border-light p-6 md:p-8">
        <RestaurantForm restaurant={restaurant} />
      </div>
    </div>
  );
}
