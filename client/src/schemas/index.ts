import * as z from "zod";

import { jsonCityState } from '@/lib/usCities'

export const BookFormSchema = z.object({
  origin: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().refine((val) => jsonCityState.find(v => v.z === val), {
      message: "Zip Not Found"
    }),
    apt: z.string().optional(),
    floor: z.string().min(5),
  }).required(),
  destination: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().refine((val) => jsonCityState.find(v => v.z === val), {
      message: "Zip Not Found"
    }),
    apt: z.string().optional(),
    floor: z.string().min(5),
  }).required(),
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().min(1, 'required').email('Invalid email address'),
    phone: z.string().min(10),
  }),
  deliveryDate: z.date().optional(),
  status: z.string(),
  movingDate: z.coerce.date(),
  startTime: z.string().min(3),
  service: z.string().min(3),
  moveSize: z.string().min(3),
  additionalInfo: z.string().optional(),
}).superRefine(({ service, deliveryDate }, refinementContext) => {
  if (service === 'Moving & Storage' && deliveryDate === undefined) {
    refinementContext.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid date',
      path: ['deliveryDate'],
    });
  }

  return refinementContext
});

// export const ProfileSchema = z.object({
//   firstName: z.optional(z.string()),
//   lastName: z.optional(z.string()),
//   email: z.optional(z.string().email()),
//   phone: z.optional(z.string().min(14).max(14)),
//   addPhone: z.optional(z.string().min(14).max(14)),
// })

export const ProfileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().min(1, "required").email("Invalid email address"),
  phone: z.string().min(14).max(14),
  secondaryPhone: z.string().min(14).max(14).optional().or(z.literal("")),
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

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  firstName: z.string().min(1, {
    message: "First Name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last Name is required",
  }),
});

// export const AddJobSchema = z.object({
//   date: z.date(),
//   jobId: z.string().min(5),
//   workTime: z.string().min(1),
//   tips: z.string().optional(),
//   comments: z.string().max(255).optional(),
// });