import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(["admin", "client"]).default("client"),
});
