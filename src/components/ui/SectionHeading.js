/**
 * SectionHeading — consistent section title + subtitle layout.
 * Used on every homepage section for visual consistency.
 */

/**
 * @param {{
 *   eyebrow?: string,
 *   title: string,
 *   subtitle?: string,
 *   align?: 'left'|'center',
 *   titleAs?: 'h1'|'h2'|'h3',
 *   className?: string
 * }} props
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  titleAs: Heading = "h2",
  className = "",
}) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={["flex flex-col gap-3", alignClass, className].join(" ")}>
      {eyebrow && (
        <div className="flex items-center gap-2.5">
          {align !== "center" && <span className="accent-line" aria-hidden="true" />}
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">
            {eyebrow}
          </span>
          {align === "center" && <span className="accent-line" aria-hidden="true" />}
        </div>
      )}

      <Heading className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
        {title}
      </Heading>

      {subtitle && (
        <p className="max-w-xl text-base leading-relaxed text-[var(--color-text-secondary)]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
