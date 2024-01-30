import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const todosTable = pgTable("todos", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  isChecked: boolean("isChecked").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
})

export type NewTodo = InferInsertModel<typeof todosTable>
export type Todo = InferSelectModel<typeof todosTable>
