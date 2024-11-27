import React from "react";
import { Todo } from "./types";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

type Props = {
  todo: Todo;
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
};

/*const num2star = (n: number): JSX.Element[] => {
  const stars = [];
  for (let i = 0; i < 4 - n; i++) {
    stars.push(
      <img
        key={i}
        src="〇" // インポートした画像を使う
        alt="star"
        className="inline-block size-4"
      />
    );
  }
  return stars;
};*/

const TodoItem = (props: Props) => {
  const todo = props.todo;
  return (
    <div className="flex-col">
      <div className={twMerge(todo.isDone && "opacity-50")}>
        {todo.tag === 1 ? (
          <p className="rounded-t-lg bg-blue-300 px-4 py-2">普通のタスク</p>
        ) : todo.tag === 2 ? (
          <p className="rounded-t-lg bg-orange-300 px-4 py-2">デイリー</p>
        ) : (
          <p></p>
        )}
        <div className="my-4 flex items-start justify-between">
          {/* 左側（チェックボックスと内容） */}
          <div className="flex w-3/4 flex-col">
            <div className="mb-2 flex items-center">
              <input
                type="checkbox"
                checked={todo.isDone}
                onChange={(e) => props.updateIsDone(todo.id, e.target.checked)}
                className="mr-2 cursor-pointer"
              />
              <div
                className={twMerge(
                  "flex-1 text-xl",
                  todo.isDone && "line-through"
                )}
              >
                {todo.name}
              </div>
            </div>
            {/* 期日 */}
            <div className="mt-2 text-sm text-gray-700">
              {todo.deadline
                ? `期日： ${dayjs(todo.deadline).format("YYYY年M月D日 H時m分")}`
                : "期日なし"}

              {/*時間*/}
              <div className="space-x-4 text-sm text-gray-500">
                {todo.time ? `推定: ${todo.time}時間` : "どの程度かかるか未定"}
              </div>
            </div>
          </div>

          {/* 右側（優先度と削除ボタン） */}
          <div className="flex items-center space-x-4">
            {/* 優先度 */}
            <div className="space-x-4 text-sm text-gray-500">優先度</div>
            <div className="text-sm text-orange-400">{todo.priority}</div>
            {/* 削除ボタン */}
            <button
              onClick={() => props.remove(todo.id)}
              className="rounded-md bg-slate-200 px-4 py-2 text-sm font-bold text-white hover:bg-red-500"
            >
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
