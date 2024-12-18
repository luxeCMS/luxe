import { z } from "zod";
import { LuxeLog } from "../index.js";

export const loggerSchema = z.custom<LuxeLog>(
  (data): data is LuxeLog => data instanceof LuxeLog,
  {
    message: "Expected LuxeLog instance",
  },
);
