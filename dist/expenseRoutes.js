"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_express_middleware_1 = require("zod-express-middleware");
const sharedTypes_1 = require("./sharedTypes");
const kindeAuth_1 = require("./kindeAuth");
const db_1 = require("./db");
const schema_1 = require("./db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const expenseRoutes = (0, express_1.Router)();
expenseRoutes.get("/expenses", kindeAuth_1.getUser, async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(404);
    }
    const expenses = await db_1.db
        .select()
        .from(schema_1.expenses)
        .where((0, drizzle_orm_1.eq)(schema_1.expenses.userId, user.id))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.expenses.createdAt))
        .limit(100);
    return res.json({ expenses: expenses });
});
expenseRoutes.get("/expenses/total-spent", kindeAuth_1.getUser, async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(404);
    }
    const result = await db_1.db
        .select({ total: (0, drizzle_orm_1.sum)(schema_1.expenses.amount) })
        .from(schema_1.expenses)
        .where((0, drizzle_orm_1.eq)(schema_1.expenses.userId, user.id))
        .limit(1)
        .then((res) => res[0]);
    return res.json(result);
});
expenseRoutes.post("/expenses", kindeAuth_1.getUser, (0, zod_express_middleware_1.validateRequestBody)(sharedTypes_1.createExpenseSchema), async (req, res) => {
    const user = req.user;
    const expense = req.body;
    if (!user) {
        return res.status(404);
    }
    const result = await db_1.db
        .insert(schema_1.expenses)
        .values({
        ...expense,
        userId: user.id,
    })
        .returning();
    return res.status(201).json(result);
});
expenseRoutes.get("/expenses/:id([0-9]+)", kindeAuth_1.getUser, async (req, res) => {
    const id = Number.parseInt(req.params.id);
    const user = req.user;
    if (!user) {
        return res.status(404);
    }
    const expense = await db_1.db
        .select()
        .from(schema_1.expenses)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.expenses.userId, user.id), (0, drizzle_orm_1.eq)(schema_1.expenses.id, id)))
        .then((res) => res[0]);
    if (!expense) {
        res.status(404).send("Expense not found");
    }
    res.json({ expense });
});
expenseRoutes.delete("/expenses/:id([0-9]+)", kindeAuth_1.getUser, async (req, res) => {
    const id = Number.parseInt(req.params.id);
    const user = req.user;
    if (!user) {
        return res.status(404);
    }
    const deletedExpense = await db_1.db
        .delete(schema_1.expenses)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.expenses.userId, user.id), (0, drizzle_orm_1.eq)(schema_1.expenses.id, id)))
        .returning()
        .then((res) => res[0]);
    if (!deletedExpense) {
        res.status(404).send("Expense not found");
    }
    res.json({ expense: deletedExpense });
});
exports.default = expenseRoutes;
