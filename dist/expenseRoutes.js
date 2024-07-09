"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_express_middleware_1 = require("zod-express-middleware");
const sharedTypes_1 = require("./sharedTypes");
const kindeAuth_1 = require("./kindeAuth");
const expenseRoutes = (0, express_1.Router)();
const createPostSchema = sharedTypes_1.expenseSchema.omit({ id: true });
const fakeExpenses = [
    { id: 1, title: "Groceries", amount: 50 },
    { id: 2, title: "Games", amount: 100 },
    { id: 3, title: "Osmows", amount: 20 },
];
expenseRoutes.get("/expenses", kindeAuth_1.getUser, (req, res) => res.json({ expenses: fakeExpenses }));
expenseRoutes.get("/expenses/total-spent", kindeAuth_1.getUser, (req, res) => {
    const total = fakeExpenses.reduce((total, expense) => total + expense.amount, 0);
    return res.json({ total });
});
expenseRoutes.post("/expenses", kindeAuth_1.getUser, (0, zod_express_middleware_1.validateRequestBody)(createPostSchema), (req, res) => {
    const expense = req.body;
    fakeExpenses.push(Object.assign(Object.assign({}, expense), { id: fakeExpenses.length + 1 }));
    res.status(201);
    return res.json(expense);
});
expenseRoutes.get("/expenses/:id([0-9]+)", kindeAuth_1.getUser, (req, res) => {
    const id = Number.parseInt(req.params.id);
    const expense = fakeExpenses.find((expense) => expense.id === id);
    if (expense) {
        res.json(expense);
    }
    else {
        res.status(404).send("Expense not found");
    }
});
expenseRoutes.delete("/expenses/:id([0-9]+)", kindeAuth_1.getUser, (req, res) => {
    const id = Number.parseInt(req.params.id);
    const index = fakeExpenses.findIndex((expense) => expense.id === id);
    if (index !== -1) {
        const deletedExpense = fakeExpenses.splice(index, 1)[0];
        res.json({ expense: deletedExpense });
    }
    else {
        res.status(404).send("Expense not found");
    }
});
exports.default = expenseRoutes;
