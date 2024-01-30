import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { NewTodo, todosTable } from "schemas";
import { zfd } from "zod-form-data";

export const meta: MetaFunction = () => {
  return [
    { title: "To Do App" },
    { name: "description", content: "Another To Do app" },
  ];
};

export const loader = async () => {
  const todos = await db.select().from(todosTable).orderBy(todosTable.id)
  return {todos}
}

const newTodoSchema = zfd.formData({
  name: zfd.text(),
  isChecked: zfd.checkbox()
})

export const action = async ({ request }: ActionFunctionArgs) => {
  const requestDataValidation = newTodoSchema.safeParse(await request.formData())
  if(!requestDataValidation.success) {
    return null
  }
  const newTodo: NewTodo = requestDataValidation.data
  await db.insert(todosTable).values(newTodo)
  return null
}

export default function Index() {
  const { todos } = useLoaderData<typeof loader>()
  const fetcher = useFetcher()

  return (
    <div>
      <h1>To Do</h1>
      <Form method="post">
        <input 
          type='checkbox'
          name="isChecked"
        />
        <input
          type="text"
          name="name"
        />
        <button type="submit">Add</button>
      </Form>
      <ul>
        {
          todos.map(todo => (
            <li key={todo.id} style={{display: "flex", gap: "12px"}}>
              <fetcher.Form 
                action={`${todo.id}/update`}
                method="post"
              >
                <input 
                  type="checkbox" 
                  name="isChecked" 
                  defaultChecked={todo.isChecked}
                  checked={todo.isChecked}
                  onChange={(event) => fetcher.submit(event.currentTarget.form)}
                />
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={todo.name}
                  value={todo.name}
                  onBlur={(event) => {
                    if(event.target.value !== todo.name){
                      fetcher.submit(event.currentTarget.form)
                    }
                  }}
                />
              </fetcher.Form>
              <fetcher.Form 
                action={`${todo.id}/delete`}
                method="post"
                onSubmit={(event) => {
                  const response = confirm("Please confirm you want to delete this record.");
                  if (!response) {
                    event.preventDefault();
                  }
                }}
              >
                <button type="submit">Delete</button>
              </fetcher.Form>
            </li>
          ))
        }
      </ul>
    </div>
  );
}
