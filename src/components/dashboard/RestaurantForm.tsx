"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface RestaurantData {
  id: string;
  name: string;
  category: string;
  tagline: string;
  slug: string;
  phone: string;
  address: string;
  city: string;
  hours: string;
  google_review_url: string;
  instagram_url: string;
  instagram_handle: string;
  whatsapp_number: string;
  whatsapp_message: string;
  website_url: string;
  menu_url: string;
  maps_url: string;
  logo_url: string;
  hero_image_url: string;
}

interface RestaurantFormProps {
  restaurant: RestaurantData;
}

const fields: { key: keyof RestaurantData; label: string; type?: string; placeholder: string; group: string }[] = [
  { key: "name", label: "Restaurant Name", placeholder: "The Daily Bean", group: "Basic Info" },
  { key: "category", label: "Category", placeholder: "Café & Kitchen", group: "Basic Info" },
  { key: "tagline", label: "Tagline", placeholder: "Good Food. Brighter Days.", group: "Basic Info" },
  { key: "phone", label: "Phone Number", type: "tel", placeholder: "+919876543210", group: "Contact" },
  { key: "address", label: "Address", placeholder: "Road No. 12, Banjara Hills", group: "Contact" },
  { key: "city", label: "City", placeholder: "Hyderabad", group: "Contact" },
  { key: "hours", label: "Operating Hours", placeholder: "11:00 AM – 11:00 PM", group: "Contact" },
  { key: "google_review_url", label: "Google Review URL", type: "url", placeholder: "https://search.google.com/local/writereview?placeid=...", group: "Links" },
  { key: "instagram_url", label: "Instagram URL", type: "url", placeholder: "https://instagram.com/yourrestaurant", group: "Links" },
  { key: "instagram_handle", label: "Instagram Handle", placeholder: "@yourrestaurant", group: "Links" },
  { key: "whatsapp_number", label: "WhatsApp Number", placeholder: "919876543210", group: "Links" },
  { key: "whatsapp_message", label: "WhatsApp Pre-filled Message", placeholder: "Hi! I found you through your TapDine page.", group: "Links" },
  { key: "website_url", label: "Website URL", type: "url", placeholder: "https://yourrestaurant.com", group: "Links" },
  { key: "menu_url", label: "Menu URL", type: "url", placeholder: "https://yourrestaurant.com/menu", group: "Links" },
  { key: "maps_url", label: "Google Maps URL", type: "url", placeholder: "https://maps.google.com/?q=...", group: "Links" },
  { key: "logo_url", label: "Logo Image URL", type: "url", placeholder: "/images/logo.png", group: "Images" },
  { key: "hero_image_url", label: "Hero Image URL", type: "url", placeholder: "/images/hero.jpg", group: "Images" },
];

export default function RestaurantForm({ restaurant }: RestaurantFormProps) {
  const [formData, setFormData] = useState<RestaurantData>(restaurant);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: keyof RestaurantData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const supabase = createClient();
    const { id, slug, ...updateData } = formData;

    const { error: updateError } = await supabase
      .from("restaurants")
      .update(updateData)
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  // Group fields
  const groups = ["Basic Info", "Contact", "Links", "Images"];

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {groups.map((group) => (
        <div key={group}>
          <h3 className="text-sm font-semibold text-charcoal-light uppercase tracking-wide mb-4 font-body">
            {group}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields
              .filter((f) => f.group === group)
              .map((field) => (
                <div key={field.key} className={field.key === "whatsapp_message" || field.key === "google_review_url" || field.key === "maps_url" ? "md:col-span-2" : ""}>
                  <label
                    htmlFor={field.key}
                    className="block text-xs font-medium text-charcoal-light mb-1.5 font-body"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.key}
                    type={field.type || "text"}
                    value={formData[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-light bg-ivory text-charcoal text-sm font-body focus:outline-none focus:ring-2 focus:ring-deep-green/30 focus:border-deep-green transition-colors"
                  />
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Preview link */}
      <div className="pt-2">
        <a
          href={`/r/${formData.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-deep-green hover:text-deep-green-light font-medium font-body underline underline-offset-4"
        >
          Preview landing page →
        </a>
      </div>

      {error && (
        <p className="text-red-600 text-xs font-body bg-red-50 rounded-lg p-3">{error}</p>
      )}

      {saved && (
        <p className="text-emerald-600 text-xs font-body bg-emerald-50 rounded-lg p-3">
          ✓ Changes saved successfully!
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="px-8 py-3 rounded-xl bg-deep-green hover:bg-deep-green-light text-white font-semibold text-sm font-body transition-all duration-200 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
