import { defineDocument, defineField } from "luxecms";

export const address = defineDocument({
  name: "address",
  fields: [
    defineField({
      name: "street",
      type: "string",
    }),
    defineField({
      name: "city",
      type: "string",
    }),
    defineField({
      name: "state",
      type: "string",
    }),
    defineField({
      name: "zip",
      type: "string",
    }),
  ],
});
