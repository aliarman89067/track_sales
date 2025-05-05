import { z } from "zod";

export const CreateOrganizationFormSchema = z
  .object({
    imageUrl: z.string().optional(),
    organizationName: z
      .string()
      .min(1, { message: "Organization name is required!" }),
    organizationKeyword: z
      .string()
      .min(1, { message: "Organization keyword is required!" }),
    isMember: z.boolean().default(false).optional(),
    members: z
      .array(
        z.object({
          id: z.number(),
          imageUrl: z.string().optional(),
          name: z.string(),
          email: z.string(),
          phoneNumber: z.string().optional(),
          targetCurrency: z
            .string()
            .min(1, { message: "Currency is required!" })
            .default("$"),
          salaryCurrency: z
            .string()
            .min(1, { message: "Currency is required!" })
            .default("$"),
          monthlyTarget: z.string().refine((data) => !isNaN(Number(data)), {
            message: "Monthly target must be a number",
          }),
          salary: z.string().refine((data) => !isNaN(Number(data)), {
            message: "Monthly Salary must be a number",
          }),
        })
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isMember) {
      data.members?.forEach((member, index) => {
        if (!member.name) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Member name is required!",
            path: ["members", index, "name"],
          });
        }
        if (!member.email) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Member email is required!",
            path: ["members", index, "email"],
          });
        }
        if (!member.monthlyTarget) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Member Monthly Target is required!",
            path: ["members", index, "monthlyTarget"],
          });
        }
        if (!member.salary) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Member Salary is required!",
            path: ["members", index, "salary"],
          });
        }
      });
    }
  });

export type CreateOrganizationFormType = z.infer<
  typeof CreateOrganizationFormSchema
>;

export const MembersSchema = z.object({
  members: z.array(
    z.object({
      id: z.number(),
      imageUrl: z.string().default("defaultPersonImage.png").optional(),
      name: z.string().min(1, { message: "Member name is required!" }),
      email: z.string().min(1, { message: "Member email is required!" }),
      phoneNumber: z.string().optional(),
      targetCurrency: z
        .string()
        .min(1, { message: "Currency is required!" })
        .default("$"),
      salaryCurrency: z
        .string()
        .min(1, { message: "Currency is required!" })
        .default("$"),
      monthlyTarget: z
        .string()
        .min(1, { message: "Member Monthly Target is required!" })
        .refine((data) => !isNaN(Number(data)), {
          message: "Monthly target must be a number",
        }),
      salary: z
        .string()
        .min(1, { message: "Member Monthly Salary is required!" })
        .refine((data) => !isNaN(Number(data)), {
          message: "Monthly Salary must be a number",
        }),
    })
  ),
});

export type MembersType = z.infer<typeof MembersSchema>;

export const AddMemberSalesSchema = z.object({
  clientImageUrl: z.string().optional(),
  clientName: z.string().min(1, { message: "Client name is required!" }),
  clientEmail: z.string().min(1, { message: "Client email is required!" }),
  clientPhoneNumber: z.string().optional(),
  totalPayment: z
    .string()
    .min(1, { message: "Total Payment must be greater than 0" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Total payment must be number!",
    }),
  paidAmount: z
    .string()
    .min(1, { message: "Paid amount required!" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Paid payment must be number!",
    }),
  remainingAmount: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Paid payment must be number!",
  }),
  description: z.string().optional(),
});

export type AddMemberSalesType = z.infer<typeof AddMemberSalesSchema>;
