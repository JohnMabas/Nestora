/**
 * Badge — small label pill for property types, status, etc.
 */

/**
 * @param {{
 *   children: React.ReactNode,
 *   variant?: 'brand'|'success'|'warning'|'error'|'neutral'|'surface',
 *   className?: string
 * }} props
 */
const variants = {
  brand:   "bg-[var(--color-brand)]/15 text-[var(--color-brand)]       border border-[var(--color-brand)]/25",
  success: "bg-[var(--color-success-soft)] text-[#5fbf6d]              border border-[#3a7d44]/40",
  warning: "bg-[var(--color-warning-soft)] text-[#d4a44a]              border border-[var(--color-warning)]/40",
  error:   "bg-[var(--color-error-soft)]   text-[#d46b6b]              border border-[var(--color-error)]/40",
  neutral: "bg-[var(--color-surface-3)]    text-[var(--color-text-secondary)] border border-[var(--color-border)]",
  surface: "bg-[var(--color-surface-0)]/70 text-[var(--color-text-primary)]   border border-[var(--color-border)] backdrop-blur-sm",
};

export default function Badge({ children, variant = "neutral", className = "" }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium leading-tight",
        variants[variant] ?? variants.neutral,
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
