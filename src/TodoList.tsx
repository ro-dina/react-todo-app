import React from "react";
import { Todo } from "./types";
import TodoItem from "./TodoItem"; // ◀◀ 追加

type Props = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
};

const TodoList = (props: Props) => {
  const todos = props.todos;

  if (todos.length === 0) {
    return (
      <div className="text-red-500">
        現在、登録されているタスクはありません。
      </div>
    );
  }

  return (
    <div className={"space-y-2"}>
      {todos.map((todo) => (
        <div style={{ border: "2px solid black", padding: "10px" }}>
          <TodoItem
            key={todo.id}
            todo={todo}
            remove={props.remove}
            updateIsDone={props.updateIsDone}
          />
        </div>
      ))}
    </div>
  );
};

export default TodoList;
