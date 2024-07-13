import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="flex flex-col items-center p-2 mt-4 font-bold text-xl">
      Coming Soon!
    </div>
  );
}
