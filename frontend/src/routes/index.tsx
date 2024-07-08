import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

const getTotalSpent = async () => {
  const res = await fetch("/api/expenses/total-spent");
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data;
};

function Index() {
  const { isPending, error, data } = useQuery<{ total: number }>({
    queryKey: ["get-total-spent"],
    queryFn: getTotalSpent,
  });

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="flex justify-center items-start mt-4 w-screen h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>Total amount you have spent</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{isPending ? "..." : data.total}</p>
        </CardContent>
      </Card>
    </div>
  );
}
