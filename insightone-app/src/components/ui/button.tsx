import type { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "hero" | "outline" | "navy";
  size?: "default" | "xl";
};

export function Button({
  asChild,
  variant = "hero",
  size = "default",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  const variants = {
    hero:
      "bg-gradient-brand text-primary-foreground shadow-card hover:brightness-105",
    outline:
      "border border-border bg-card text-foreground shadow-card hover:bg-secondary",
    navy:
      "bg-navy text-navy-foreground hover:bg-navy/90",
  };

  return (
    <Component
      {...(!asChild ? { type } : {})}
      className={`
        inline-flex shrink-0 items-center justify-center gap-2
        rounded-xl font-semibold transition
        disabled:cursor-not-allowed disabled:opacity-60
        [&_svg]:size-4
        ${size === "xl"
          ? "px-6 py-3.5 text-sm"
          : "px-4 py-2.5 text-sm"}
        ${variants[variant]}
        ${className}
      `}
      {...props}
    />
  );
}