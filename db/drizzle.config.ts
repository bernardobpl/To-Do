import type { Config } from "drizzle-kit"

export default {
  schema: "./schemas/todo.ts",
  out: "./drizzle"
} satisfies Config