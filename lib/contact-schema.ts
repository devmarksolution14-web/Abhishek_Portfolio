import { z } from "zod";
import { budgetOptions, serviceOptions } from "@/data/skills";

/** Shared by the contact form (client) and the API route (server). */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80, "That name is a little long."),
  email: z.email("Please enter a valid email address.").max(120),
  services: z.array(z.enum(serviceOptions)).min(1, "Pick at least one service."),
  budget: z.enum(budgetOptions, "Choose a budget range."),
  message: z
    .string()
    .trim()
    .min(20, "Tell me a little more (at least 20 characters).")
    .max(4000, "Please keep it under 4,000 characters."),
  /** Honeypot: real people leave this empty. */
  company: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
