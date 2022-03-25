import { z } from "zod";

const ScreenSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(12)
    .regex(/[A-Za-z0-9]/),
  defaultContent: z.string().url().optional(),
});

export type ScreenDto = z.infer<typeof ScreenSchema>;
