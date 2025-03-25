
import { z } from "zod";

export const statusOptions = [0, 1, 2] as const;

export const todoCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  duedate: z.string().refine(
    (val) => {
      const date = new Date(val);
      return date >= new Date(new Date().toDateString());
    },
    { message: "Due date must be in the future or today" }
  ),
  status: z.number().refine(
    (val) => statusOptions.includes(val as any),
    { message: "Invalid status" }
  ),
  user_id: z.string().optional(),
});

export const todoUpdateSchema = z.object({
  id: z.string(),
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  duedate: z.string().refine(
    (val) => {
      if (!val) return true; 
      const date = new Date(val);
      return date >= new Date(new Date().toDateString());
    },
    { message: "Due date must be in the future or today" }
  ).optional(),
  status: z.number().refine(
    (val) => (val === undefined || statusOptions.includes(val as any)),
    { message: "Invalid status" }
  ).optional(),
  user_id: z.string().optional(),
});
