export type TodoList = Todo[];

export type Todo = {
  id: string;
  title: string;
  create_time: Date;
  comp_date: Date;
  comp_flg: boolean;
};

export type ChangeTodo = {
  todo: Todo;
  index: number;
};

export interface Day_of_week_date {
  // [day_of_week: string]: number | null;
  [day_of_week: string]: {
    num: number | null;
    date: Date | null;
  };
}

export type TextAreaList = TextArea[];

export type TextArea = {
  textArea: HTMLTextAreaElement;
  contentHeight: number;
};

export type DatePositions = DatePosition[];

export type DatePosition = {
  num: number | null;
  date: Date | null;
  position: {
    top: number;
    left: number;
  };
};

export type TodoCompLines = TodoLine[];

export type TodoLine = {
  id: string;
  up: number;
  down: number;
  left: number;
  right: number;
  next_flg: boolean;
  difference_raw: number;
};
