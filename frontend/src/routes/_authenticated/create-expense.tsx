import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FieldApi, useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { createExpenseSchema } from "../../types";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreateExpense,
});

function FieldInfo({ field }: { field: FieldApi<any, any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(", ")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

function CreateExpense() {
  const navigate = useNavigate();
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      title: "",
      amount: "0",
      date: new Date().toISOString(),
      category: "Other",
    },
    onSubmit: async ({ value }) => {
      try {
        await axios.post("/api/expenses", value);
        toast.success("Expense created");
        navigate({ to: "/expenses" });
      } catch (error) {
        toast.error("Failed to create expense");
        throw new Error("Failed to create expense: " + error);
      }
    },
  });

  return (
    <div className="flex flex-col items-center">
      <h2 className="p-2 mt-4 text-xl font-bold">Create Expense</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-y-4 w-[350px] m-auto"
      >
        <form.Field
          name="title"
          validatorAdapter={zodValidator()}
          validators={{
            onChange: createExpenseSchema.shape.title,
          }}
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Title</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </div>
          )}
        />

        <form.Field
          name="category"
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Category</Label>
              <Select
                onValueChange={field.handleChange}
                // @ts-ignore
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Other" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Housing & Utilities">
                    Housing & Utilities
                  </SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                  <SelectItem value="Healthcare & Insurance">
                    Healthcare & Insurance
                  </SelectItem>
                  <SelectItem value="Entertainment & Personal Care">
                    Entertainment & Personal Care
                  </SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FieldInfo field={field} />
            </div>
          )}
        />

        <form.Field
          name="amount"
          validatorAdapter={zodValidator()}
          validators={{
            onChange: createExpenseSchema.shape.amount,
          }}
          children={(field) => (
            <div className="mt-2">
              <Label htmlFor={field.name}>Amount</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                type="number"
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </div>
          )}
        />

        <form.Field
          name="date"
          validatorAdapter={zodValidator()}
          validators={{
            onChange: createExpenseSchema.shape.date,
          }}
          children={(field) => (
            <div className="self-center mt-4">
              <Calendar
                mode="single"
                selected={new Date(field.state.value)}
                onSelect={(date) =>
                  field.handleChange((date ?? new Date()).toISOString())
                }
                className="rounded-md border"
              />
              <FieldInfo field={field} />
            </div>
          )}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([_canSubmit, isSubmitting]) => (
            <Button className="mt-4 mb-8" type="submit">
              {isSubmitting ? "..." : "Submit"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
