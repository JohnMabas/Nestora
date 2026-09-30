import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "About Us — Elgaa Real Estate",
  description:
    "Learn about Elgaa Real Estate — Jos Plateau and Abuja's premier property and hotel discovery platform. Our story, team, and mission.",
};

const stats = [
  { value: "2,400+", label: "Properties Listed" },
  { value: "340+",   label: "Hotels Available" },
  { value: "18,000+", label: "Happy Clients" },
  { value: "12",     label: "Years in Business" },
];

const milestones = [
  { year: "2012", title: "Founded in Jos", description: "Elgaa Real Estate was established in Jos, Plateau State, with a small team of passionate property professionals who believed in making quality real estate accessible to everyone." },
  { year: "2015", title: "Abuja Expansion", description: "We opened our Maitama, Abuja office to serve the growing capital-city market, expanding our reach to government officials, diplomats, and corporate clients." },
  { year: "2018", title: "Hotel Discovery Platform", description: "Recognising the link between property search and travel accommodation, we launched our hotel discovery service — the first of its kind integrated into a real-estate platform in Nigeria." },
  { year: "2021", title: "Digital Transformation", description: "We launched our fully digital platform, making it possible for clients to search, filter, and enquire on thousands of listings from anywhere in the world." },
  { year: "2024", title: "18,000+ Clients Served", description: "Today we have helped over 18,000 clients find their perfect property or hotel stay, with a team of over 40 agents across Jos and Abuja." },
];

const values = [
  {
    icon: <TrustIcon />,
    title: "Trust & Transparency",
    description: "Every listing is manually verified. No ghost properties, no hidden fees — just honest, accurate information.",
  },
  {
    icon: <ExcellenceIcon />,
    title: "Excellence in Service",
    description: "We hold ourselves to the highest standard in everything we do, from our first conversation with a client to closing day.",
  },
  {
    icon: <CommunityIcon />,
    title: "Community First",
    description: "Elgaa is rooted in Jos and Abuja. We invest in these communities and take pride in helping them thrive.",
  },
  {
    icon: <InnovationIcon />,
    title: "Constant Innovation",
    description: "We continuously improve our platform, tools, and processes to serve our clients better in an evolving market.",
  },
];

