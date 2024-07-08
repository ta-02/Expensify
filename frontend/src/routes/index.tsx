import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute("/")({
  component: Index,
});

const getTotalSpent = () => {
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
    <div className="p-4 w-[350px] m-auto">
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
