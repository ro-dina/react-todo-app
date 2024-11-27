export type Todo = {
  id: string;
  name: string;
  isDone: boolean;
  priority: number;
  time: number;
  deadline: Date | null; // 注意
  tag: number;
};
