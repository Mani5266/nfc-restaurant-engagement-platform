"use client";

import { Lightbulb, TrendingUp, TrendingDown, Star, Nfc, MousePointerClick } from "lucide-react";
import { format } from "date-fns";

interface InsightEvent {
  event_type: string;
  source: string;
  created_at: string;
}

interface InsightsProps {
  events: InsightEvent[];
  prevCount?: number;
  periodLabel: string;
}

interface Insight {
  title: string;
  text: string;
  tone: "good" | "warn" | "tip";
  icon: React.ReactNode;
}

// ponytail: rule-based tips from event counts, no LLM. POST /api/insights only if rules prove too dumb.
function buildInsights(events: InsightEvent[], prevCount?: number): Insight[] {
  const out: Insight[] = [];
  const count = (t: string) => events.filter((e) => e.event_type === t).length;
  const views = count("page_view");
  const reviews = count("google_review");
  const nfc = events.filter((e) => e.source === "nfc").length;
  const qr = events.filter((e) => e.source === "qr").length;

  if (events.length === 0) {
    return [{
      title: "No taps yet",
      text: "Place your NFC tag or QR stand on tables and tap it once yourself to test the flow.",
      tone: "tip",
      icon: <Nfc className="w-4 h-4" aria-hidden="true" />,
    }];
  }

  // 1. Traffic trend (needs a previous period to compare)
  if (prevCount !== undefined && prevCount > 0) {
    const pct = Math.round(((events.length - prevCount) / prevCount) * 100);
    if (pct <= -20) {
      out.push({
        title: `Traffic down ${-pct}%`,
        text: "Check your NFC tag is still on the table and QR stands are visible. Weekend footfall dips are normal.",
        tone: "warn",
        icon: <TrendingDown className="w-4 h-4" aria-hidden="true" />,
      });
    } else if (pct >= 20) {
      out.push({
        title: `Traffic up ${pct}% — nice!`,
        text: "Whatever changed (placement, staff mentions), keep doing it.",
        tone: "good",
        icon: <TrendingUp className="w-4 h-4" aria-hidden="true" />,
      });
    }
  }

  // 2. Review conversion
  if (views >= 10 && reviews === 0) {
    out.push({
      title: "Views but zero reviews",
      text: "Add the review QR (/review page) to the bill folder — that's the highest-converting spot.",
      tone: "warn",
      icon: <Star className="w-4 h-4" aria-hidden="true" />,
    });
  } else if (views >= 20 && reviews / views < 0.1) {
    out.push({
      title: `Only ${Math.round((reviews / views) * 100)}% leave a review`,
      text: "Try the AI review generator link — pre-written reviews convert far better than a blank Google form.",
      tone: "tip",
      icon: <Star className="w-4 h-4" aria-hidden="true" />,
    });
  } else if (reviews >= 5) {
    out.push({
      title: `${reviews} review taps!`,
      text: "Great conversion — reply to those Google reviews to compound the effect.",
      tone: "good",
      icon: <Star className="w-4 h-4" aria-hidden="true" />,
    });
  }

  // 3. Source mix
  if (nfc === 0 && qr === 0 && events.length >= 5) {
    out.push({
      title: "No NFC/QR taps detected",
      text: "All visits are direct links. Put the physical tag/stand out — in-store taps are your main channel.",
      tone: "warn",
      icon: <Nfc className="w-4 h-4" aria-hidden="true" />,
    });
  }

  // 4. Dead channel
  const dead = (["menu", "instagram", "whatsapp"] as const).find((t) => count(t) === 0);
  if (dead && views >= 5) {
    const label = dead === "menu" ? "Menu" : dead === "instagram" ? "Instagram" : "WhatsApp";
    out.push({
      title: `Nobody tapped ${label}`,
      text: `Open your landing page and verify the ${label} link/button works and points to the right place.`,
      tone: "tip",
      icon: <MousePointerClick className="w-4 h-4" aria-hidden="true" />,
    });
  }

  // 5. Busiest day
  const byDay: Record<string, number> = {};
  events.forEach((e) => {
    const d = format(new Date(e.created_at), "EEEE");
    byDay[d] = (byDay[d] || 0) + 1;
  });
  const top = Object.entries(byDay).sort((a, b) => b[1] - a[1])[0];
  if (top && events.length >= 10) {
    out.push({
      title: `Busiest day: ${top[0]}`,
      text: `Schedule your best offers for ${top[0]}s when footfall peaks.`,
      tone: "tip",
      icon: <Lightbulb className="w-4 h-4" aria-hidden="true" />,
    });
  }

  return out.slice(0, 4);
}

const toneClass: Record<Insight["tone"], string> = {
  good: "border-emerald-200 bg-emerald-50/60 text-emerald-700",
  warn: "border-amber-200 bg-amber-50/60 text-amber-700",
  tip: "border-border-light bg-soft-beige/60 text-deep-green",
};

export default function Insights({ events, prevCount, periodLabel }: InsightsProps) {
  const insights = buildInsights(events, prevCount);
  if (insights.length === 0) return null;

  return (
    <div className="bg-warm-white rounded-2xl border border-border-light p-5">
      <h2 className="font-heading text-lg font-semibold text-charcoal mb-1">
        Smart Suggestions
      </h2>
      <p className="text-warm-gray text-xs font-body mb-4">Based on {periodLabel} — auto-generated from your taps</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((s, i) => (
          <div key={i} className={`rounded-xl border p-4 ${toneClass[s.tone]}`}>
            <div className="flex items-center gap-2 mb-1">
              {s.icon}
              <p className="text-sm font-semibold font-body text-charcoal">{s.title}</p>
            </div>
            <p className="text-xs font-body text-charcoal-light leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
