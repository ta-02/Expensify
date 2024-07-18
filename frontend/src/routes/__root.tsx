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
    <div className="p-4 flex flex-col sm:flex-row justify-between items-center">
      <Link to="/" className="flex items-center space-x-2 mb-4 sm:mb-0">
        <h1 className="text-3xl font-bold">Expensify💸</h1>
      </Link>
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <Link
          to="/expenses"
          className="[&.active]:font-bold hover:text-gray-300"
        >
          Expenses
        </Link>
        <Link
          to="/create-expense"
          className="[&.active]:font-bold hover:text-gray-300"
        >
          Create
        </Link>
        <Link to="/about" className="[&.active]:font-bold hover:text-gray-300">
          About
        </Link>
        <Link
          to="/profile"
          className="[&.active]:font-bold hover:text-gray-300"
        >
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
        <div className="flex flex-col min-h-screen">
          <NavBar />
          <hr />
          <div className="flex-grow">
            <Outlet />
          </div>
          <Toaster />
          <Footer />
        </div>
      </ThemeProvider>
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}
