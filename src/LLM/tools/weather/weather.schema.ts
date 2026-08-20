import { z } from "zod";

export const weatherToolSchema = z.object({
  query: z.string().min(1).describe("City name to get the current weather for"),
});

export type WeatherToolInput = z.infer<typeof weatherToolSchema>;
