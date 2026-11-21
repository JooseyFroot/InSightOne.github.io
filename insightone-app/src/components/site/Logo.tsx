import { Link } from "@tanstack/react-router";

const logoUrl =
  `${import.meta.env.BASE_URL}insightone-logo.png`;

export function LogoMark({
  className = "size-10",
}: {
  className?: string;
}) {
  return (
    <img
      src={logoUrl}
      alt=""
      className={`shrink-0 object-contain ${className}`}
    />
  );
}

export function Logo() {
  return (
    <Link
      to="/"
      aria-label="InsightONE home"
      className="inline-flex h-12 shrink-0 items-center gap-2"
    >
      <img
        src={logoUrl}
        alt=""
        className="h-12 w-12 object-contain"
      />

      <span className="text-lg font-extrabold text-foreground">
        Insight<span className="text-gradient-brand">ONE</span>
      </span>
    </Link>
  );
}
