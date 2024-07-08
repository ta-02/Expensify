import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/expenses")({
  component: Expenses,
});

const getExpenses = async () => {
  const res = await fetch("/api/expenses");
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data;
};

function Expenses() {
  const { isPending, error, data } = useQuery<{ total: number }>({
    queryKey: ["get-expenses"],
    queryFn: getExpenses,
  });

  if (error) return "An error has occurred: " + error.message;
  return <div className="p-2">Show All Expenses!</div>;
}
