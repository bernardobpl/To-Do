import { ActionFunctionArgs } from "@remix-run/node"
import { db } from "db"
import { eq } from "drizzle-orm"
import { todosTable } from "schemas"
import { z } from "zod"

const todoIdSchema = z.number()

export const action = async ({ params }: ActionFunctionArgs) => {
  const paramsValidation = todoIdSchema.safeParse(Number(params?.todoId))
  if(!paramsValidation.success) {
    return null
  }
  const todoId = paramsValidation.data
  const deletedTodos = await db.delete(todosTable).where(eq(todosTable.id, todoId)).returning()
  if(!deletedTodos.length){
    return null
  }
  return null
}