import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PropertyCard from "@/components/properties/PropertyCard";
import AgentContactForm from "@/components/agents/AgentContactForm";
import { getAgentById, getAgentReviews, getPropertiesByAgent } from "@/lib/data/index";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const agent = getAgentById(id);
  if (!agent) return {};
  return {
    title: `${agent.name} — Real Estate Agent`,
    description: agent.bio?.slice(0, 160) ?? `Connect with ${agent.name} from ${agent.agencyName}`,
  };
}

export default async function AgentProfilePage({ params }) {
  const { id } = await params;
  const agent = getAgentById(id);
  if (!agent) notFound();

  const reviews = getAgentReviews(agent.id);
  const listings = getPropertiesByAgent(agent.id);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : agent.rating;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[var(--color-surface-1)]">
      <Container>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
            <li><Link href="/" className="hover:text-[var(--color-brand)] transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/properties" className="hover:text-[var(--color-brand)] transition-colors">Properties</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-text-secondary)]" aria-current="page">{agent.name}</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* ── Left (main content) ─────────────────────── */}
          <div className="flex-1 min-w-0 space-y-10">

            {/* Profile header card */}
            <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 md:p-8">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="relative h-28 w-28 shrink-0 rounded-[var(--radius-xl)] overflow-hidden border-2 border-[var(--color-brand)]/30">
                  {agent.avatar ? (
                    <Image src={agent.avatar} alt={agent.name} fill className="object-cover" sizes="112px" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[var(--color-surface-3)] text-3xl font-bold text-[var(--color-brand)]">
                      {agent.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{agent.name}</h1>
                    {agent.verified && (
                      <span className="inline-flex items-center gap-1 bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/30 rounded-full px-2.5 py-0.5 text-xs font-semibold text-[var(--color-brand)]">
                        <VerifiedIcon /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-0.5">{agent.title}</p>
                  <p className="text-sm text-[var(--color-text-muted)] mb-4">{agent.agencyName} · License: {agent.licenseNumber}</p>

                  {/* Stats row */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <StatPill icon={<StarIcon />} value={avgRating.toFixed(1)} label="Rating" />
                    <StatPill icon={<MessageIcon />} value={reviews.length > 0 ? reviews.length : agent.reviewCount} label="Reviews" />
                    <StatPill icon={<BuildingIcon />} value={agent.activeListings} label="Active listings" />
                    <StatPill icon={<TrophyIcon />} value={agent.propertiesSold} label="Sold" />
                    <StatPill icon={<ClockIcon />} value={`${agent.yearsExperience} yrs`} label="Experience" />
                  </div>
                </div>
              </div>

              {/* Response time */}
              <div className="mt-5 flex items-center gap-2 text-sm text-[var(--color-text-secondary)] border-t border-[var(--color-border)] pt-4">
                <ClockIcon className="text-[var(--color-brand)]" />
                <span>{agent.responseTime}</span>
              </div>
            </div>

            {/* Bio */}
            {agent.bio && (
              <section aria-labelledby="bio-heading">
                <h2 id="bio-heading" className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">About</h2>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">{agent.bio}</p>
              </section>
            )}

            {/* Tags: specializations + areas */}
            <section aria-labelledby="spec-heading">
              <h2 id="spec-heading" className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Specializations & Areas Served</h2>
              <div className="space-y-3">
                {agent.specializations?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {agent.specializations.map((s) => (
                      <span key={s} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/20 text-[var(--color-brand)]">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                {agent.areasServed?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {agent.areasServed.map((a) => (
                      <span key={a} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-surface-3)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                        <LocationIcon /> {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Languages */}
            {agent.languages?.length > 0 && (
              <section aria-labelledby="lang-heading">
                <h2 id="lang-heading" className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {agent.languages.map((l) => (
                    <span key={l} className="px-3 py-1 rounded-[var(--radius-sm)] text-sm bg-[var(--color-surface-3)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                      {l}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Active listings */}
            {listings.length > 0 && (
              <section aria-labelledby="listings-heading">
                <div className="flex items-end justify-between mb-6">
                  <h2 id="listings-heading" className="text-xl font-semibold text-[var(--color-text-primary)]">
                    Active Listings ({listings.length})
                  </h2>
                  <Button href="/properties" variant="ghost" size="sm">View all</Button>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {listings.slice(0, 4).map((p) => (
                    <li key={p.id}><PropertyCard property={p} /></li>
                  ))}
                </ul>
              </section>
            )}

            {/* Reviews */}
            <section aria-labelledby="reviews-heading">
              <h2 id="reviews-heading" className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
                Client Reviews {reviews.length > 0 && `(${reviews.length})`}
              </h2>
              {reviews.length > 0 ? (
                <ul className="space-y-4">
                  {reviews.map((r) => (
                    <li key={r.id} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="font-semibold text-sm text-[var(--color-text-primary)]">{r.reviewerName}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {new Date(r.createdAt).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
                          </p>
                        </div>
                        <StarRating rating={r.rating} />
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{r.comment}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-8 text-center">
                  <p className="text-[var(--color-text-muted)] text-sm">No reviews yet.</p>
                </div>
              )}
            </section>

          </div>

          {/* ── Right (sticky sidebar) ───────────────────── */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-28 flex flex-col gap-5">
              {/* Quick contact */}
              <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5">
                <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Get in touch</h2>
                <div className="flex flex-col gap-2.5">
                  <a href={`tel:${agent.phone}`} className="flex items-center justify-center gap-2 h-11 px-5 rounded-[var(--radius-md)] bg-[var(--color-brand)] text-[var(--color-text-inverse)] text-sm font-medium hover:bg-[var(--color-brand-light)] transition-colors">
                    <PhoneIcon /> {agent.phone}
                  </a>
                  <a href={`mailto:${agent.email}`} className="flex items-center justify-center gap-2 h-11 px-5 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface-3)] text-[var(--color-text-primary)] text-sm font-medium hover:border-[var(--color-brand)] transition-colors">
                    <MailIcon /> Email Agent
                  </a>
                  <a href={`https://wa.me/${agent.phone?.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 h-11 px-5 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface-3)] text-[var(--color-text-primary)] text-sm font-medium hover:border-green-500/50 transition-colors">
                    <WhatsAppIcon /> WhatsApp
                  </a>
                </div>

                {/* Social links */}
                {(agent.socialLinks?.linkedin || agent.socialLinks?.instagram) && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex gap-3">
                    {agent.socialLinks?.linkedin && (
                      <a href={agent.socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors">
                        <LinkedInIcon /> LinkedIn
                      </a>
                    )}
                    {agent.socialLinks?.instagram && (
                      <a href={agent.socialLinks.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors">
                        <InstagramIcon /> Instagram
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Contact form */}
              <AgentContactForm agentId={agent.id} agentName={agent.name} />
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatPill({ icon, value, label }) {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <span className="text-[var(--color-brand)]">{icon}</span>
      <span className="font-semibold text-[var(--color-text-primary)]">{value}</span>
      <span className="text-[var(--color-text-muted)]">{label}</span>
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i <= rating ? "var(--color-brand)" : "none"} stroke="var(--color-brand)" strokeWidth="1.5" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function VerifiedIcon() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>; }
function StarIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--color-brand)" stroke="none" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function MessageIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function BuildingIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/></svg>; }
function TrophyIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V8"/><path d="M14 22V8"/><rect x="6" y="2" width="12" height="13" rx="2"/></svg>; }
function ClockIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function LocationIcon() { return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function PhoneIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 5.61 5.61l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>; }
function MailIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>; }
function WhatsAppIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>; }
function LinkedInIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>; }
function InstagramIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>; }
