"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import ClicksChart from "@/components/dashboard/ClicksChart";
import DistributionChart from "@/components/dashboard/DistributionChart";
import EventsTable from "@/components/dashboard/EventsTable";
import { format, subDays } from "date-fns";

type DateRange = "7d" | "30d" | "90d";

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>("7d");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  const [supabase] = useState(() => createClient());

  const rangeDays = { "7d": 7, "30d": 30, "90d": 90 };

  const fetchData = useCallback(async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: membership } = await supabase
      .from("restaurant_members")
      .select("restaurant_id")
      .eq("user_id", user.id)
      .single();

    if (!membership) return;
    setRestaurantId(membership.restaurant_id);

    const since = subDays(new Date(), rangeDays[range]).toISOString();

    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("restaurant_id", membership.restaurant_id)
      .gte("created_at", since)
      .order("created_at", { ascending: false });

    setEvents(data || []);
    setLoading(false);
  }, [range]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!restaurantId) return;

    const channel = supabase
      .channel("analytics_events")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "events",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          setEvents((current) => [payload.new, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId, supabase]);

  // Prepare chart data
  const days = rangeDays[range];
  const chartData = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = subDays(new Date(), i);
    const dateStr = format(day, "yyyy-MM-dd");
    const label = days <= 7 ? format(day, "EEE") : format(day, "MMM d");
    const count = events.filter(
      (e) => format(new Date(e.created_at), "yyyy-MM-dd") === dateStr
    ).length;
    chartData.push({ date: label, clicks: count });
  }

  // Distribution
  const countByType = (type: string) => events.filter((e) => e.event_type === type).length;
  const distributionData = [
    { name: "Google Review", value: countByType("google_review"), color: "#EAB308" },
    { name: "Instagram", value: countByType("instagram"), color: "#EC4899" },
    { name: "WhatsApp", value: countByType("whatsapp"), color: "#22C55E" },
    { name: "Menu", value: countByType("menu"), color: "#F59E0B" },
    { name: "Website", value: countByType("website"), color: "#3B82F6" },
    { name: "Directions", value: countByType("directions"), color: "#EF4444" },
    { name: "Offer", value: countByType("offer"), color: "#8B5CF6" },
    { name: "Call", value: countByType("call"), color: "#14B8A6" },
    { name: "Page View", value: countByType("page_view"), color: "#64748B" },
  ].filter((d) => d.value > 0);

  // Device breakdown from user agents
  const mobileCount = events.filter((e) =>
    /mobile|android|iphone|ipad/i.test(e.user_agent || "")
  ).length;
  const desktopCount = events.length - mobileCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-charcoal">
            Analytics
          </h1>
          <p className="text-warm-gray text-sm font-body mt-1">
            {events.length} total events in the last {rangeDays[range]} days
          </p>
        </div>

        {/* Range selector */}
        <div className="flex gap-1 bg-soft-beige rounded-xl p-1">
          {(["7d", "30d", "90d"] as DateRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold font-body transition-all ${
                range === r
                  ? "bg-deep-green text-white shadow-sm"
                  : "text-charcoal-light hover:text-charcoal"
              }`}
            >
              {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-warm-gray text-sm font-body">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-warm-white rounded-2xl border border-border-light p-4 text-center">
              <p className="text-2xl font-bold text-charcoal font-body">{events.length}</p>
              <p className="text-warm-gray text-xs font-body mt-1">Total Events</p>
            </div>
            <div className="bg-warm-white rounded-2xl border border-border-light p-4 text-center">
              <p className="text-2xl font-bold text-charcoal font-body">{countByType("page_view")}</p>
              <p className="text-warm-gray text-xs font-body mt-1">Page Views</p>
            </div>
            <div className="bg-warm-white rounded-2xl border border-border-light p-4 text-center">
              <p className="text-2xl font-bold text-charcoal font-body">{mobileCount}</p>
              <p className="text-warm-gray text-xs font-body mt-1">Mobile</p>
            </div>
            <div className="bg-warm-white rounded-2xl border border-border-light p-4 text-center">
              <p className="text-2xl font-bold text-charcoal font-body">{desktopCount}</p>
              <p className="text-warm-gray text-xs font-body mt-1">Desktop</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-warm-white rounded-2xl border border-border-light p-5">
              <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">
                Clicks Over Time
              </h2>
              <ClicksChart data={chartData} />
            </div>
            <div className="bg-warm-white rounded-2xl border border-border-light p-5">
              <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">
                Click Distribution
              </h2>
              <DistributionChart data={distributionData} />
            </div>
          </div>

          {/* All Events */}
          <div className="bg-warm-white rounded-2xl border border-border-light p-5">
            <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">
              All Events
            </h2>
            <EventsTable events={events.slice(0, 50)} />
          </div>
        </>
      )}
    </div>
  );
}
