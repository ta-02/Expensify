import { Router } from "express";
import { z } from "zod";
import { validateRequestBody } from "zod-express-middleware";
import { expenseSchema, Expense } from "../../types/expense";

const router = Router();

const createPostSchema = expenseSchema.omit({ id: true });

const fakeExpenses: Expense[] = [
  { id: 1, title: "Groceries", amount: 50 },
  { id: 2, title: "Games", amount: 100 },
  { id: 3, title: "Osmows", amount: 20 },
];

router.get("/expenses", (req, res) => res.json({ expenses: fakeExpenses }));

router.get("/expenses/total-spent", (req, res) => {
  const total = fakeExpenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );
  return res.json({ total });
});

router.post("/expenses", validateRequestBody(createPostSchema), (req, res) => {
  const expense = req.body;
  fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
  res.status(201);
  return res.json(expense);
});

router.get("/expenses/:id([0-9]+)", (req, res) => {
  const id = Number.parseInt(req.params.id);
  const expense = fakeExpenses.find((expense) => expense.id === id);
  if (expense) {
    res.json(expense);
  } else {
    res.status(404).send("Expense not found");
  }
});

router.delete("/expenses/:id([0-9]+)", (req, res) => {
  const id = Number.parseInt(req.params.id);
  const index = fakeExpenses.findIndex((expense) => expense.id === id);
  if (index !== -1) {
    const deletedExpense = fakeExpenses.splice(index, 1)[0];
    res.json({ expense: deletedExpense });
  } else {
    res.status(404).send("Expense not found");
  }
});

export default router;
