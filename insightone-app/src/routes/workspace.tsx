import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  createFileRoute,
  Link,
  Navigate,
} from "@tanstack/react-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import {
  BookOpen,
  CheckCircle2,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import {
  samplePolicies,
  searchPolicies,
  visiblePolicies,
} from "@/lib/demo-workflow";
import type {
  DemoRole,
  Policy,
} from "@/lib/demo-workflow";
import { Button } from "@/components/ui/button";

const views = [
  "overview",
  "ask",
  "documents",
  "team",
  "case-study",
] as const;

type View = (typeof views)[number];

export const Route = createFileRoute("/workspace")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { view: View } => ({
    view: views.includes(search.view as View)
      ? (search.view as View)
      : "overview",
  }),
  head: () => ({
    meta: [
      { title: "Company workspace — InsightONE" },
    ],
  }),
  component: WorkspaceGate,
});

const navigation = [
  {
    view: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    view: "ask",
    label: "Ask InsightONE",
    icon: MessageSquare,
  },
  {
    view: "documents",
    label: "Knowledge library",
    icon: FileText,
  },
  {
    view: "team",
    label: "Team & access",
    icon: Users,
  },
  {
    view: "case-study",
    label: "Case study",
    icon: BookOpen,
  },
] satisfies {
  view: View;
  label: string;
  icon: typeof Users;
}[];

const suggestedQuestions = [
  "How many days of annual leave do I get?",
  "What is our hybrid working pattern?",
  "Who approves expense claims above £500?",
  "What should a new starter do in their first week?",
];

const sampleMembers = [
  {
    name: "Alex Morgan",
    email: "alex@example.com",
    role: "HR administrator",
    status: "Sample member",
  },
  {
    name: "Jordan Lee",
    email: "jordan@example.com",
    role: "Employee",
    status: "Sample member",
  },
];

const caseStudySteps: {
  id: string;
  title: string;
  body: string;
  target: View;
  button: string;
}[] = [
  {
    id: "document",
    title: "HR adds company knowledge",
    body:
      "Choose the Company admin perspective. Add a policy titled Learning Budget with this text: Every employee has a £300 annual learning budget. Obtain manager approval before booking training.",
    target: "documents",
    button: "Add the sample policy",
  },
  {
    id: "team",
    title: "HR prepares a colleague invitation",
    body:
      "Add a fictional employee to the team list. The demo records the invitation locally without sending an email or creating an account.",
    target: "team",
    button: "Explore team management",
  },
  {
    id: "ask",
    title: "A new starter finds an answer",
    body:
      "Ask how many annual leave days employees receive, or ask about the learning budget you added. Read the policy excerpt and expand its source information.",
    target: "ask",
    button: "Ask a question",
  },
  {
    id: "access",
    title: "Compare employee and admin experiences",
    body:
      "Choose Employee in the demo perspective selector. The sample admin document disappears and team management is hidden. This illustrates intended behaviour; it is not backend authorisation.",
    target: "documents",
    button: "Compare the library",
  },
];

function WorkspaceGate() {
  const [user, setUser] = useState<
    User | null | undefined
  >(undefined);

  const [error, setError] = useState("");

  useEffect(() => {
    return onAuthStateChanged(
      auth,
      setUser,
      () => {
        setError(
          "Unable to check your session. Refresh the page and try again.",
        );
      },
    );
  }, []);

  if (error) {
    return (
      <main className="p-8">
        <p role="alert">{error}</p>

        <Link
          to="/auth"
          search={{ mode: "login" }}
          className="mt-4 inline-block text-primary underline"
        >
          Return to sign in
        </Link>
      </main>
    );
  }

  if (user === undefined) {
    return (
      <main className="grid min-h-screen place-items-center">
        <p role="status">Opening your workspace…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/auth"
        search={{ mode: "login" }}
        replace
      />
    );
  }

  return <Workspace key={user.uid} user={user} />;
}

