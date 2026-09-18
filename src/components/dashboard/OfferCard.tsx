"use client";

import { useState } from "react";
import { Gift, Pencil, Trash2, Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Offer {
  id: string;
  restaurant_id: string;
  title: string;
  description: string;
  badge: string;
  cta: string;
  cta_url: string;
  is_active: boolean;
}

interface OfferCardProps {
  offer: Offer;
  onUpdate: () => void;
}

export default function OfferCard({ offer, onUpdate }: OfferCardProps) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(offer);

  const supabase = createClient();

  const handleToggle = async () => {
    await supabase
      .from("offers")
      .update({ is_active: !offer.is_active })
      .eq("id", offer.id);
    onUpdate();
  };

  const handleSave = async () => {
    const { id, restaurant_id, ...data } = form;
    await supabase.from("offers").update(data).eq("id", id);
    setEditing(false);
    onUpdate();
  };

  const handleDelete = async () => {
    await supabase.from("offers").delete().eq("id", offer.id);
    onUpdate();
  };

  if (editing) {
    return (
      <div className="bg-warm-white rounded-2xl border border-border-light p-5 space-y-3">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Offer Title"
          className="w-full px-3 py-2 rounded-lg border border-border-light bg-ivory text-sm font-body focus:outline-none focus:ring-2 focus:ring-deep-green/30"
        />
        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="w-full px-3 py-2 rounded-lg border border-border-light bg-ivory text-sm font-body focus:outline-none focus:ring-2 focus:ring-deep-green/30"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            value={form.badge}
            onChange={(e) => setForm({ ...form, badge: e.target.value })}
            placeholder="Badge text"
            className="px-3 py-2 rounded-lg border border-border-light bg-ivory text-sm font-body focus:outline-none focus:ring-2 focus:ring-deep-green/30"
          />
          <input
            value={form.cta}
            onChange={(e) => setForm({ ...form, cta: e.target.value })}
            placeholder="Button text"
            className="px-3 py-2 rounded-lg border border-border-light bg-ivory text-sm font-body focus:outline-none focus:ring-2 focus:ring-deep-green/30"
          />
        </div>
        <input
          value={form.cta_url}
          onChange={(e) => setForm({ ...form, cta_url: e.target.value })}
          placeholder="Button URL"
          className="w-full px-3 py-2 rounded-lg border border-border-light bg-ivory text-sm font-body focus:outline-none focus:ring-2 focus:ring-deep-green/30"
        />
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-deep-green text-white text-xs font-semibold font-body hover:bg-deep-green-light transition-colors"
          >
            <Check className="w-3.5 h-3.5" /> Save
          </button>
          <button
            onClick={() => { setEditing(false); setForm(offer); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 text-charcoal-light text-xs font-semibold font-body hover:bg-gray-200 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-warm-white rounded-2xl border border-border-light p-5 transition-opacity ${!offer.is_active ? "opacity-50" : ""}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-muted-gold" />
          <span className="text-xs font-semibold text-muted-gold font-body uppercase tracking-wide">
            {offer.badge}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {/* Active toggle */}
          <button
            onClick={handleToggle}
            className={`relative w-10 h-5 rounded-full transition-colors ${offer.is_active ? "bg-deep-green" : "bg-gray-300"}`}
            aria-label={offer.is_active ? "Deactivate offer" : "Activate offer"}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${offer.is_active ? "left-5" : "left-0.5"}`} />
          </button>
        </div>
      </div>

      <h3 className="font-heading text-lg font-bold text-charcoal mb-1">{offer.title}</h3>
      <p className="text-charcoal-light text-sm font-body mb-3">{offer.description}</p>

      <div className="flex gap-2">
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-body text-charcoal-light bg-soft-beige hover:bg-border-light transition-colors"
        >
          <Pencil className="w-3 h-3" /> Edit
        </button>
        {!deleting ? (
          <button
            onClick={() => setDeleting(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-body text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-3 h-3" /> Delete
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-red-600 font-body">Sure?</span>
            <button onClick={handleDelete} className="px-2 py-1 rounded text-xs bg-red-500 text-white font-body">Yes</button>
            <button onClick={() => setDeleting(false)} className="px-2 py-1 rounded text-xs bg-gray-100 text-charcoal font-body">No</button>
          </div>
        )}
      </div>
    </div>
  );
}
