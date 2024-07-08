import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

function App() {
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/expenses/total-spent");
      const data = await res.json();
      setTotalSpent(data.total);
    };
    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-start mt-4 w-screen h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>Total amount you have spent</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{totalSpent}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
