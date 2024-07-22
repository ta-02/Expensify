"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectExpensesSchema = exports.insertExpensesSchema = exports.expenses = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
exports.expenses = (0, pg_core_1.pgTable)("expenses", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.text)("user_id").notNull(),
    title: (0, pg_core_1.text)("title").notNull(),
    amount: (0, pg_core_1.numeric)("amount", { precision: 12, scale: 2 }).notNull(),
    category: (0, pg_core_1.text)("category").notNull().default("Other"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    date: (0, pg_core_1.date)("date").notNull(),
}, (expenses) => {
    return {
        userIdIndex: (0, pg_core_1.index)("name_idx").on(expenses.userId),
    };
});
exports.insertExpensesSchema = (0, drizzle_zod_1.createInsertSchema)(exports.expenses, {
    title: zod_1.z
        .string()
        .min(3, { message: "Title must be at least 3 characters" })
        .max(100, { message: "Title must be at most 100 characters" }),
    amount: zod_1.z.string().regex(/^\d+(\.\d{1,2})?$/, {
        message: "Amount must be a valid monetary value",
    }),
});
exports.selectExpensesSchema = (0, drizzle_zod_1.createSelectSchema)(exports.expenses);
