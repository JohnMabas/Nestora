"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAgentAuth } from "@/context/AgentAuthContext";
import { useAgentStore } from "@/context/AgentStoreContext";
import Button from "@/components/ui/Button";

const PROPERTY_TYPES = ["apartment", "house", "villa", "penthouse", "studio", "duplex", "land", "commercial"];
const LISTING_TYPES  = ["sale", "rent", "short-let"];
const CURRENCIES     = ["NGN", "USD", "GBP", "EUR"];
const AMENITIES_LIST = [
  "Swimming Pool", "Smart Home", "Garage", "24/7 Security", "Generator",
  "Central A/C", "Gym", "Concierge", "Lift", "Garden", "Solar Panels",
  "Borehole Water", "CCTV", "Barbeque Area", "Rooftop Terrace",
];

const DEFAULT_FORM = {
  title: "", description: "", propertyType: "apartment", listingType: "sale",
  price: "", currency: "NGN", pricePeriod: "", location: { city: "", state: "", country: "Nigeria", address: "" },
  bedrooms: "", bathrooms: "", area: "", amenities: [], features: "", status: "active",
  images: [{ src: "", alt: "" }], featured: false,
};

/**
 * ListingForm — shared between /listings/new and /listings/[id]/edit
 * @param {{ initialData?: Object, listingId?: string }} props
 */
