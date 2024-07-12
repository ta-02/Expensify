import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/ui/footer";
import { Toaster } from "@/components/ui/sonner";
import { type QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});

function NavBar() {
  return (
    <div className="p-2 flex justify-between">
      <Link to="/" className="[&.active]:font-bold">
        <h1 className="text-2xl font-bold">Expense Tracker</h1>
      </Link>
      <div className="p-2 flex gap-6">
        <Link to="/expenses" className="[&.active]:font-bold">
          Expenses
        </Link>
        <Link to="/create-expense" className="[&.active]:font-bold">
          Create
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/profile" className="[&.active]:font-bold">
          Profile
        </Link>
        <ModeToggle />
      </div>
    </div>
  );
}

function Root() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <NavBar />
        <hr />
        <Outlet />
        <Toaster />
        <Footer />
      </ThemeProvider>
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}