function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-border bg-card p-6 shadow-card ${className}`}
    >
      {children}
    </section>
  );
}

function Workspace({ user }: { user: User }) {
  const { view } = Route.useSearch();

  const [role, setRole] = useState<DemoRole>("admin");

  const [policies, setPolicies] =
    useState<Policy[]>(samplePolicies);

  const [members, setMembers] = useState(sampleMembers);

  const [question, setQuestion] = useState("");

  const [answer, setAnswer] = useState<{
    question: string;
    sources: Policy[];
  } | null>(null);

  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const [access, setAccess] = useState<
    "everyone" | "admin"
  >("everyone");

  const [notice, setNotice] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const allowedPolicies = visiblePolicies(policies, role);
  const isAdmin = role === "admin";

  const name =
    user.displayName ||
    user.email?.split("@")[0] ||
    "colleague";

  function markCompleted(step: string) {
    setCompleted((previous) =>
      previous.includes(step)
        ? previous
        : [...previous, step],
    );
  }

  function ask(value: string) {
    const trimmedQuestion = value.trim();

    if (!trimmedQuestion) return;

    setQuestion(value);

    setAnswer({
      question: trimmedQuestion,
      sources: searchPolicies(
        policies,
        role,
        trimmedQuestion,
      ),
    });

    setQuestionsAsked((previous) => previous + 1);
    markCompleted("ask");
  }

  function switchRole(value: DemoRole) {
    setRole(value);
    setAnswer(null);
    setNotice("");

    if (value === "employee") {
      markCompleted("access");
    }
  }

  function addPolicy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAdmin) return;

    const cleanTitle = title.trim();
    const cleanText = text.trim();

    if (
      cleanTitle.length < 3 ||
      cleanTitle.length > 120 ||
      cleanText.length < 20 ||
      cleanText.length > 100000
    ) {
      setNotice(
        "Use a title of 3–120 characters and policy text of 20–100,000 characters.",
      );
      return;
    }

    setPolicies((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        title: cleanTitle,
        text: cleanText,
        topic: cleanTitle,
        access,
      },
    ]);

    setTitle("");
    setText("");

    setNotice(
      "Policy added to this demo session. You can now search its text.",
    );

    markCompleted("document");
  }

  function invite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAdmin) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    const email = String(data.get("email") ?? "")
      .trim()
      .toLowerCase();

    const memberName = String(
      data.get("name") ?? "",
    ).trim();

    if (
      memberName.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setNotice("Enter a valid name and email address.");
      return;
    }

    if (
      members.some(
        (member) =>
          member.email.toLowerCase() === email,
      )
    ) {
      setNotice("That email is already in the demo team.");
      return;
    }

    setMembers((previous) => [
      ...previous,
      {
        name: memberName,
        email,
        role: "Employee",
        status: "Demo invite — not sent",
      },
    ]);

    form.reset();

    setNotice(
      "Demo invitation recorded. No email was sent and no Firebase account was created.",
    );

    markCompleted("team");
  }

  async function logout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setNotice("");

    try {
      await signOut(auth);
    } catch {
      setNotice("Unable to sign out. Please try again.");
      setLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="flex flex-col bg-navy p-5 text-white lg:sticky lg:top-0 lg:h-screen">
        <Link
          to="/"
          className="flex items-center gap-3 text-xl font-extrabold"
        >
          <img
  src={`${import.meta.env.BASE_URL}insightone-logo.png`}
  alt="InsightONE"
  className="h-14 w-14 shrink-0 rounded-lg bg-white object-contain p-1"
/>
        </Link>

        <div className="mt-6 border-t border-white/15 pt-5">
          <p className="text-sm font-semibold">
            Northbridge Group
          </p>

          <p className="mt-1 text-sm text-white/65">
            Fictional company workspace
          </p>
        </div>

        <nav
          aria-label="Workspace navigation"
          className="mt-6 flex gap-2 overflow-x-auto pb-2 lg:flex-col"
        >
          {navigation.map((item) => (
            <Link
              key={item.view}
              to="/workspace"
              search={{ view: item.view }}
              onClick={() => setNotice("")}
              aria-current={
                view === item.view ? "page" : undefined
              }
              className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                view === item.view
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10"
              }`}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 border-t border-white/15 pt-5 lg:mt-auto">
          <p className="truncate text-sm font-semibold">
            {name}
          </p>

          <p className="mt-1 truncate text-sm text-white/65">
            {user.email}
          </p>

          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="mt-4 flex items-center gap-2 rounded-lg text-sm text-white/80 disabled:opacity-50"
          >
            <LogOut className="size-4" />

            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>

      <main className="min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-5 py-5 md:px-8">
          <div>
            <p className="text-sm text-muted-foreground">
              Company workspace
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              {
                navigation.find(
                  (item) => item.view === view,
                )?.label
              }
            </h1>
          </div>

          <label className="text-sm font-medium">
            Demo perspective

            <select
              value={role}
              onChange={(event) =>
                switchRole(
                  event.target.value as DemoRole,
                )
              }
              className="ml-3 rounded-xl border border-border bg-background px-3 py-2"
            >
              <option value="admin">
                Company admin
              </option>

              <option value="employee">
                Employee
              </option>
            </select>
          </label>
        </header>

        <div className="mx-auto max-w-6xl space-y-6 p-5 md:p-8">
          <div className="rounded-xl border border-primary/20 bg-secondary p-4 text-sm leading-relaxed">
            <strong>Interactive case-study demo.</strong>{" "}
            Sign-in is real. Policies, team actions and role
            perspectives are simulated and reset on refresh.
            Search matches local policy text; no AI model or
            real company data is connected.
          </div>

          {notice && (
            <p
              role="status"
              className="rounded-xl border border-border bg-card p-4 text-sm"
            >
              {notice}
            </p>
          )}

          {/* OVERVIEW */}
          {view === "overview" && (
            <>
              <section className="rounded-3xl bg-gradient-brand p-7 text-white md:p-10">
                <p className="text-sm font-semibold">
                  Welcome, {name}
                </p>

                <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
                  Your team's knowledge,
                  <br />
                  in one place.
                </h2>

                <p className="mt-4 max-w-xl text-white/90">
                  Follow a fictional 120-person company's
                  journey from scattered HR documents to
                  clear, source-backed answers.
                </p>

                <Button
                  asChild
                  variant="navy"
                  className="mt-6"
                >
                  <Link
                    to="/workspace"
                    search={{ view: "case-study" }}
                  >
                    Explore the case study
                  </Link>
                </Button>
              </section>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  [
                    "Visible policies",
                    allowedPolicies.length,
                  ],
                  [
                    "Questions this session",
                    questionsAsked,
                  ],
                  [
                    "Case-study steps",
                    `${completed.length}/4`,
                  ],
                ].map(([label, value]) => (
                  <Card key={String(label)}>
                    <p className="text-sm text-muted-foreground">
                      {label}
                    </p>

                    <p className="mt-3 text-3xl font-bold">
                      {value}
                    </p>
                  </Card>
                ))}
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Card>
                  <MessageSquare className="size-6 text-primary" />

                  <h2 className="mt-4 text-xl font-bold">
                    Ask a policy question
                  </h2>

                  <p className="mt-3 text-muted-foreground">
                    Try leave, expenses, hybrid working or
                    onboarding. Open the source to check
                    the answer.
                  </p>

                  <Button
                    asChild
                    variant="outline"
                    className="mt-5"
                  >
                    <Link
                      to="/workspace"
                      search={{ view: "ask" }}
                    >
                      Open knowledge search
                    </Link>
                  </Button>
                </Card>

                <Card>
                  <FileText className="size-6 text-primary" />

                  <h2 className="mt-4 text-xl font-bold">
                    Build your knowledge library
                  </h2>

                  <p className="mt-3 text-muted-foreground">
                    Explore sample policies or add a short
                    policy to search during this session.
                  </p>

                  <Button
                    asChild
                    variant="outline"
                    className="mt-5"
                  >
                    <Link
                      to="/workspace"
                      search={{ view: "documents" }}
                    >
                      Browse documents
                    </Link>
                  </Button>
                </Card>
              </div>
            </>
          )}

          {/* KNOWLEDGE SEARCH */}
          {view === "ask" && (
            <>
              <Card>
                <h2 className="text-xl font-bold">
                  What would you like to know?
                </h2>

                <p className="mt-2 text-muted-foreground">
                  This prototype returns matching policy
                  excerpts with sources, rather than
                  generating an AI response.
                </p>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    ask(question);
                  }}
                  className="mt-6 flex flex-col gap-3 sm:flex-row"
                >
                  <label
                    htmlFor="question"
                    className="sr-only"
                  >
                    Your policy question
                  </label>

                  <input
                    id="question"
                    value={question}
                    onChange={(event) =>
                      setQuestion(event.target.value)
                    }
                    maxLength={500}
                    required
                    placeholder="Ask about leave, expenses or onboarding…"
                    className="form-input mt-0 min-w-0 flex-1"
                  />

                  <Button type="submit">
                    <Search className="size-4" />
                    Search policies
                  </Button>
                </form>

                <div className="mt-5 flex flex-wrap gap-2">
                  {suggestedQuestions.map((value) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => ask(value)}
                      className="rounded-full border border-border px-3 py-2 text-left text-sm hover:bg-secondary"
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </Card>

              {answer && (
                <Card>
                  <p className="text-sm font-semibold text-primary">
                    Policy search result
                  </p>

                  <h2 className="mt-3 text-xl font-bold">
                    {answer.question}
                  </h2>

                  <div
                    aria-live="polite"
                    className="mt-5 space-y-4"
                  >
                    {answer.sources.length ? (
                      answer.sources.map((source) => (
                        <article
                          key={source.id}
                          className="rounded-xl border border-border bg-background p-5"
                        >
                          <h3 className="font-bold">
                            {source.title}
                          </h3>

                          <blockquote className="mt-3 leading-relaxed">
                            {source.text}
                          </blockquote>

                          <details className="mt-4 text-sm">
                            <summary className="cursor-pointer font-semibold text-primary">
                              View source information
                            </summary>

                            <p className="mt-2 text-muted-foreground">
                              Source: {source.title} ·
                              Northbridge Group fictional
                              demo library · Audience:{" "}
                              {source.access === "everyone"
                                ? "All employees"
                                : "Admin perspective only"}
                            </p>
                          </details>
                        </article>
                      ))
                    ) : (
                      <p>
                        No matching policy was found in your
                        current demo perspective. Try another
                        topic or add an appropriate document.
                        This demo does not invent an answer.
                      </p>
                    )}
                  </div>
                </Card>
              )}
            </>
          )}

          {/* DOCUMENT LIBRARY */}
          {view === "documents" && (
            <>
              <Card>
                <h2 className="text-xl font-bold">
                  Company knowledge library
                </h2>

                <p className="mt-2 text-muted-foreground">
                  {allowedPolicies.length} documents visible
                  in this demo perspective. Only use
                  fictional or non-sensitive text.
                </p>

                <div className="mt-6 space-y-3">
                  {allowedPolicies.map((policy) => (
                    <article
                      key={policy.id}
                      className="rounded-xl border border-border p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-semibold">
                          {policy.title}
                        </h3>

                        <span className="rounded-full bg-secondary px-3 py-1 text-sm">
                          {policy.access === "everyone"
                            ? "All employees"
                            : "Admin demo"}
                        </span>
                      </div>

                      <details className="mt-3 text-sm">
                        <summary className="cursor-pointer text-primary">
                          Read document
                        </summary>

                        <p className="mt-3 leading-relaxed text-muted-foreground">
                          {policy.text}
                        </p>
                      </details>

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            setPolicies((previous) =>
                              previous.filter(
                                (item) =>
                                  item.id !== policy.id,
                              ),
                            );

                            setAnswer(null);
                          }}
                          className="mt-3 text-sm text-red-700"
                        >
                          Remove from demo
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              </Card>

              {isAdmin && (
                <Card>
                  <h2 className="text-xl font-bold">
                    Add a policy to the demo
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Paste a short policy below. Nothing is
                    uploaded to a server.
                  </p>

                  <form
                    onSubmit={addPolicy}
                    className="mt-5 space-y-4"
                  >
                    <div>
                      <label
                        htmlFor="policy-title"
                        className="text-sm font-semibold"
                      >
                        Document title
                      </label>

                      <input
                        id="policy-title"
                        value={title}
                        onChange={(event) =>
                          setTitle(event.target.value)
                        }
                        required
                        minLength={3}
                        maxLength={120}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="policy-text"
                        className="text-sm font-semibold"
                      >
                        Policy text
                      </label>

                      <textarea
                        id="policy-text"
                        value={text}
                        onChange={(event) =>
                          setText(event.target.value)
                        }
                        required
                        minLength={20}
                        maxLength={100000}
                        rows={5}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="policy-access"
                        className="text-sm font-semibold"
                      >
                        Demo audience
                      </label>

                      <select
                        id="policy-access"
                        value={access}
                        onChange={(event) =>
                          setAccess(
                            event.target.value as
                              | "everyone"
                              | "admin",
                          )
                        }
                        className="form-input"
                      >
                        <option value="everyone">
                          All employees
                        </option>

                        <option value="admin">
                          Admin perspective only
                        </option>
                      </select>
                    </div>

                    <Button type="submit">
                      Add policy
                    </Button>
                  </form>
                </Card>
              )}
            </>
          )}

          {/* TEAM MANAGEMENT */}
          {view === "team" &&
            (isAdmin ? (
              <>
                <Card>
                  <h2 className="text-xl font-bold">
                    Team & access demonstration
                  </h2>

                  <p className="mt-2 text-muted-foreground">
                    These are fictional members. Changes
                    here do not create accounts or grant
                    real permissions.
                  </p>

                  <div className="mt-6 space-y-4">
                    {members.map((member) => (
                      <div
                        key={member.email}
                        className="flex flex-wrap justify-between gap-3 rounded-xl border border-border p-4"
                      >
                        <div>
                          <p className="font-semibold">
                            {member.name}
                          </p>

                          <p className="break-all text-sm text-muted-foreground">
                            {member.email}
                          </p>
                        </div>

                        <div className="text-sm">
                          <p>{member.role}</p>

                          <p className="mt-1 text-muted-foreground">
                            {member.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h2 className="text-xl font-bold">
                    Demonstrate inviting a colleague
                  </h2>

                  <form
                    onSubmit={invite}
                    className="mt-5 space-y-4"
                  >
                    <div>
                      <label
                        htmlFor="member-name"
                        className="text-sm font-semibold"
                      >
                        Name
                      </label>

                      <input
                        id="member-name"
                        name="name"
                        required
                        minLength={2}
                        maxLength={100}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="member-email"
                        className="text-sm font-semibold"
                      >
                        Email
                      </label>

                      <input
                        id="member-email"
                        name="email"
                        type="email"
                        required
                        maxLength={254}
                        className="form-input"
                      />
                    </div>

                    <Button type="submit">
                      Add demo invitation
                    </Button>

                    <p className="text-sm text-muted-foreground">
                      No invitation email will be sent.
                    </p>
                  </form>
                </Card>
              </>
            ) : (
              <Card>
                <ShieldCheck className="size-8 text-primary" />

                <h2 className="mt-4 text-xl font-bold">
                  Administrator view
                </h2>

                <p className="mt-3 text-muted-foreground">
                  The employee perspective does not show
                  team management. Use the demo perspective
                  selector to explore the admin workflow.
                  Real permissions must be enforced by
                  backend rules.
                </p>
              </Card>
            ))}

          {/* GUIDED CASE STUDY */}
          {view === "case-study" && (
            <>
              <Card>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                  Fictional company case study
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  Northbridge Group: a new starter's
                  first week
                </h2>

                <p className="mt-4 leading-relaxed text-muted-foreground">
                  A 120-person professional services company
                  keeps HR policies in scattered folders.
                  New starter Jordan needs to understand
                  leave and hybrid working. Alex in HR needs
                  one place to maintain answers and
                  demonstrate appropriate access.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-background p-4">
                    <h3 className="font-bold">
                      Before
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Repeated HR emails, hard-to-find
                      policies and uncertainty about which
                      version to trust.
                    </p>
                  </div>

                  <div className="rounded-xl bg-secondary p-4">
                    <h3 className="font-bold">
                      Target workflow
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Maintain documents centrally, let
                      staff find source-backed answers, and
                      enforce access in the production
                      backend.
                    </p>
                  </div>
                </div>
              </Card>

              {caseStudySteps.map((step) => (
                <Card key={step.id}>
                  <div className="flex items-start gap-4">
                    <CheckCircle2
                      className={`mt-1 size-6 shrink-0 ${
                        completed.includes(step.id)
                          ? "text-green-700"
                          : "text-muted-foreground"
                      }`}
                    />

                    <div>
                      <p className="text-sm font-medium text-primary">
                        {completed.includes(step.id)
                          ? "Explored this session"
                          : "Try this workflow"}
                      </p>

                      <h3 className="mt-1 text-xl font-bold">
                        {step.title}
                      </h3>

                      <p className="mt-3 leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>

                      <Button
                        asChild
                        variant="outline"
                        className="mt-4"
                      >
                        <Link
                          to="/workspace"
                          search={{ view: step.target }}
                        >
                          {step.button}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              <Card>
                <h2 className="text-xl font-bold">
                  Evidence for your report
                </h2>

                <p className="mt-3 text-muted-foreground">
                  Capture the dashboard, a policy addition,
                  a search result with its source, and the
                  employee perspective. Describe usability
                  and workflow observations. Time savings,
                  AI accuracy and security effectiveness
                  have not been measured by this demo.
                </p>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
