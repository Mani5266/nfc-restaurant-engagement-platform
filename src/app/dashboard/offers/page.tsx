"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import OfferCard from "@/components/dashboard/OfferCard";

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [creating, setCreating] = useState(false);
  const [newOffer, setNewOffer] = useState({
    title: "",
    description: "",
    badge: "🎁 Today's Offer",
    cta: "Explore Offer",
    cta_url: "",
  });

  const supabase = createClient();

  const fetchOffers = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: membership } = await supabase
      .from("restaurant_members")
      .select("restaurant_id")
      .eq("user_id", user.id)
      .single();

    if (!membership) return;
    setRestaurantId(membership.restaurant_id);

    const { data } = await supabase
      .from("offers")
      .select("*")
      .eq("restaurant_id", membership.restaurant_id)
      .order("created_at", { ascending: false });

    setOffers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleCreate = async () => {
    if (!newOffer.title.trim()) return;

    await supabase.from("offers").insert({
      restaurant_id: restaurantId,
      ...newOffer,
    });

    setNewOffer({ title: "", description: "", badge: "🎁 Today's Offer", cta: "Explore Offer", cta_url: "" });
    setCreating(false);
    fetchOffers();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-charcoal">
            Offers
          </h1>
          <p className="text-warm-gray text-sm font-body mt-1">
            Manage promotions shown on your landing page.
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-deep-green hover:bg-deep-green-light text-white font-semibold text-sm font-body transition-all"
        >
          <Plus className="w-4 h-4" /> New Offer
        </button>
      </div>

      {/* Create form */}
      {creating && (
        <div className="bg-warm-white rounded-2xl border border-border-light p-5 space-y-3">
          <h3 className="font-heading text-lg font-semibold text-charcoal">Create New Offer</h3>
          <input
            value={newOffer.title}
            onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
            placeholder="Offer Title (e.g. Weekend Special)"
            className="w-full px-4 py-2.5 rounded-xl border border-border-light bg-ivory text-charcoal text-sm font-body focus:outline-none focus:ring-2 focus:ring-deep-green/30"
          />
          <input
            value={newOffer.description}
            onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
            placeholder="Description (e.g. Buy 2 Desserts, Get 1 Free)"
            className="w-full px-4 py-2.5 rounded-xl border border-border-light bg-ivory text-charcoal text-sm font-body focus:outline-none focus:ring-2 focus:ring-deep-green/30"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              value={newOffer.badge}
              onChange={(e) => setNewOffer({ ...newOffer, badge: e.target.value })}
              placeholder="Badge"
              className="px-4 py-2.5 rounded-xl border border-border-light bg-ivory text-charcoal text-sm font-body focus:outline-none focus:ring-2 focus:ring-deep-green/30"
            />
            <input
              value={newOffer.cta}
              onChange={(e) => setNewOffer({ ...newOffer, cta: e.target.value })}
              placeholder="Button text"
              className="px-4 py-2.5 rounded-xl border border-border-light bg-ivory text-charcoal text-sm font-body focus:outline-none focus:ring-2 focus:ring-deep-green/30"
            />
            <input
              value={newOffer.cta_url}
              onChange={(e) => setNewOffer({ ...newOffer, cta_url: e.target.value })}
              placeholder="Button URL (optional)"
              className="px-4 py-2.5 rounded-xl border border-border-light bg-ivory text-charcoal text-sm font-body focus:outline-none focus:ring-2 focus:ring-deep-green/30"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleCreate}
              className="px-5 py-2.5 rounded-xl bg-deep-green text-white font-semibold text-sm font-body hover:bg-deep-green-light transition-colors"
            >
              Create Offer
            </button>
            <button
              onClick={() => setCreating(false)}
              className="px-5 py-2.5 rounded-xl bg-gray-100 text-charcoal-light font-semibold text-sm font-body hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Offer list */}
      {loading ? (
        <p className="text-warm-gray text-sm font-body py-8 text-center">Loading offers...</p>
      ) : offers.length === 0 ? (
        <div className="bg-warm-white rounded-2xl border border-border-light p-8 text-center">
          <p className="text-warm-gray text-sm font-body">No offers yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} onUpdate={fetchOffers} />
          ))}
        </div>
      )}
    </div>
  );
}
