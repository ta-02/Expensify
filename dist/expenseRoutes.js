"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_express_middleware_1 = require("zod-express-middleware");
const sharedTypes_1 = require("./sharedTypes");
const kindeAuth_1 = require("./kindeAuth");
const db_1 = require("./db");
const schema_1 = require("./db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const expenseRoutes = (0, express_1.Router)();
expenseRoutes.get("/expenses", kindeAuth_1.getUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const expenses = yield db_1.db
        .select()
        .from(schema_1.expenses)
        .where((0, drizzle_orm_1.eq)(schema_1.expenses.userId, user.id))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.expenses.createdAt))
        .limit(100);
    return res.json({ expenses: expenses });
}));
expenseRoutes.get("/expenses/total-spent", kindeAuth_1.getUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield db_1.db
        .select({ total: (0, drizzle_orm_1.sum)(schema_1.expenses.amount) })
        .from(schema_1.expenses)
        .where((0, drizzle_orm_1.eq)(schema_1.expenses.userId, user.id))
        .limit(1)
        .then((res) => res[0]);
    return res.json(result);
}));
expenseRoutes.post("/expenses", kindeAuth_1.getUser, (0, zod_express_middleware_1.validateRequestBody)(sharedTypes_1.createExpenseSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const expense = req.body;
    const result = yield db_1.db
        .insert(schema_1.expenses)
        .values(Object.assign(Object.assign({}, expense), { userId: user.id }))
        .returning();
    return res.status(201).json(result);
}));
expenseRoutes.get("/expenses/:id([0-9]+)", kindeAuth_1.getUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number.parseInt(req.params.id);
    const user = req.user;
    const expense = yield db_1.db
        .select()
        .from(schema_1.expenses)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.expenses.userId, user.id), (0, drizzle_orm_1.eq)(schema_1.expenses.id, id)))
        .then((res) => res[0]);
    if (!expense) {
        res.status(404).send("Expense not found");
    }
    res.json({ expense });
}));
expenseRoutes.delete("/expenses/:id([0-9]+)", kindeAuth_1.getUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number.parseInt(req.params.id);
    const user = req.user;
    const deletedExpense = yield db_1.db
        .delete(schema_1.expenses)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.expenses.userId, user.id), (0, drizzle_orm_1.eq)(schema_1.expenses.id, id)))
        .returning()
        .then((res) => res[0]);
    if (!deletedExpense) {
        res.status(404).send("Expense not found");
    }
    res.json({ expense: deletedExpense });
}));
exports.default = expenseRoutes;
