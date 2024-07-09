import { Router, Request, Response } from "express";
import { validateRequestBody } from "zod-express-middleware";
import { expenseSchema, Expense } from "./sharedTypes";
import { getUser } from "./kindeAuth";

const expenseRoutes = Router();

const createPostSchema = expenseSchema.omit({ id: true });

const fakeExpenses: Expense[] = [
  { id: 1, title: "Groceries", amount: 50 },
  { id: 2, title: "Games", amount: 100 },
  { id: 3, title: "Osmows", amount: 20 },
];

expenseRoutes.get("/expenses", getUser, (req: Request, res: Response) =>
  res.json({ expenses: fakeExpenses })
);

expenseRoutes.get(
  "/expenses/total-spent",
  getUser,
  (req: Request, res: Response) => {
    const total = fakeExpenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
    return res.json({ total });
  }
);

expenseRoutes.post(
  "/expenses",
  getUser,
  validateRequestBody(createPostSchema),
  (req: Request, res: Response) => {
    const expense = req.body;
    fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
    res.status(201);
    return res.json(expense);
  }
);

expenseRoutes.get(
  "/expenses/:id([0-9]+)",
  getUser,
  (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id);
    const expense = fakeExpenses.find((expense) => expense.id === id);
    if (expense) {
      res.json(expense);
    } else {
      res.status(404).send("Expense not found");
    }
  }
);

expenseRoutes.delete(
  "/expenses/:id([0-9]+)",
  getUser,
  (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id);
    const index = fakeExpenses.findIndex((expense) => expense.id === id);
    if (index !== -1) {
      const deletedExpense = fakeExpenses.splice(index, 1)[0];
      res.json({ expense: deletedExpense });
    } else {
      res.status(404).send("Expense not found");
    }
  }
);

export default expenseRoutes;
