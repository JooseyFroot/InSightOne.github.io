import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer id="help" className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo />

          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            One question. Unlimited insight. The secure AI assistant
            that knows your company's policies, people and processes.
          </p>

          <p className="mt-4 text-xs text-muted-foreground">
            University group project · InsightONE
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <h2 className="font-semibold">Product</h2>

          <Link
            to="/"
            hash="features"
            className="block text-muted-foreground"
          >
            Features
          </Link>

          <Link
            to="/how-it-works"
            className="block text-muted-foreground"
          >
            How it works
          </Link>

          <Link
            to="/"
            hash="security"
            className="block text-muted-foreground"
          >
            Security
          </Link>
        </div>

        <div className="space-y-3 text-sm">
          <h2 className="font-semibold">Get started</h2>

          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="block text-muted-foreground"
          >
            Create your account
          </Link>

          <Link
            to="/auth"
            search={{ mode: "login" }}
            className="block text-muted-foreground"
          >
            Sign in
          </Link>

          <p className="text-xs text-muted-foreground">
            Demo interface. Authentication and AI services
            are not connected yet.
          </p>
        </div>
      </div>
    </footer>
  );
}