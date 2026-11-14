import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpenCheck,
  FileLock2,
  FileSearch,
  MessagesSquare,
  Quote,
  ShieldCheck,
  UploadCloud,
  UserCog,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { LogoMark } from "@/components/site/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "InsightONE — Your company's own secure AI assistant",
      },
      {
        name: "description",
        content:
          "Ask about policies, HR, benefits and internal processes. Instant, cited answers from your organisation's documents.",
      },
    ],
  }),
  component: Landing,
});

const QUESTIONS = [
  "How many days of annual leave do I get?",
  "Who approves expense claims over £500?",
  "What's our hybrid working policy?",
  "How do I enrol in the pension scheme?",
];

const FEATURES = [
  {
    icon: MessagesSquare,
    title: "Ask like you'd ask a colleague",
    body:
      "Natural conversation, follow-up questions and saved chats. No portals, folders or keyword guessing.",
  },
  {
    icon: BookOpenCheck,
    title: "Every answer shows its source",
    body:
      "InsightONE cites the exact policy or document it used, so people can trust — and check — what they read.",
  },
  {
    icon: FileSearch,
    title: "Understands meaning, not just words",
    body:
      'Search by intent. "Time off when my child is ill" finds the dependant leave policy, even without matching words.',
  },
  {
    icon: UploadCloud,
    title: "Upload once, answer forever",
    body:
      "Admins add PDFs, Word files or text. InsightONE reads, indexes and starts answering within seconds.",
  },
  {
    icon: FileLock2,
    title: "Role-based access",
    body:
      "Mark sensitive HR records as admin-only. Employees never see — and the AI never quotes — what they can't access.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body:
      "Your documents stay in your workspace and aren't used to train public models. Every conversation is private to its owner.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Create your workspace",
    body:
      "Set up your organisation and invite colleagues with their work email.",
  },
  {
    number: "02",
    title: "Add your knowledge",
    body:
      "Upload handbooks, policies and HR guides. Mark sensitive records admin-only.",
  },
  {
    number: "03",
    title: "Everyone just asks",
    body:
      "Staff get instant, cited answers 24/7. HR gets fewer repetitive questions.",
  },
];

const AUDIENCES = [
  {
    icon: Users,
    title: "Employees",
    body:
      "Self-serve answers about leave, benefits, payroll dates and how things work — without waiting on an email.",
  },
  {
    icon: UserCog,
    title: "HR & People teams",
    body:
      "Stop answering the same twenty questions. Keep one source of truth that's always up to date.",
  },
  {
    icon: BookOpenCheck,
    title: "Managers & new starters",
    body:
      "Onboard faster with a guide that knows every process, form and contact from day one.",
  },
];

