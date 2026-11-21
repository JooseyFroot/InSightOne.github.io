import { useState } from "react";
import type { FormEvent } from "react";
import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { auth } from "@/lib/firebase";
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
      {
        title: "Sign in or create an account — InsightONE",
      },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "signup";
type FieldName = "name" | "email" | "password" | "confirm";

type FormField = {
  name: FieldName;
  label: string;
  type: string;
  autoComplete: string;
  placeholder?: string;
};

function AuthPage() {
  const { mode } = Route.useSearch();

  return <AuthForm key={mode} mode={mode} />;
}

function AuthForm({ mode }: { mode: Mode }) {
  const signup = mode === "signup";

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<FieldName, string>>
  >({});
  const [notice, setNotice] = useState("");
  const [noticeIsError, setNoticeIsError] = useState(false);

  const fields: FormField[] = [];

  if (signup) {
    fields.push({
      name: "name",
      label: "Full name",
      type: "text",
      autoComplete: "name",
      placeholder: "Your full name",
    });
  }

  fields.push(
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
  );

  if (signup) {
    fields.push({
      name: "confirm",
      label: "Confirm password",
      type: showPassword ? "text" : "password",
      autoComplete: "new-password",
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const confirm = String(data.get("confirm") ?? "");

    const next: Partial<Record<FieldName, string>> = {};

    if (signup && (name.length < 2 || name.length > 100)) {
      next.name = "Enter your full name using 2–100 characters.";
    }

    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
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
    setNoticeIsError(false);

    const firstError = Object.keys(next)[0];

    if (firstError) {
      (
        form.elements.namedItem(firstError) as
          | HTMLInputElement
          | null
      )?.focus();

      return;
    }

    setPending(true);

    try {
      if (signup) {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        // Firebase signs the user in after creating the account.
        // Saving their display name is a separate operation.
        try {
          await updateProfile(credential.user, {
            displayName: name,
          });

          setNotice(
            "Your account has been created. You are signed in.",
          );
        } catch {
          setNotice(
            "Your account has been created and you are signed in, but your display name could not be saved.",
          );
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);

        setNotice("You have signed in successfully.");
      }

      form.reset();
      await navigate({
  to: "/workspace",
  search: { view: "overview" },
});
      setShowPassword(false);
    } catch (error) {
      let message = "Something went wrong. Please try again.";

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            message =
              "Unable to create this account. Try signing in if you already have one.";
            break;

          case "auth/invalid-email":
            message = "Enter a valid email address.";
            break;

          case "auth/weak-password":
          case "auth/password-does-not-meet-requirements":
            message =
              "Your password does not meet the required password policy.";
            break;

          case "auth/invalid-credential":
          case "auth/user-not-found":
          case "auth/wrong-password":
          case "auth/user-disabled":
            message =
              "Unable to sign in. Check your details or contact your administrator.";
            break;

          case "auth/too-many-requests":
            message =
              "Too many attempts. Please wait and try again.";
            break;

          case "auth/network-request-failed":
            message =
              "Check your internet connection and try again.";
            break;

          case "auth/operation-not-allowed":
            message =
              "Email/password sign-in is not enabled in Firebase yet.";
            break;

          case "auth/invalid-api-key":
          case "auth/app-not-authorized":
            message =
              "Firebase configuration needs checking. Please contact the project administrator.";
            break;
        }
      }

      setNoticeIsError(true);
      setNotice(message);
    } finally {
      setPending(false);
    }
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
              <ShieldCheck className="size-5 shrink-0 text-primary" />
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
                  aria-current={
                    mode === value ? "page" : undefined
                  }
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
              aria-busy={pending}
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
                    disabled={pending}
                    maxLength={
                      field.name === "name"
                        ? 100
                        : field.name === "email"
                          ? 254
                          : undefined
                    }
                    className="form-input disabled:opacity-60"
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
                  disabled={pending}
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
                disabled={pending}
              >
                {pending
                  ? "Please wait…"
                  : signup
                    ? "Create account"
                    : "Sign in"}

                {!pending && <ArrowRight />}
              </Button>

              {notice && (
                <p
                  role={noticeIsError ? "alert" : "status"}
                  className={`rounded-xl border p-4 text-sm ${
                    noticeIsError
                      ? "border-red-200 bg-red-50 text-red-800"
                      : "border-border bg-secondary text-foreground"
                  }`}
                >
                  {notice}
                </p>
              )}
            </form>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
