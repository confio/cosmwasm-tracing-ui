import { z } from "zod";

//NOTE - Webpack disallows reading process.env as a whole, so we need to parse individual variables
export const env = {
  NEXT_PUBLIC_API_URL: z.string().url().parse(process.env.NEXT_PUBLIC_API_URL),
  NEXT_PUBLIC_MOCK_API: z
    .optional(z.enum(["TRUE", "FALSE"]))
    .parse(process.env.NEXT_PUBLIC_MOCK_API),
};
