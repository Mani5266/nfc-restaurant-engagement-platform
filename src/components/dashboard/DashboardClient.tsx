"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  MousePointerClick,
  Star,
  Camera,
  MessageCircle,
  UtensilsCrossed,
  MapPin,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import ClicksChart from "@/components/dashboard/ClicksChart";
import DistributionChart from "@/components/dashboard/DistributionChart";
import EventsTable from "@/components/dashboard/EventsTable";
import Insights from "@/components/dashboard/Insights";
import { format, subDays } from "date-fns";

interface DashboardClientProps {
  restaurantId: string;
  restaurantName: string;
  initialEvents: any[];
  prevCount: number;
}

export default function DashboardClient({
  restaurantId,
  restaurantName,
  initialEvents,
  prevCount,
}: DashboardClientProps) {
  const [events, setEvents] = useState(initialEvents);

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to new events for this restaurant
    const channel = supabase
      .channel("dashboard_events")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "events",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          // Add the new event to the top of our local state
          setEvents((current) => [payload.new, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId]);

  const totalClicks = events.length;

  // Calculate change percentage
  const calcChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = Math.round(((current - previous) / previous) * 100);
    return `${change > 0 ? "+" : ""}${change}%`;
  };

  // Count by event type
  const countByType = (type: string) => events.filter((e) => e.event_type === type).length;
  const googleCount = countByType("google_review");
  const instaCount = countByType("instagram");
  const whatsappCount = countByType("whatsapp");
  const menuCount = countByType("menu");
  const directionsCount = countByType("directions");

  // Prepare chart data — clicks per day
  const chartData: { date: string; clicks: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = subDays(new Date(), i);
    const dateStr = format(day, "yyyy-MM-dd");
    const label = format(day, "MMM d");
    const count = events.filter(
      (e) => format(new Date(e.created_at), "yyyy-MM-dd") === dateStr
    ).length;
    chartData.push({ date: label, clicks: count });
  }

  // Distribution data
  const distributionData = [
    { name: "Google", value: googleCount, color: "#EAB308" },
    { name: "Instagram", value: instaCount, color: "#EC4899" },
    { name: "WhatsApp", value: whatsappCount, color: "#22C55E" },
    { name: "Menu", value: menuCount, color: "#F59E0B" },
    { name: "Directions", value: directionsCount, color: "#EF4444" },
    { name: "Other", value: totalClicks - googleCount - instaCount - whatsappCount - menuCount - directionsCount, color: "#94A3B8" },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-charcoal flex items-center gap-2">
            Dashboard
            <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </h1>
          <p className="text-warm-gray text-sm font-body mt-1">
            {restaurantName} — Last 7 days
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Taps"
          value={totalClicks}
          change={calcChange(totalClicks, prevCount)}
          trend={totalClicks >= prevCount ? "up" : "down"}
          icon={MousePointerClick}
          color="bg-deep-green"
        />
        <StatCard
          label="Google Reviews"
          value={googleCount}
          icon={Star}
          color="bg-yellow-500"
        />
        <StatCard
          label="Instagram"
          value={instaCount}
          icon={Camera}
          color="bg-pink-500"
        />
        <StatCard
          label="WhatsApp"
          value={whatsappCount}
          icon={MessageCircle}
          color="bg-green-500"
        />
      </div>

      {/* Smart Suggestions */}
      <Insights events={events} prevCount={prevCount} periodLabel="the last 7 days" />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clicks over time */}
        <div className="lg:col-span-2 bg-warm-white rounded-2xl border border-border-light p-5">
          <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">
            Clicks Over Time
          </h2>
          <ClicksChart data={chartData} />
        </div>

        {/* Distribution */}
        <div className="bg-warm-white rounded-2xl border border-border-light p-5">
          <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">
            Click Distribution
          </h2>
          <DistributionChart data={distributionData} />
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-warm-white rounded-2xl border border-border-light p-5">
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">
          Recent Activity
        </h2>
        <EventsTable events={events.slice(0, 15)} />
      </div>
    </div>
  );
}
