import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

const expenseScheme = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
});

type Expense = z.infer<typeof expenseScheme>;

const createPostSchema = expenseScheme.omit({ id: true });

const fakeExpenses: Expense[] = [
  { id: 1, title: "Groceries", amount: 50 },
  { id: 2, title: "Games", amount: 100 },
  { id: 3, title: "Osmows", amount: 20 },
];

export const appRouter = t.router({
  getExpenses: t.procedure.query(() => {
    return { expenses: fakeExpenses };
  }),
  getTotalSpent: t.procedure.query(() => {
    const total = fakeExpenses.reduce(
      (total, expense) => total + expense.amount,
      0,
    );
    return { total };
  }),
  getExpenseById: t.procedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => {
      const expense = fakeExpenses.find((expense) => expense.id === input.id);
      if (!expense) {
        throw new Error("Expense not found");
      }
      return expense;
    }),
  createExpense: t.procedure.input(createPostSchema).mutation(({ input }) => {
    const newExpense = { ...input, id: fakeExpenses.length + 1 };
    fakeExpenses.push(newExpense);
    return newExpense;
  }),
  deleteExpense: t.procedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => {
      const index = fakeExpenses.findIndex(
        (expense) => expense.id === input.id,
      );
      if (index === -1) {
        throw new Error("Expense not found");
      }
      const deletedExpense = fakeExpenses.splice(index, 1)[0];
      return deletedExpense;
    }),
});

export type AppRouter = typeof appRouter;
