import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './App.css';
import { TodoList, Day_of_week_date, ChangeTodo, DatePositions } from './type';
import { DayOfWeek } from './calendar/DayOfWeek';
import { DayCalendar } from './calendar/DayCalendar';
import { ChoiceCalendar } from './calendar/ChoiceCalendar';
import { TodoListComponent } from './todo/TodoListComponent';

function App() {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');
  const [choiceDate, setChoiceDate] = useState<Date>(new Date(Date.now()));
  const [todoList, setTodoList] = useState<TodoList | []>([]);
  const [datePositions, setDatePositions] = useState<DatePositions | []>([]);
  const divRefs = useRef<{ [key in string]: HTMLDivElement | null }>({});

  //月の再設定後に影響する項目が下記
  //今年を取得している
  const current_year = choiceDate.getFullYear();
  //今月を取得
  const current_month = choiceDate.getMonth() + 1;

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke('greet', { name }));
  }

  return (
    <main className="px-5 py-5 font-mono flex justify-around">
      <TodoListComponent todoList={todoList} setTodoList={setTodoList} />
      <div>
        <ChoiceCalendar
          current_year={current_year}
          current_month={current_month}
          choiceDate={choiceDate}
          setChoiceDate={setChoiceDate}
        />
        <table className="border-1 w-[800px] h-[600px] mt-10 relative">
          <DayOfWeek />
          <DayCalendar
            todoList={todoList}
            datePositions={datePositions}
            setDatePositions={setDatePositions}
            current_year={current_year}
            current_month={current_month}
          />
        </table>
      </div>
    </main>
  );
}

export default App;
