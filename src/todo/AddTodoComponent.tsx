import { Todo, TodoList } from '../type';

interface Props {
  addTodoButton: (
    title: string,
    create_time: Date,
    comp_date: Date
  ) => Promise<Todo>;
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  createTime: Date | null;
  setCreateTime: React.Dispatch<React.SetStateAction<Date | null>>;
  compDate: Date | null;
  setCompDate: React.Dispatch<React.SetStateAction<Date | null>>;
  todoList: TodoList;
  setTodoList: React.Dispatch<React.SetStateAction<TodoList>>;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddTodoComponent = ({
  addTodoButton,
  inputText,
  setInputText,
  createTime,
  setCreateTime,
  compDate,
  setCompDate,
  todoList,
  setTodoList,
  openModal,
  setOpenModal,
}: Props) => (
  <div className="w-[600px] h-[150px] bg-slate-100 px-7 py-4 flex flex-col absolute top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 z-100 rounded-md shadow-2xl justify-around">
    <div className="flex justify-around">
      <p>
        開始日：
        <input
          type="date"
          className="bg-white rounded-md p-1"
          onChange={(e) => {
            setCreateTime(new Date(e.target.value));
          }}
        />
      </p>
      <p>
        完了日：
        <input
          type="date"
          className="bg-white rounded-md p-1"
          onChange={(e) => setCompDate(new Date(e.target.value))}
        />
      </p>
    </div>
    <input
      type="text"
      className="bg-white rounded-md p-1 mt-3"
      onChange={(e) => setInputText(e.target.value)}
    />
    <div className="flex justify-around mt-3">
      <button
        className="px-8 py-2 bg-red-100 rounded-md"
        onClick={() => setOpenModal(!openModal)}
      >
        cancel
      </button>
      <button
        className="px-8 py-2 bg-blue-100 rounded-md"
        onClick={async () => {
          let result = await addTodoButton(inputText, createTime!, compDate!);
          setOpenModal(!openModal);
          setTodoList([...todoList, result]);
        }}
      >
        add
      </button>
    </div>
  </div>
);
