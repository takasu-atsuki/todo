import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChangeTodo, Todo, TodoList } from '../type';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { invoke } from '@tauri-apps/api/core';

async function todoListSelect(): Promise<TodoList> {
  return await invoke('todo_list_select', {});
}

export const TodoListComponent = ({
  todoList,
  setTodoList,
}: {
  todoList: TodoList;
  setTodoList: React.Dispatch<React.SetStateAction<TodoList>>;
}) => {
  const textAreaRefs = useRef<{ [key in string]: HTMLTextAreaElement }>({});
  const [changeTodo, setChangeTodo] = useState<ChangeTodo | null>(null);

  useEffect(() => {
    (async () => {
      const todoList = invoke('todo_list_select', {});
      console.log(todoList);
    })();
  }, []);

  const compClick = (todo: Todo) => {
    setTodoList(
      todoList.map((comp) => {
        if (comp.id === todo.id) {
          todo.comp_flg = !todo.comp_flg;
        }
        return comp;
      })
    );
  };

  const todoTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    todo: Todo,
    index: number
  ) => {
    setChangeTodo({
      todo: {
        id: todo.id,
        title: event.target.value,
        comp_date: todo.comp_date,
        create_time: todo.create_time,
        comp_flg: todo.comp_flg,
      },
      index,
    });
  };

  const todoTextAreaOnBlur = (todoList: TodoList, index: number) => {
    let todolist = todoList.map((todo, childIndex) => {
      if (index === childIndex) {
        todo = changeTodo!.todo;
      }
      return todo;
    });
    setTodoList(todolist);
  };

  const textAreaSetRef = (node: HTMLTextAreaElement | null, todo: Todo) => {
    if (node !== null && textAreaRefs.current[todo.id] === undefined) {
      textAreaRefs.current[todo.id] = node;
    }
  };

  const textAreaValue = (
    changeTodo: ChangeTodo | null,
    todo: Todo,
    index: number
  ) => {
    return changeTodo?.index === index ? changeTodo.todo.title : todo.title;
  };

  const textAreaFocus = (todoList: TodoList, index: number) => {
    setChangeTodo({ todo: todoList[index], index });
  };

  useEffect(() => {
    const todolist: TodoList = [];
    let one_todo = {
      id: '0',
      title: 'AAAAAA',
      create_time: new Date(Date.now()),
      comp_date: new Date(Date.now()),
      comp_flg: false,
    };
    todolist.push(one_todo);
    let two_todo = {
      id: '1',
      title: 'TODO2',
      create_time: new Date(2025, 9, 6),
      comp_date: new Date(2025, 9, 8),
      comp_flg: false,
    };
    todolist.push(two_todo);
    let three_todo = {
      id: '2',
      title: 'TODO3',
      create_time: new Date(2025, 8, 28),
      comp_date: new Date(2025, 9, 4),
      comp_flg: true,
    };
    todolist.push(three_todo);
    setTodoList(todolist);
  }, []);

  useLayoutEffect(() => {
    if (Object.keys(textAreaRefs.current).length === 0) {
      return;
    }
    Object.keys(textAreaRefs.current).map((key) => {
      if (changeTodo !== null && changeTodo.todo.id === key) {
        textAreaRefs.current[key].style.height = 'auto';
        textAreaRefs.current[
          key
        ].style.height = `${textAreaRefs.current[key].scrollHeight}px`;
      }
    });
  }, [changeTodo?.todo.title]);

  return (
    <div className="w-[500px]">
      <h1 className="text-3xl font-extrabold tracking-[10px]">TODO LIST</h1>
      <div className="flex justify-end mt-2">
        <button>
          <FaRegPenToSquare />
        </button>
      </div>
      <div className="mt-4 h-full">
        {todoList.length !== 0 &&
          todoList.map((todo, index) => {
            return (
              <div className="mt-2" key={todo.id}>
                <div className="flex justify-start">
                  <input
                    type="checkbox"
                    className="mr-3 accent-black mt-2"
                    checked={todo.comp_flg}
                    onClick={() => compClick(todo)}
                  />
                  <textarea
                    value={textAreaValue(changeTodo, todo, index)}
                    className={`text-lg tracking-widest font-bold w-full resize-none`}
                    onBlur={() => todoTextAreaOnBlur(todoList, index)}
                    onChange={(e) => todoTextAreaChange(e, todo, index)}
                    onFocus={() => textAreaFocus(todoList, index)}
                    ref={(node) => textAreaSetRef(node, todo)}
                    rows={1}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
