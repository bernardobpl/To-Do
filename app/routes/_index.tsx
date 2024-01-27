import type { MetaFunction } from "@remix-run/node";
import { createRef, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "To Do App" },
    { name: "description", content: "Another To Do app" },
  ];
};

type CreateTodo = {
  name: string
  isChecked: boolean
}

type Todo = CreateTodo & {
  id: string
}

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodoName, setNewTodoName] = useState('')
  const [newTodoIsChecked, setNewTodoIsChecked] = useState(false)
  const [isEditingName, setIsEditingName] = useState<string>()
  const newTodoNameRef = createRef<HTMLInputElement>()

  const handleAdd = () => {
    const newTodo = {
      id: Math.random().toString(),
      name: newTodoName, 
      isChecked: newTodoIsChecked 
    }
    setTodos(list => [...list, newTodo])
    setNewTodoName("")
    newTodoNameRef.current?.focus()
  }

  const handleCheck = (id: string) => {
    setTodos(list => 
      list.map(todo => {
        if(todo.id === id){
          return {...todo, isChecked: !todo.isChecked}
        }
        return todo
      })
    )
  }

  const handleEditName = (id: string, name: string) => {
    setTodos(list => 
      list.map(todo => {
        if(todo.id === id){
          return {...todo, name }
        }
        return todo
      })  
    )
  }

  const handleDelete = (id: string) => {
    setTodos(list => list.filter(todo => todo.id !== id))
  }

  return (
    <div>
      <h1>To Do</h1>
      <input
        ref={newTodoNameRef}
        type="text"
        name="name"
        value={newTodoName}
        onChange={(e) => setNewTodoName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      <input 
        type='checkbox'
        name="isChecked"
        checked={newTodoIsChecked}
        onChange={(e) => setNewTodoIsChecked(e.target.checked)}
        onKeyDown={(e) => e.key === "Enter" && setNewTodoIsChecked(c => !c)}
      />
      <button 
        onClick={handleAdd} 
      >
        Add
      </button>

      <ul>
        {
          todos.map(todo => (
              <li key={todo.id} style={{display: "flex", gap: "12px"}}>
                <input type="checkbox" checked={todo.isChecked} onChange={()=>handleCheck(todo.id)}/>
                { isEditingName === todo.id
                  ? <input
                      autoFocus
                      value={todo.name} 
                      onChange={(e) => handleEditName(todo.id, e.target.value)} 
                      onBlur={() => setIsEditingName(undefined)}
                    />
                  : <div onClick={() => setIsEditingName(todo.id)}>{todo.name}</div>
                }
                <button onClick={() => handleDelete(todo.id)}>Delete</button>
              </li>
          ))
        }
      </ul>
    </div>
  );
}
