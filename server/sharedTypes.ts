import { z } from "zod";
import { Request } from "express";
import { UserType } from "@kinde-oss/kinde-typescript-sdk";

export const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
});

export type Expense = z.infer<typeof expenseSchema>;

export interface UserInfo extends Request {
  user: UserType;
}