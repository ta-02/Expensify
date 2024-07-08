"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_express_middleware_1 = require("zod-express-middleware");
const expense_1 = require("../types/expense");
const router = (0, express_1.Router)();
const createPostSchema = expense_1.expenseSchema.omit({ id: true });
const fakeExpenses = [
    { id: 1, title: "Groceries", amount: 50 },
    { id: 2, title: "games", amount: 100 },
    { id: 3, title: "Osmows", amount: 20 },
];
router.get("/expenses", (req, res) => res.json({ expesnes: fakeExpenses }));
router.get("/expenses/total-spent", (req, res) => {
    const total = fakeExpenses.reduce((total, expense) => total + expense.amount, 0);
    return res.json({ total });
});
router.post("/expenses", (0, zod_express_middleware_1.validateRequestBody)(createPostSchema), (req, res) => {
    const expense = req.body;
    fakeExpenses.push(Object.assign(Object.assign({}, expense), { id: fakeExpenses.length + 1 }));
    res.status(201);
    return res.json(expense);
});
router.get("/expenses/:id([0-9]+)", (req, res) => {
    const id = Number.parseInt(req.params.id);
    const expense = fakeExpenses.find((expense) => expense.id === id);
    if (expense) {
        res.json(expense);
    }
    else {
        res.status(404).send("Expense not found");
    }
});
router.delete("/expenses/:id([0-9]+)", (req, res) => {
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
exports.default = router;
