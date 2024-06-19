import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  confirm: z.string()
})
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});


export const CryptoCurrencySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  logoUrl: z.string().url({ message: "Invalid URL format" }),
  network: z.string().min(1, { message: "Network is required" }),
  balance: z.number().optional(),
  currencyCode: z.string().min(1, { message: "Currency Code is required" }),
  claimAmount: z.string().min(1, { message: "Claim Amoun is required" }),
  claimFrequency: z.number().int().positive({ message: "Claim Frequency must be a positive integer" }),
  balanceAlert: z.number().positive({ message: "Balance Alert must be a positive number" }),
  donationAddress: z.string().optional(),
});

export const RequestTokenSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  network: z.string().min(1, { message: "Network is required" }),
  amount: z.number().positive({ message: "Amount must be a positive number" }),
});