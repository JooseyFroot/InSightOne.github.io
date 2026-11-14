import { useState } from "react";
import type { FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/auth")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { mode: "login" | "signup" } => ({
    mode: search.mode === "signup" ? "signup" : "login",
  }),
  head: () => ({
    meta: [
      { title: "Sign in or create an account — InsightONE" },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "signup";
type FieldName = "name" | "email" | "password" | "confirm";

function AuthPage() {
  const { mode } = Route.useSearch();

  return <AuthForm key={mode} mode={mode} />;
}

function AuthForm({ mode }: { mode: Mode }) {
  const signup = mode === "signup";

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<FieldName, string>>
  >({});
  const [notice, setNotice] = useState("");

  const fields: {
    name: FieldName;
    label: string;
    type: string;
    autoComplete: string;
    placeholder?: string;
  }[] = [
    ...(signup
      ? [
          {
            name: "name" as const,
            label: "Full name",
            type: "text",
            autoComplete: "name",
            placeholder: "Your full name",
          },
        ]
      : []),
    {
      name: "email",
      label: "Work email",
      type: "email",
      autoComplete: "email",
      placeholder: "you@organisation.com",
    },
    {
      name: "password",
      label: "Password",
      type: showPassword ? "text" : "password",
      autoComplete: signup ? "new-password" : "current-password",
    },
    ...(signup
      ? [
          {
            name: "confirm" as const,
            label: "Confirm password",
            type: showPassword ? "text" : "password",
            autoComplete: "new-password",
          },
        ]
      : []),
  ];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const confirm = String(data.get("confirm") ?? "");

    const next: Partial<Record<FieldName, string>> = {};

    if (signup && name.length < 2) {
      next.name = "Enter your full name (at least 2 characters).";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address.";
    }

    if (!password) {
      next.password = "Enter your password.";
    } else if (signup && password.length < 8) {
      next.password = "Use at least 8 characters.";
    }

    if (signup && confirm !== password) {
      next.confirm = "Your passwords do not match.";
    }

    setErrors(next);
    setNotice("");

    const firstError = Object.keys(next)[0];

    if (firstError) {
      (
        form.elements.namedItem(firstError) as
          | HTMLInputElement
          | null
      )?.focus();

      return;
    }

    setNotice(
      "Your form is valid. Firebase is not connected yet, so no account has been created and you have not been signed in.",
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="relative flex-1 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-hero"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <section>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to home
            </Link>

            <p className="mt-10 text-sm font-semibold uppercase tracking-widest text-primary">
              Your knowledge. Connected.
            </p>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
              One account.
              <br />
              <span className="text-gradient-brand">
                Unlimited insight.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Bring your organisation's knowledge together, so
              the answers your team needs are always within reach.
            </p>

            <div className="mt-8 flex items-center gap-3 text-sm">
              <ShieldCheck className="size-5 text-primary" />
              Built for a secure, role-based workspace
            </div>
          </section>

          <section
            aria-labelledby="auth-title"
            className="w-full max-w-lg justify-self-center rounded-3xl border border-border bg-card p-6 shadow-glow sm:p-9"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
              <LockKeyhole className="size-6" />
            </span>

            <h2
              id="auth-title"
              className="mt-5 text-2xl font-bold"
            >
              {signup ? "Create your account" : "Welcome back"}
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {signup
                ? "Start bringing your team's knowledge together."
                : "Sign in to your InsightONE workspace."}
            </p>

            <nav
              aria-label="Authentication mode"
              className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1"
            >
              {(["login", "signup"] as const).map((value) => (
                <Link
                  key={value}
                  to="/auth"
                  search={{ mode: value }}
                  aria-current={mode === value ? "page" : undefined}
                  className={`rounded-lg px-4 py-2 text-center text-sm font-semibold ${
                    mode === value
                      ? "bg-card text-foreground shadow-card"
                      : "text-muted-foreground"
                  }`}
                >
                  {value === "login" ? "Sign in" : "Sign up"}
                </Link>
              ))}
            </nav>

            <form
              onSubmit={submit}
              noValidate
              className="mt-6 space-y-5"
            >
              {fields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="text-sm font-semibold"
                  >
                    {field.label}
                  </label>

                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    placeholder={field.placeholder}
                    required
                    maxLength={
                      field.name === "name"
                        ? 100
                        : field.name === "email"
                          ? 254
                          : undefined
                    }
                    className="form-input"
                    aria-invalid={!!errors[field.name]}
                    aria-describedby={
                      errors[field.name]
                        ? `${field.name}-error`
                        : field.name === "password" && signup
                          ? "password-hint"
                          : undefined
                    }
                  />

                  {field.name === "password" && signup && (
                    <p
                      id="password-hint"
                      className="mt-2 text-xs text-muted-foreground"
                    >
                      Use at least 8 characters.
                    </p>
                  )}

                  {errors[field.name] && (
                    <p
                      id={`${field.name}-error`}
                      className="mt-2 text-sm text-red-700"
                    >
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(event) =>
                    setShowPassword(event.target.checked)
                  }
                  className="size-4 accent-primary"
                />
                Show password{signup ? "s" : ""}
              </label>

              <Button
                type="submit"
                size="xl"
                className="w-full"
              >
                {signup ? "Create account" : "Sign in"}
                <ArrowRight />
              </Button>

              {notice && (
                <p
                  role="status"
                  className="rounded-xl border border-border bg-secondary p-4 text-sm"
                >
                  {notice}
                </p>
              )}

              <p className="text-center text-xs text-muted-foreground">
                Frontend preview · Firebase authentication
                is not connected yet.
              </p>
            </form>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
