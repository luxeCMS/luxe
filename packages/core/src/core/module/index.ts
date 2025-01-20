import type { Module } from "../../types/index.js";

export const defineModule = (
  name: string,
  module: Omit<Module, "name">,
): Module => {
  return {
    name,
    ...module,
  };
};