function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-hero"
            aria-hidden="true"
          />

          <div
            className="absolute inset-0 bg-grid opacity-70 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
            aria-hidden="true"
          />

          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-16 md:pt-24 lg:grid-cols-[1.1fr_1fr]">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-semibold text-primary shadow-card">
                <span className="size-1.5 rounded-full bg-gradient-brand" />
                AI for a brighter workforce
              </span>

              <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] md:text-6xl">
                One question.
                <br />
                <span className="text-gradient-brand">
                  Unlimited insight.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                InsightONE is your company's own ChatGPT. Employees
                ask about policies, HR, benefits and processes — and
                get instant, cited answers drawn only from your
                organisation's documents.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="hero" size="xl">
                  <Link to="/auth" search={{ mode: "signup" }}>
                    Start your workspace
                    <ArrowRight />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="xl">
                  <Link to="/how-it-works">
                    See how it works
                  </Link>
                </Button>
              </div>

              <p className="mt-5 text-sm text-muted-foreground">
                One place for your organisation's knowledge.
              </p>
            </div>

            {/* Product preview */}
            <div className="relative animate-fade-up [animation-delay:150ms]">
              <div
                className="absolute -right-6 -top-8 size-24 animate-float rounded-full bg-cyan/40 blur-2xl"
                aria-hidden="true"
              />

              <div
                className="absolute -bottom-10 -left-6 size-28 animate-float rounded-full bg-violet/30 blur-2xl [animation-delay:2s]"
                aria-hidden="true"
              />

              <div className="relative rounded-3xl border border-border bg-card p-5 shadow-glow">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <LogoMark className="size-10" />

                  <div>
                    <p className="font-display text-sm font-semibold">
                      InsightONE
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Searching 248 company documents
                    </p>
                  </div>
                </div>

                <div className="space-y-4 py-5 text-sm">
                  <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-chat-user px-4 py-3 text-chat-user-foreground">
                    How much parental leave can I take, and is it paid?
                  </div>

                  <div className="space-y-2 text-foreground">
                    <p>
                      You're entitled to{" "}
                      <strong>26 weeks of parental leave</strong>.
                      The first <strong>16 weeks are fully paid</strong>,
                      then statutory pay applies for the remaining 10.
                    </p>

                    <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                      <li>
                        Tell HR at least 15 weeks before your due date
                      </li>
                      <li>
                        You can split leave into up to three blocks
                      </li>
                    </ul>

                    <p className="pt-1 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Sources:
                      </span>{" "}
                      Family Leave Policy 2026 · Employee Handbook
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
                  Ask about policies, people or processes…
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </div>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Illustrative example
              </p>
            </div>
          </div>
        </section>

        {/* Example questions */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-5 py-8">
            <span className="text-sm font-semibold text-muted-foreground">
              People ask things like
            </span>

            {QUESTIONS.map((question) => (
              <span
                key={question}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm"
              >
                “{question}”
              </span>
            ))}
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="mx-auto max-w-6xl px-5 py-24"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Why InsightONE
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              Company knowledge, finally easy to find
            </h2>

            <p className="mt-4 text-lg text-muted-foreground">
              Most answers already exist — buried in handbooks,
              shared drives and inboxes. InsightONE brings them
              to the surface in seconds.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                id={
                  feature.title === "Private by design"
                    ? "security"
                    : undefined
                }
                className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-transform hover:-translate-y-1"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-gradient-brand group-hover:text-primary-foreground">
                  <feature.icon className="size-5" />
                </span>

                <h3 className="mt-5 text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section
          id="how-it-works"
          className="bg-gradient-navy text-navy-foreground"
        >
          <div className="mx-auto max-w-6xl px-5 py-24">
            <h2 className="max-w-xl text-4xl font-bold">
              Live in an afternoon
            </h2>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {STEPS.map((step) => (
                <div
                  key={step.number}
                  className="rounded-2xl border border-navy-foreground/15 bg-navy-foreground/5 p-6"
                >
                  <span className="font-display text-3xl font-bold text-cyan">
                    {step.number}
                  </span>

                  <h3 className="mt-4 text-xl font-semibold">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm text-navy-foreground/75">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Audiences */}
        <section className="mx-auto max-w-6xl px-5 py-24">
          <h2 className="text-center text-4xl font-bold">
            Built for the whole organisation
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {AUDIENCES.map((audience) => (
              <div
                key={audience.title}
                className="rounded-2xl border border-border p-6"
              >
                <audience.icon className="size-6 text-primary" />

                <h3 className="mt-4 text-lg font-semibold">
                  {audience.title}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {audience.body}
                </p>
              </div>
            ))}
          </div>

          <figure className="mx-auto mt-16 max-w-3xl rounded-3xl border border-border bg-card p-8 text-center shadow-card">
            <Quote className="mx-auto size-8 text-cyan" />

            <blockquote className="mt-4 font-display text-xl font-medium leading-relaxed">
              “The goal is simple: nobody should spend twenty
              minutes hunting for a policy that answers a
              two-second question.”
            </blockquote>

            <figcaption className="mt-4 text-sm text-muted-foreground">
              The idea behind InsightONE
            </figcaption>
          </figure>
        </section>

        {/* Call to action */}
        <section className="mx-auto max-w-6xl px-5 pb-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-10 text-primary-foreground md:p-14">
            <div
              className="absolute inset-0 bg-grid opacity-20"
              aria-hidden="true"
            />

            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="text-3xl font-bold md:text-4xl">
                  Give every employee instant answers
                </h2>

                <p className="mt-2 max-w-xl text-primary-foreground/85">
                  Set up your secure workspace and bring your
                  organisation's knowledge together.
                </p>
              </div>

              <Button asChild size="xl" variant="navy">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Get started
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