export default function ListingForm({ initialData, listingId }) {
  const router = useRouter();
  const { agent } = useAgentAuth();
  const { addListing, updateListing } = useAgentStore();

  const isEditing = !!listingId;
  const [form, setForm] = useState({ ...DEFAULT_FORM, ...initialData });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const set = (key) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [key]: val }));
  };

  const setLoc = (key) => (e) =>
    setForm((p) => ({ ...p, location: { ...p.location, [key]: e.target.value } }));

  const toggleAmenity = (label) =>
    setForm((p) => ({
      ...p,
      amenities: p.amenities.some((a) => a.label === label)
        ? p.amenities.filter((a) => a.label !== label)
        : [...p.amenities, { icon: label.toLowerCase().replace(/\s+/g, "-"), label }],
    }));

  const setImageSrc = (idx, val) =>
    setForm((p) => {
      const images = [...p.images];
      images[idx] = { src: val, alt: form.title || "Property image" };
      return { ...p, images };
    });

  const handleSave = async (status) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));

    const payload = {
      ...form,
      price: Number(form.price) || 0,
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      area: Number(form.area) || 0,
      features: form.features ? form.features.split("\n").map((f) => f.trim()).filter(Boolean) : [],
      images: form.images.filter((img) => img.src),
      status,
      agent: { id: agent?.id, name: agent?.name, photo: agent?.avatar, phone: agent?.phone, email: agent?.email },
    };

    if (isEditing) {
      // TODO: replace with PATCH /api/properties/:id
      updateListing(listingId, payload);
    } else {
      // TODO: replace with POST /api/properties
      addListing(payload);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      router.push("/agent/dashboard/listings");
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
          {isEditing ? "Edit Listing" : "Add New Listing"}
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
          {isEditing ? "Update your listing details." : "Fill in the details for your new property listing."}
        </p>
      </div>

      {/* Success state */}
      {saved && (
        <div className="rounded-[var(--radius-md)] border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          ✓ Listing {isEditing ? "updated" : "saved"} successfully. Redirecting…
        </div>
      )}

      {/* Section: Basic info */}
      <FormSection title="Basic Information">
        <Field label="Title" required>
          <input type="text" required value={form.title} onChange={set("title")} placeholder="e.g. Hill View Villa, Jos" className="input-base" />
        </Field>
        <Field label="Description" required>
          <textarea value={form.description} onChange={set("description")} rows={4} placeholder="Describe the property…" className="input-base resize-none" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Property Type">
            <select value={form.propertyType} onChange={set("propertyType")} className="input-base">
              {PROPERTY_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>
          </Field>
          <Field label="Listing Type">
            <select value={form.listingType} onChange={set("listingType")} className="input-base">
              {LISTING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
        </div>
      </FormSection>

      {/* Section: Pricing */}
      <FormSection title="Pricing">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Currency" className="col-span-1">
            <select value={form.currency} onChange={set("currency")} className="input-base">
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Price" required className="col-span-2">
            <input type="number" min="0" value={form.price} onChange={set("price")} placeholder="0" className="input-base" />
          </Field>
        </div>
        <Field label="Price period (optional)">
          <input type="text" value={form.pricePeriod} onChange={set("pricePeriod")} placeholder="e.g. /month, /year" className="input-base" />
        </Field>
      </FormSection>

      {/* Section: Location */}
      <FormSection title="Location">
        <Field label="Street address">
          <input type="text" value={form.location.address} onChange={setLoc("address")} placeholder="14 Hill Station Road" className="input-base" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="City" required>
            <input type="text" required value={form.location.city} onChange={setLoc("city")} placeholder="Jos" className="input-base" />
          </Field>
          <Field label="State">
            <input type="text" value={form.location.state} onChange={setLoc("state")} placeholder="Plateau" className="input-base" />
          </Field>
        </div>
        <Field label="Country">
          <input type="text" value={form.location.country} onChange={setLoc("country")} placeholder="Nigeria" className="input-base" />
        </Field>
      </FormSection>

      {/* Section: Details */}
      <FormSection title="Property Details">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Bedrooms">
            <input type="number" min="0" value={form.bedrooms} onChange={set("bedrooms")} placeholder="0" className="input-base" />
          </Field>
          <Field label="Bathrooms">
            <input type="number" min="0" value={form.bathrooms} onChange={set("bathrooms")} placeholder="0" className="input-base" />
          </Field>
          <Field label="Area (m²)">
            <input type="number" min="0" value={form.area} onChange={set("area")} placeholder="0" className="input-base" />
          </Field>
        </div>
        <Field label="Features (one per line)">
          <textarea value={form.features} onChange={set("features")} rows={3} placeholder={"Floor-to-ceiling windows\nItalian marble floors\nSolar panels"} className="input-base resize-none" />
        </Field>
      </FormSection>

      {/* Section: Amenities */}
      <FormSection title="Amenities">
        <div className="flex flex-wrap gap-2">
          {AMENITIES_LIST.map((label) => {
            const selected = form.amenities.some((a) => a.label === label);
            return (
              <button
                key={label}
                type="button"
                onClick={() => toggleAmenity(label)}
                className={[
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                  selected
                    ? "bg-[var(--color-brand)]/10 border-[var(--color-brand)]/40 text-[var(--color-brand)]"
                    : "bg-[var(--color-surface-3)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
                ].join(" ")}
              >
                {selected ? "✓ " : ""}{label}
              </button>
            );
          })}
        </div>
      </FormSection>

      {/* Section: Images */}
      <FormSection title="Images">
        <p className="text-xs text-[var(--color-text-muted)] -mt-2 mb-3">
          Paste Unsplash or other image URLs. Real file upload will be available when backend is connected.
        </p>
        {form.images.map((img, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <input
              type="url"
              value={img.src}
              onChange={(e) => setImageSrc(idx, e.target.value)}
              placeholder={`Image ${idx + 1} URL`}
              className="input-base flex-1"
            />
            {form.images.length > 1 && (
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                className="p-2 text-[var(--color-text-muted)] hover:text-red-400 transition-colors"
              >
                <TrashIcon />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setForm((p) => ({ ...p, images: [...p.images, { src: "", alt: "" }] }))}
          className="text-xs text-[var(--color-brand)] hover:underline mt-1"
        >
          + Add another image
        </button>
      </FormSection>

      {/* Featured toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={set("featured")}
          className="w-4 h-4 accent-[var(--color-brand)]"
        />
        <div>
          <span className="text-sm font-medium text-[var(--color-text-primary)]">Featured listing</span>
          <p className="text-xs text-[var(--color-text-muted)]">Show prominently on the homepage</p>
        </div>
      </label>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-2 border-t border-[var(--color-border)]">
        <Button
          type="button"
          variant="secondary"
          size="md"
          disabled={saving}
          onClick={() => handleSave("pending")}
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          variant="primary"
          size="md"
          disabled={saving || saved}
          onClick={() => handleSave("active")}
        >
          {saving ? <><Spinner /> Saving…</> : saved ? "✓ Saved" : "Publish Listing"}
        </Button>
        <Button href="/agent/dashboard/listings" variant="ghost" size="md">
          Cancel
        </Button>
      </div>
    </div>
  );
}

// ─── Field / Section wrappers ────────────────────────────────────────────────

function FormSection({ title, children }) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5 space-y-4">
      <h2 className="text-sm font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-3">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children, required, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
        {label}{required && <span className="text-[var(--color-brand)] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function TrashIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>; }
function Spinner() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>; }
