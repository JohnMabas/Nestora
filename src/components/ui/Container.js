/**
 * Container — consistent max-width wrapper.
 */
export default function Container({ children, className = "", as: Tag = "div" }) {
  return (
    <Tag className={["mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8", className].join(" ")}>
      {children}
    </Tag>
  );
}
