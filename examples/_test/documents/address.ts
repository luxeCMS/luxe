import { defineDocument } from "luxecms";

export const address = defineDocument({
  name: "address",
  fields: [
    defineText({
      name: "street",
      validate: z.string().min(1).max(100),
    }),
    defineText({
      name: "city",
      validate: z.string().min(1).max(100),
    }),
    defineText({
      name: "state",
      validate: z.string().min(2).max(2),
    }),
    defineNumber({
      name: "zip",
      validate: z.number().min(10000).max(99999),
    }),
  ],
});

export const document = defineDocument({
  name: "user",
  fields: [
    defineText({
      name: "name",
      validate: z.string().min(1).max(100),
    }),
    defineText({
      name: "email",
      validate: z.string().email(),
    }),
    defineReference({
      name: "address",
      to: "address",
    }),
  ],
});
