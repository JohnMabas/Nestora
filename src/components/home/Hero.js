import Container from "@/components/ui/Container";
import HeroBackground from "@/components/home/HeroBackground";
import HeroContent from "@/components/home/HeroContent";

const stats = [
  { value: "2,400+", label: "Properties Listed" },
  { value: "340+",   label: "Hotels Available" },
  { value: "18K+",   label: "Happy Clients" },
  { value: "12",     label: "Years in Business" },
];

/**
 * Hero — server component shell.
 *
 * Layout and static stats stay here (server-rendered, zero JS cost).
 * Two client component islands handle the interactive parts:
 *  - HeroBackground: auto-rotating cross-fade background images
 *  - HeroContent:    mount fade-in for heading / subtext / CTAs
 */
export default function Hero() {
  return (
    <section
      aria-label="Hero — discover premium properties and hotels"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Auto-rotating cross-fade background (client component) */}
      <HeroBackground />

      {/* Content */}
      <Container className="relative z-10 pt-28 pb-20 lg:pt-36 lg:pb-24">
        <div className="max-w-2xl">
          {/* Mount fade-in hero content (client component) */}
          <HeroContent />
        </div>
      </Container>

      {/* Stats bar — static, no animation needed */}
      <div className="absolute bottom-0 inset-x-0 z-10 border-t border-[var(--color-border)] bg-[var(--color-surface-0)]/80 backdrop-blur-md">
        <Container>
          <div className="grid grid-cols-2 divide-x divide-[var(--color-border)] sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-0.5 py-4 px-6 text-center"
              >
                <span className="text-2xl font-bold tracking-tight text-[var(--color-brand)]">
                  {stat.value}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">{stat.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
