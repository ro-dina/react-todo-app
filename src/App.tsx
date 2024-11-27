import { useState, useEffect } from "react";
import { Todo } from "./types";
import { initTodos } from "./initTodos";
import WelcomeMessage from "./WelcomeMessage";
import TodoList from "./TodoList";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge"; // ◀◀ 追加
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // ◀◀ 追加
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"; // ◀◀ 追加

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState(3);
  const [newTodoTime, setValue] = useState(0);
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | null>(null);
  const [TaskTag, setTaskTag] = useState(2);
  const [newTodoNameError, setNewTodoNameError] = useState("");
  const [initialized, setInitialized] = useState(false); // ◀◀ 追加
  const localStorageKey = "TodoApp"; // ◀◀ 追加

  useEffect(() => {
    const todoJsonStr = localStorage.getItem(localStorageKey);
    if (todoJsonStr && todoJsonStr !== "[]") {
      const storedTodos: Todo[] = JSON.parse(todoJsonStr);
      const convertedTodos = storedTodos.map((todo) => ({
        ...todo,
        deadline: todo.deadline ? new Date(todo.deadline) : null,
      }));
      setTodos(convertedTodos);
    } else {
      // LocalStorage にデータがない場合は initTodos をセットする
      setTodos(initTodos);
    }
    setInitialized(true);
  }, []);

  // 状態 todos または initialized に変更があったときTodoデータを保存
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(localStorageKey, JSON.stringify(todos));
    }
  }, [todos, initialized]);

  const uncompletedCount = todos.filter((todo: Todo) => !todo.isDone).length;

  const isValidTodoName = (name: string): string => {
    if (name.length > 32) {
      return "32文字以内で入力してください";
    } else {
      return "";
    }
  };

  const updateNewTodoName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoNameError(isValidTodoName(e.target.value)); // ◀◀ 追加
    setNewTodoName(e.target.value);
  };

  const updateNewTodoPriority = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoPriority(Number(e.target.value));
  };

  const updateNewTaskTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.value) {
      case "普通のタスク":
        setTaskTag(1);
        break;
      case "デイリー":
        setTaskTag(2);
        break;
    }
  };

  //スライダ
  const setNewTodotime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  const updateDeadline = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dt = e.target.value; // UIで日時が未設定のときは空文字列 "" が dt に格納される
    console.log(`UI操作で日時が "${dt}" (${typeof dt}型) に変更されました。`);
    setNewTodoDeadline(dt === "" ? null : new Date(dt));
  };

  const addNewTodo = () => {
    // ▼▼ 編集
    const normalizedName =
      newTodoName.length === 0 ? "名称未設定のタスク" : newTodoName;

    const err = isValidTodoName(newTodoName);
    if (err !== "") {
      setNewTodoNameError(err);
      return;
    }
    const newTodo: Todo = {
      id: uuid(),
      name: normalizedName,
      isDone: false,
      priority: newTodoPriority,
      time: newTodoTime,
      deadline: newTodoDeadline,
      tag: TaskTag,
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    setNewTodoName("");
    setNewTodoPriority(3);
    setNewTodoDeadline(null);
    setTaskTag(2);
  };

  const updateIsDone = (id: string, value: boolean) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isDone: value }; // スプレッド構文
      } else {
        return todo;
      }
    });
    setTodos(updatedTodos);
  };

  const removeCompletedTodos = () => {
    const updatedTodos = todos.filter((todo) => !todo.isDone);
    setTodos(updatedTodos);
  };

  const remove = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  //sort
  const sortByPriority = () => {
    const sortedTodos = [...todos].sort((a, b) => a.priority - b.priority);
    setTodos(sortedTodos);
  };

  const sortByDeadline = () => {
    const sortedTodos = [...todos].sort((a, b) => {
      const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return dateA - dateB;
    });
    setTodos(sortedTodos);
  };

  const sortByTag = () => {
    const sortedTodos = [...todos].sort((a, b) => a.tag - b.tag);
    setTodos(sortedTodos);
  };

  return (
    <div className="mx-4 mt-10 max-w-2xl md:mx-auto">
      <h1 className="mb-4 text-2xl font-bold">TodoApp</h1>
      <div className="mb-4">
        <WelcomeMessage
          name="寝屋川タヌキ"
          uncompletedCount={uncompletedCount}
        />
      </div>
      <TodoList todos={todos} updateIsDone={updateIsDone} remove={remove} />

      <button
        type="button"
        onClick={removeCompletedTodos}
        className={
          "my-4 rounded-md bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600"
        }
      >
        完了済みのタスクを削除
      </button>
      <div className="mb-4 flex space-x-4">
        <button
          onClick={sortByPriority}
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
        >
          優先度順
        </button>
        <button
          onClick={sortByDeadline}
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
        >
          期日順
        </button>
        <button
          onClick={sortByTag}
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
        >
          タグの分類
        </button>
      </div>

      <div className="mt-5 space-y-2 rounded-md border p-3">
        <h2 className="text-lg font-bold">新しいタスクの追加</h2>
        {/* 編集: ここから... */}
        <div>
          <div className="flex items-center space-x-2">
            <label className="font-bold" htmlFor="newTodoName">
              名前
            </label>
            <input
              id="newTodoName"
              type="text"
              value={newTodoName}
              onChange={updateNewTodoName}
              className={twMerge(
                "grow rounded-md border p-2",
                newTodoNameError && "border-red-500 outline-red-500"
              )}
              placeholder="32文字以内で入力してください"
            />
          </div>
          {newTodoNameError && (
            <div className="ml-10 flex items-center space-x-1 text-sm font-bold text-red-500 ">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="mr-0.5"
              />
              <div>{newTodoNameError}</div>
            </div>
          )}
        </div>
        {/* ...ここまで */}

        <div className="flex gap-5">
          <div className="font-bold">優先度</div>
          {[1, 2, 3].map((value) => (
            <label key={value} className="flex items-center space-x-1">
              <input
                id={`priority-${value}`}
                name="priorityGroup"
                type="radio"
                value={value}
                checked={newTodoPriority === value}
                onChange={updateNewTodoPriority}
              />
              <span>{value}</span>
            </label>
          ))}
        </div>

        <div className="p-4">
          <label htmlFor="slider" className="mb-2 block">
            <p>
              {newTodoTime === 0
                ? "どの程度かかるか未定"
                : `時間 : ${newTodoTime}時間`}
            </p>
          </label>
          <input
            id="slider"
            type="range"
            min="0"
            max="24"
            step="0.5"
            value={newTodoTime}
            onChange={setNewTodotime}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="deadline" className="font-bold">
            期限
          </label>
          <input
            type="datetime-local"
            id="deadline"
            value={
              newTodoDeadline
                ? dayjs(newTodoDeadline).format("YYYY-MM-DDTHH:mm:ss")
                : ""
            }
            onChange={updateDeadline}
            className="rounded-md border border-gray-400 px-2 py-0.5"
          />
        </div>

        <div className="flex items-center gap-x-2">
          <div className="font-bold">タスクの種類</div>
          {["普通のタスク", "デイリー"].map((value, index) => (
            <label key={value} className="flex items-center space-x-2">
              <input
                id={`tag-${value}`}
                name="TagGroup"
                type="radio"
                value={value}
                checked={TaskTag === index + 1}
                onChange={updateNewTaskTag}
              />
              <span>{value}</span>
            </label>
          ))}
        </div>

        <button
          type="button"
          onClick={addNewTodo}
          className={twMerge(
            "rounded-md bg-indigo-500 px-3 py-1 font-bold text-white hover:bg-indigo-600",
            newTodoNameError && "cursor-not-allowed opacity-50"
          )}
        >
          追加
        </button>
      </div>
    </div>
  );
};

export default App;