const team = [
  {
    name: "Amara Okafor",
    role: "Founder & CEO",
    city: "Jos",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
    bio: "With over 15 years in Nigerian real estate, Amara founded Elgaa with the mission of bringing global standards to the Jos and Abuja property market.",
  },
  {
    name: "Chidi Nwosu",
    role: "Head of Sales, Abuja",
    city: "Abuja",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
    bio: "Chidi leads our Maitama team and specialises in high-value diplomatic and executive residential transactions in the Federal Capital Territory.",
  },
  {
    name: "Ngozi Eze",
    role: "Head of Rentals",
    city: "Jos",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&q=80",
    bio: "Ngozi manages our rental and short-let portfolio, helping hundreds of families and corporate clients find the right home every year.",
  },
  {
    name: "Kunle Adebayo",
    role: "Hotel Partnerships Director",
    city: "Abuja",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    bio: "Kunle built Elgaa's hotel network from scratch, forging relationships with properties ranging from boutique resorts to international chains.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 overflow-hidden" aria-label="About hero">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-surface-0)] via-[var(--color-surface-0)]/90 to-[var(--color-surface-0)]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-1)] via-transparent to-transparent" />
        </div>
        <Container className="relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="accent-line" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">
                Our Story
              </span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-[var(--color-text-primary)] leading-[1.08] sm:text-6xl">
              Building Nigeria&apos;s premier
              <span className="text-[var(--color-brand)]"> property platform</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
              Founded in Jos, Plateau State in 2012, Elgaa Real Estate has grown from a boutique agency to Nigeria&apos;s most trusted real-estate and hotel discovery platform.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/properties" variant="primary" size="lg">
                Explore Properties
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Get in Touch
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Stats bar ────────────────────────────────────── */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface-0)]" aria-label="Key statistics">
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[var(--color-border)]">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 py-8 px-6 text-center">
                <span className="text-3xl font-bold tracking-tight text-[var(--color-brand)]">{stat.value}</span>
                <span className="text-sm text-[var(--color-text-muted)]">{stat.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Mission ─────────────────────────────────────── */}
      <section className="section bg-[var(--color-surface-1)]" aria-labelledby="mission-heading">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeading
                eyebrow="Our Mission"
                title="Making quality real estate accessible to everyone"
                subtitle="We believe every Nigerian deserves access to clear, accurate property information — and the support of an expert agent who has their best interests at heart."
                id="mission-heading"
              />
              <div className="mt-8 space-y-4 text-[var(--color-text-secondary)] leading-relaxed">
                <p>
                  When Amara Okafor founded Elgaa Real Estate in Jos in 2012, the local property market was opaque and difficult to navigate. Listings were unreliable, agents were scarce, and buyers and renters had very little information to work with.
                </p>
                <p>
                  Elgaa was built to change that. We started by building the most comprehensive database of verified properties in Jos and Plateau State — then expanded to Abuja, the Federal Capital Territory, as demand grew.
                </p>
                <p>
                  Today, we combine the breadth of a technology platform with the personalised service of a specialist agency — serving first-time buyers, long-term investors, corporate clients, and everyone in between.
                </p>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-[var(--radius-2xl)] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80"
                alt="Elgaa Real Estate team in their Jos office"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 img-overlay-bottom" aria-hidden="true" />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Our Values ───────────────────────────────────── */}
      <section className="section bg-[var(--color-surface-2)]" aria-labelledby="values-heading">
        <Container>
          <SectionHeading
            eyebrow="What We Stand For"
            title="Our Values"
            subtitle="The principles that guide every interaction, decision, and transaction at Elgaa."
            align="center"
            className="mx-auto mb-12 max-w-xl"
            id="values-heading"
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="flex flex-col gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-3)] p-6 hover:border-[var(--color-brand)]/40 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand)]/10 text-[var(--color-brand)]">
                  {value.icon}
                </div>
                <h3 className="font-semibold text-[var(--color-text-primary)]">{value.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Our Journey ──────────────────────────────────── */}
      <section className="section bg-[var(--color-surface-1)]" aria-labelledby="journey-heading">
        <Container>
          <SectionHeading
            eyebrow="Our Journey"
            title="12 years building something special"
            subtitle="From a small Jos office to Nigeria's most trusted property platform — here's how we got here."
            id="journey-heading"
            className="mb-12"
          />

          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-6 top-0 bottom-0 w-px bg-[var(--color-border)]"
              aria-hidden="true"
            />

            <ol className="space-y-10" aria-label="Company milestones">
              {milestones.map((milestone) => (
                <li key={milestone.year} className="relative flex gap-8 pl-16">
                  {/* Circle marker */}
                  <div
                    className="absolute left-0 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-brand)] bg-[var(--color-surface-1)] text-xs font-bold text-[var(--color-brand)]"
                    aria-hidden="true"
                  >
                    {milestone.year}
                  </div>
                  <div className="pt-2 pb-6">
                    <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">{milestone.title}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{milestone.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* ── Leadership Team ───────────────────────────────── */}
      <section className="section bg-[var(--color-surface-0)]" aria-labelledby="team-heading">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
            <SectionHeading
              eyebrow="The Team"
              title="Meet our leadership"
              subtitle="Experienced professionals dedicated to delivering exceptional results for every client."
              id="team-heading"
            />
            <Button href="/agents" variant="outline" size="sm" className="shrink-0 self-start sm:self-auto">
              View All Agents
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div
                key={member.name}
                className="flex flex-col rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] overflow-hidden hover:border-[var(--color-brand)]/40 transition-colors"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 img-overlay-bottom" aria-hidden="true" />
                  <div className="absolute bottom-3 left-3">
                    <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-0)]/70 px-2 py-0.5 text-xs text-[var(--color-text-muted)] backdrop-blur-sm">
                      {member.city}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <div>
                    <h3 className="font-semibold text-[var(--color-text-primary)]">{member.name}</h3>
                    <p className="text-sm text-[var(--color-brand)]">{member.role}</p>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed line-clamp-3">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA Band ──────────────────────────────────────── */}
      <section className="section bg-[var(--color-brand)]" aria-label="Contact call to action">
        <Container>
          <div className="flex flex-col items-center text-center gap-6">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-inverse)] sm:text-4xl">
              Ready to find your perfect place?
            </h2>
            <p className="text-base text-[var(--color-text-inverse)]/80 max-w-lg">
              Whether you&apos;re buying, renting, or booking a hotel — our team is here to help. Get in touch today.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 h-13 px-7 rounded-[var(--radius-lg)] bg-[var(--color-text-inverse)] text-[var(--color-brand)] font-semibold hover:bg-[var(--color-text-primary)] transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 h-13 px-7 rounded-[var(--radius-lg)] border-2 border-[var(--color-text-inverse)]/40 text-[var(--color-text-inverse)] font-semibold hover:bg-[var(--color-text-inverse)]/10 transition-colors"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function TrustIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function ExcellenceIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
}
function CommunityIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
function InnovationIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>;
}
