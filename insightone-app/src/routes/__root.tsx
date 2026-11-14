import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
} from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  return (
    <>
      <HeadContent />
      <Outlet />
    </>
  );
}

function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-5 py-24">
      <h1 className="text-3xl font-bold">Page not found</h1>

      <Link
        to="/"
        className="mt-6 inline-block text-primary underline"
      >
        Return to InsightONE
      </Link>
    </main>
  );
}
