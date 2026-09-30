import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeInOnScroll from "@/components/ui/FadeInOnScroll";

const reasons = [
  {
    icon: <ShieldIcon />,
    title: "Verified Listings",
    description:
      "Every property and hotel is manually verified by our team. No ghost listings, no surprises — just accurate, up-to-date information you can trust.",
  },
  {
    icon: <KeyIcon />,
    title: "End-to-End Support",
    description:
      "From your first search to signing the final papers, our experienced agents guide you through every step with zero pressure and full transparency.",
  },
  {
    icon: <TrendIcon />,
    title: "Market Intelligence",
    description:
      "Access real-time pricing data, neighbourhood insights, and investment analysis — so you always negotiate from a position of knowledge.",
  },
  {
    icon: <BuildingIcon />,
    title: "Developer Partnerships",
    description:
      "We work directly with Nigeria's top developers to bring you exclusive off-plan opportunities before they reach the open market.",
  },
  {
    icon: <HotelSmallIcon />,
    title: "Seamless Hotel Booking",
    description:
      "One platform for property discovery and hotel stays. Whether you're relocating or just visiting a city, we've got your accommodation covered.",
  },
  {
    icon: <LockIcon />,
    title: "Secure Transactions",
    description:
      "Our escrow-ready platform and verified legal documentation process protect both buyers and sellers at every stage of the deal.",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      aria-labelledby="why-heading"
      className="section bg-[var(--color-surface-2)] relative overflow-hidden"
    >
      {/* Subtle decorative background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[var(--color-brand)]/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[var(--color-brand)]/4 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left: heading */}
          <FadeInOnScroll className="lg:w-80 shrink-0">
            <SectionHeading
              eyebrow="Why Elgaa Real Estate"
              title="The smarter way to find property."
              subtitle="We combine the depth of a specialist real-estate agency with the convenience of a modern booking platform — right here in Jos Plateau and Abuja."
              id="why-heading"
            />

            {/* Simple stats */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { value: "98%", label: "Client Satisfaction" },
                { value: "₦2T+", label: "Transactions Closed" },
                { value: "14", label: "Cities Covered" },
                { value: "24/7", label: "Agent Support" },
              ].map((s) => (
                <div key={s.label} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-3)] p-4">
                  <p className="text-2xl font-bold text-[var(--color-brand)]">{s.value}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeInOnScroll>

          {/* Right: reasons grid — each reason card fades in with stagger */}
          <div className="flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason, i) => (
              <FadeInOnScroll key={reason.title} index={i}>
                <div
                  className="flex flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-3)] p-5 hover:border-[var(--color-brand)]/40 transition-colors h-full"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand)]/10 text-[var(--color-brand)]">
                    {reason.icon}
                  </div>
                  <h3 className="font-semibold text-[var(--color-text-primary)] text-sm leading-snug">
                    {reason.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {reason.description}
                  </p>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────
function ShieldIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function KeyIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="7.5" cy="15.5" r="5.5" /><path d="M21 2l-9.6 9.6" /><path d="M15.5 7.5l3 3L22 7l-3-3" /></svg>;
}
function TrendIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>;
}
function BuildingIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="1" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
}
function HotelSmallIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>;
}
function LockIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
}
