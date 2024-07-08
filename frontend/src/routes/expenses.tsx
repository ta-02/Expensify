import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type Expense } from "../../../types/expense";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/expenses")({
  component: Expenses,
});

const getAllExpenses = async () => {
  const res = await fetch("/api/expenses");
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data.expenses;
};

function Expenses() {
  const { isPending, error, data } = useQuery<Expense[]>({
    queryKey: ["get-all-expenses"],
    queryFn: getAllExpenses,
  });

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="p-2">
      {isPending ? (
        "Loading..."
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
