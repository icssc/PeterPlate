import { z } from "zod";

// mm/dd/yyyy
export const DateRegex = z
  .string()
  .regex(
    /^((0?[1-9]|1[012])[/](0?[1-9]|[12][0-9]|3[01])[/](19|20)?[0-9]{2})*$/,
  );
