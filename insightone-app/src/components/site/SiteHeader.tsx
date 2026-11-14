import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="relative z-10 border-b border-border bg-card/95">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Logo />

        <nav
          aria-label="Main navigation"
          className="order-3 flex w-full justify-center gap-6 text-xs text-muted-foreground sm:order-none sm:w-auto"
        >
          <Link to="/" hash="features" className="hover:text-primary">
            Features
          </Link>

          <Link to="/how-it-works" className="hover:text-primary">
            How it works
          </Link>

          <Link to="/" hash="security" className="hover:text-primary">
            Security
          </Link>

          <Link to="/" hash="help" className="hover:text-primary">
            Help
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/auth"
            search={{ mode: "login" }}
            className="text-sm hover:text-primary"
          >
            Sign in
          </Link>

          <Button asChild>
            <Link to="/auth" search={{ mode: "signup" }}>
              Get started
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}