import type { Module } from "../types/index.js";

export const objectsModule: Module = {
  name: "ObjectsModule",
  hooks: {
    "luxe:server:start": async (ctx) => {
      ctx.logger.info("Objects module started!");
    },
    "luxe:server:shutdown": async (ctx) => {
      ctx.logger.info("Objects module stopped!");
    },
  },
};
