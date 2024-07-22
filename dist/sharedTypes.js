"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpenseSchema = void 0;
const zod_1 = require("zod");
const expenseSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive().min(1),
    title: zod_1.z
        .string()
        .min(3, { message: "Title must be at least 3 characters" })
        .max(100, { message: "Title must be at most 100 characters" }),
    amount: zod_1.z.string().regex(/^\d+(\.\d{1,2})?$/, {
        message: "Amount must be a valid monetary value",
    }),
    date: zod_1.z.string(),
    category: zod_1.z.string(),
});
exports.createExpenseSchema = expenseSchema.omit({ id: true });
