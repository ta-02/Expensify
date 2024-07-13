import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
});

const getTotalSpent = async () => {
  return axios
    .get("/api/expenses/total-spent")
    .then((res) => res.data)
    .catch((error) => {
      throw new Error("Failed to fetch total spent: " + error.message);
    });
};

function Index() {
  const { isPending, error, data } = useQuery<{ total: number }>({
    queryKey: ["get-total-spent"],
    queryFn: getTotalSpent,
  });

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="p-4 w-full max-w-sm m-auto">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="p-4">
          <CardTitle className="text-lg font-bold">Total Spent</CardTitle>
          <CardDescription className="text-sm">
            Total amount you have spent
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-2xl font-semibold">
            {isPending ? <Skeleton className="h-6 w-24" /> : `$${data.total}`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
