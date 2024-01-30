import { ActionFunctionArgs } from "@remix-run/node";
import { db } from "db";
import { eq } from "drizzle-orm";
import { todosTable } from "schemas";
import { z } from "zod";
import { zfd } from "zod-form-data";

const todoIdSchema = z.number()

const updateTodoSchema = zfd.formData({
  name: zfd.text(),
  isChecked: zfd.checkbox()
})

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const paramsValidation = todoIdSchema.safeParse(Number(params?.todoId))
  if(!paramsValidation.success) {
    return null
  }
  const todoId = paramsValidation.data

  const requestDataValidation = updateTodoSchema.safeParse(await request.formData())
  if(!requestDataValidation.success) {
    return null
  }
  const updateTodo = requestDataValidation.data
  const updatedTodos = await db.update(todosTable).set(updateTodo).where(eq(todosTable.id, todoId)).returning()
  if(!updatedTodos.length){
    return null
  }
  return null
}