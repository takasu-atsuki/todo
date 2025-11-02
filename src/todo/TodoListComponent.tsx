import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChangeTodo, Todo, TodoList, User } from '../type';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { invoke } from '@tauri-apps/api/core';
import { LiaUserCircle } from 'react-icons/lia';
import { AddTodoComponent } from './AddTodoComponent';

async function todoListSelect(): Promise<TodoList> {
  return await invoke('todo_list_select', {});
}

const addTodoButton = async (
  title: string,
  createTime: Date,
  compDate: Date
): Promise<Todo> => {
  return await invoke('add_todo', { title, createTime, compDate });
};

export const TodoListComponent = ({
  todoList,
  setTodoList,
}: {
  todoList: TodoList;
  setTodoList: React.Dispatch<React.SetStateAction<TodoList>>;
}) => {
  const textAreaRefs = useRef<{ [key in string]: HTMLTextAreaElement }>({});
  const [changeTodo, setChangeTodo] = useState<ChangeTodo | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [createTime, setCreateTime] = useState<Date | null>(null);
  const [compDate, setCompDate] = useState<Date | null>(null);
  const [changeFlg, setChangeFlg] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const todoList = await todoListSelect();
      setTodoList(todoList);
    })();
  }, [changeFlg]);

  async function createUser(): Promise<User> {
    return await invoke('create_user', {});
  }

  const compClick = async (todo: Todo) => {
    setTodoList(
      todoList.map((comp) => {
        if (comp.id === todo.id) {
          todo.comp_flg = !todo.comp_flg;
        }
        return comp;
      })
    );
    const result = await invoke('update_comp_flg', { todo });
    setChangeFlg(!changeFlg);
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

  const todoInputDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    todo: Todo,
    index: number
  ) => {
    setChangeTodo({
      todo: {
        id: todo.id,
        title: todo.title,
        comp_date: new Date(event.target.value),
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

  const compDateValue = (
    changeTodo: ChangeTodo | null,
    todo: Todo,
    index: number
  ) => {
    return changeTodo?.index === index
      ? new Date(changeTodo.todo.comp_date).toISOString().split('T')[0]
      : new Date(todo.comp_date).toISOString().split('T')[0];
  };

  const textAreaFocus = (todoList: TodoList, index: number) => {
    setChangeTodo({ todo: todoList[index], index });
  };

  useEffect(() => {
    (async () => {
      const result = await createUser();
      setUser(result);
    })();
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
      {openModal && (
        <AddTodoComponent
          addTodoButton={addTodoButton}
          inputText={inputText}
          setInputText={setInputText}
          createTime={createTime}
          setCreateTime={setCreateTime}
          compDate={compDate}
          setCompDate={setCompDate}
          todoList={todoList}
          setTodoList={setTodoList}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
      <h1 className="text-3xl font-extrabold tracking-[10px]">TODO LIST</h1>
      <div className="flex justify-end mt-2">
        <button onClick={() => setOpenModal(!openModal)}>
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
                    className={`text-lg tracking-widest w-full resize-none`}
                    onBlur={() => todoTextAreaOnBlur(todoList, index)}
                    onChange={(e) => todoTextAreaChange(e, todo, index)}
                    onFocus={() => textAreaFocus(todoList, index)}
                    ref={(node) => textAreaSetRef(node, todo)}
                    rows={1}
                  />
                  <input
                    type="date"
                    value={compDateValue(changeTodo, todo, index)}
                    className="text-xs w-[150px]"
                    onChange={(e) => todoInputDateChange(e, todo, index)}
                  />
                </div>
              </div>
            );
          })}
      </div>
      {user !== null && (
        <div className="fixed bottom-[5%]">
          <p className="text-md font-bold tracking-tighter flex items-center">
            <LiaUserCircle className="text-lg mr-3" /> {user.name}
          </p>
        </div>
      )}
    </div>
  );
};
