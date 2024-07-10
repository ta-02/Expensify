import { Router, Response } from "express";
import { validateRequestBody } from "zod-express-middleware";
import { expenseSchema } from "./sharedTypes";
import { getUser } from "./kindeAuth";
import { UserInfo } from "./sharedTypes";
import { db } from "./db";
import { expenses as expenseTable } from "./db/schema";
import { and, desc, eq, sum } from "drizzle-orm";

const expenseRoutes = Router();

const createPostSchema = expenseSchema.omit({ id: true });

expenseRoutes.get(
  "/expenses",
  getUser,
  async (req: UserInfo, res: Response) => {
    const user = req.user;
    const expenses = await db
      .select()
      .from(expenseTable)
      .where(eq(expenseTable.userId, user.id))
      .orderBy(desc(expenseTable.createdAt))
      .limit(100);
    return res.json({ expenses: expenses });
  },
);

expenseRoutes.get(
  "/expenses/total-spent",
  getUser,
  async (req: UserInfo, res: Response) => {
    const user = req.user;
    const result = await db
      .select({ total: sum(expenseTable.amount) })
      .from(expenseTable)
      .where(eq(expenseTable.userId, user.id))
      .limit(1)
      .then((res) => res[0]);
    return res.json(result);
  },
);

expenseRoutes.post(
  "/expenses",
  getUser,
  validateRequestBody(createPostSchema),
  async (req: UserInfo, res: Response) => {
    const user = req.user;
    const expense = req.body;

    const result = await db
      .insert(expenseTable)
      .values({ ...expense, userId: user.id })
      .returning();

    return res.status(201).json(result);
  },
);

expenseRoutes.get(
  "/expenses/:id([0-9]+)",
  getUser,
  async (req: UserInfo, res: Response) => {
    const id = Number.parseInt(req.params.id);
    const user = req.user;

    const expense = await db
      .select()
      .from(expenseTable)
      .where(and(eq(expenseTable.userId, user.id), eq(expenseTable.id, id)))
      .then((res) => res[0]);

    if (!expense) {
      res.status(404).send("Expense not found");
    }

    res.json({ expense });
  },
);

expenseRoutes.delete(
  "/expenses/:id([0-9]+)",
  getUser,
  async (req: UserInfo, res: Response) => {
    const id = Number.parseInt(req.params.id);
    const user = req.user;

    const deletedExpense = await db
      .delete(expenseTable)
      .where(and(eq(expenseTable.userId, user.id), eq(expenseTable.id, id)))
      .returning()
      .then((res) => res[0]);

    if (!deletedExpense) {
      res.status(404).send("Expense not found");
    }

    res.json({ expense: deletedExpense });
  },
);

export default expenseRoutes;
