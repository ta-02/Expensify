import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";

type Expense = {
  id: "number";
  title: string;
  amount: string;
};

export const Route = createFileRoute("/_authenticated/expenses")({
  component: Expenses,
});

const getAllExpenses = async () => {
  return axios
    .get("/api/expenses")
    .then((res) => res.data.expenses)
    .catch((error) => {
      throw new Error("Failed to fetch expenses: " + error.message);
    });
};

function Expenses() {
  const { isPending, error, data } = useQuery<Expense[]>({
    queryKey: ["get-all-expenses"],
    queryFn: getAllExpenses,
  });

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="p-4 w-[350px] m-auto">
      {isPending ? (
        <Skeleton className="w-[350px] mt-4 h-[20px] rounded-full" />
      ) : (
        <Table>
          <TableCaption>A list of your Expenses</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell className="text-right">{item.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Expenses;
