"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseSchema = void 0;
const zod_1 = require("zod");
exports.expenseSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive().min(1),
    title: zod_1.z.string().min(3).max(100),
    amount: zod_1.z.number().int().positive(),
});
