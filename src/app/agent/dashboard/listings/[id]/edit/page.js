"use client";

import { useAgentStore } from "@/context/AgentStoreContext";
import ListingForm from "@/components/agents/ListingForm";
import { use } from "react";

export default function EditListingPage({ params }) {
  const { id } = use(params);
  const { getAgentListings } = useAgentStore();

  const listings = getAgentListings();
  const listing  = listings.find((l) => l.id === id);

  if (!listing) {
    return (
      <div className="max-w-2xl mx-auto">
        <p className="text-[var(--color-text-muted)]">Listing not found.</p>
      </div>
    );
  }

  return (
    <ListingForm
      listingId={id}
      initialData={{
        ...listing,
        features: Array.isArray(listing.features) ? listing.features.join("\n") : (listing.features || ""),
      }}
    />
  );
}
