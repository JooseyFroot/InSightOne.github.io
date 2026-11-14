import { BrainCircuit } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function LogoMark({
  className = "size-9",
}: {
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`
        inline-grid shrink-0 place-items-center rounded-full
        bg-gradient-brand p-1.5 text-white shadow-card
        ${className}
      `}
    >
      <BrainCircuit className="size-full" />
    </span>
  );
}

export function Logo() {
  return (
    <Link
      to="/"
      aria-label="InsightONE home"
      className="inline-flex items-center gap-2 font-display text-lg font-extrabold"
    >
      <LogoMark />
      <span>
        Insight<span className="text-gradient-brand">ONE</span>
      </span>
    </Link>
  );
}