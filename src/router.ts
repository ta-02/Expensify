import { Router } from "express";
import { z } from "zod";
import { validateRequestBody } from "zod-express-middleware";

const router = Router();

const expenseScheme = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
});

type Expense = z.infer<typeof expenseScheme>;

const createPostSchema = expenseScheme.omit({ id: true });

const fakeExpenses: Expense[] = [
  { id: 1, title: "Groceries", amount: 50 },
  { id: 2, title: "games", amount: 100 },
  { id: 3, title: "Osmows", amount: 20 },
];

router.get("/", (req, res) => res.json({ expesnes: fakeExpenses }));

router.post("/", validateRequestBody(createPostSchema), (req, res) => {
  const expense = req.body;
  fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
  res.status(201);
  return res.json(expense);
});

router.get("/:id([0-9]+)", (req, res) => {
  const id = Number.parseInt(req.params.id);
  const expense = fakeExpenses.find((expense) => expense.id === id);
  if (expense) {
    res.json(expense);
  } else {
    res.status(404).send("Expense not found");
  }
});

router.delete("/:id([0-9]+)", (req, res) => {
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
