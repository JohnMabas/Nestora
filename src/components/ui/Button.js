"use client";

/**
 * Button — primary interactive element.
 * Variants: primary (gold fill), secondary (ghost), outline, ghost-white
 * Sizes: sm, md, lg
 */

/**
 * @param {{
 *   children: React.ReactNode,
 *   variant?: 'primary'|'secondary'|'outline'|'ghost',
 *   size?: 'sm'|'md'|'lg',
 *   href?: string,
 *   className?: string,
 *   disabled?: boolean,
 *   type?: 'button'|'submit'|'reset',
 *   onClick?: () => void,
 *   [key: string]: any
 * }} props
 */
import Link from "next/link";

const variants = {
  primary:
    "bg-[var(--color-brand)] text-[var(--color-text-inverse)] hover:bg-[var(--color-brand-light)] active:bg-[var(--color-brand-dark)]",
  secondary:
    "bg-[var(--color-surface-3)] text-[var(--color-text-primary)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-4)] hover:border-[var(--color-brand)]",
  outline:
    "bg-transparent text-[var(--color-brand)] border border-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-[var(--color-text-inverse)]",
  ghost:
    "bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)]",
};

const sizes = {
  sm:  "h-8  px-4  text-sm   rounded-[var(--radius-sm)]  gap-1.5",
  md:  "h-11 px-5  text-sm   rounded-[var(--radius-md)]  gap-2",
  lg:  "h-13 px-7  text-base rounded-[var(--radius-lg)]  gap-2.5",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  disabled = false,
  type = "button",
  onClick,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)] disabled:opacity-40 disabled:cursor-not-allowed shrink-0";

  const classes = [base, variants[variant] ?? variants.primary, sizes[size] ?? sizes.md, className]
    .join(" ")
    .trim();

  if (href && !disabled) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
