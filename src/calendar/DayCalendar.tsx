import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  DatePosition,
  DatePositions,
  Day_of_week_date,
  TodoCompLines,
  TodoList,
} from '../type';

export const DayCalendar = ({
  // day_of_week_calendar_list,
  todoList,
  datePositions,
  setDatePositions,
  current_year,
  current_month,
}: {
  // day_of_week_calendar_list: Day_of_week_date[];
  todoList: TodoList;
  datePositions: DatePositions;
  setDatePositions: React.Dispatch<React.SetStateAction<DatePositions | []>>;
  current_year: number;
  current_month: number;
}) => {
  const divRefs = useRef<{ [key in string]: HTMLDivElement | null }>({});
  const [todoCompLines, setTodoCompLines] = useState<TodoCompLines | []>([]);
  //カレンダー表示で最初の行で前の月が必要な場合のため
  const before_month_last_day =
    current_month == 1
      ? new Date(current_year - 1, 12, 0)
      : new Date(current_year, current_month - 1, 0);
  //カレンダー表示で最後の行で次の月が必要な場合のため
  const next_month_first_day =
    current_month == 12
      ? new Date(current_year + 1, 1, 1)
      : new Date(current_year, current_month, 1);
  //今月の最後の日を取得する
  const current_month_last_day = new Date(current_year, current_month, 0);
  //今月の最初の日を取得する
  const current_month_first_day = new Date(current_year, current_month - 1, 1);
  //今月の最後の日を文字列で取得する
  const current_month_last_date = current_month_last_day.getDate();
  //今月の最初の日を文字列で取得する
  const current_month_first_date = current_month_first_day.getDate();
  //最後の日の曜日をインデックスで取得する
  const last_day_of_week = current_month_last_day.getDay();
  //最初の日の曜日をインデックスで取得する
  const first_day_of_week = current_month_first_day.getDay();

  //カレンダー行の前の月のnull値を埋めるためにインデックスの計算をする
  const before_day_of_week_empty_day =
    first_day_of_week !== 0 ? first_day_of_week - 1 : null;

  //曜日確定のためのリスト(取得したインデックスをこれで使用する)
  const day_of_week_list = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  //カレンダーを行ごとに管理するリスト
  const day_of_week_calendar_list: Day_of_week_date[] = [];

  let day_remem = current_month_first_date;

  while (day_remem <= current_month_last_date) {
    const day_of_week_calendar_raw: Day_of_week_date = {
      Sun: { num: null, date: null },
      Mon: { num: null, date: null },
      Tue: { num: null, date: null },
      Wed: { num: null, date: null },
      Thu: { num: null, date: null },
      Fri: { num: null, date: null },
      Sat: { num: null, date: null },
    };
    if (day_remem == current_month_first_date) {
      for (let i = 0; i <= day_of_week_list.length - 1; i++) {
        if (i !== first_day_of_week) {
          day_of_week_calendar_raw[day_of_week_list[i]].num =
            before_month_last_day.getDate() - first_day_of_week + 1 + i;
          day_of_week_calendar_raw[day_of_week_list[i]].date = new Date(
            before_month_last_day.getFullYear(),
            before_month_last_day.getMonth(),
            before_month_last_day.getDate() - first_day_of_week + 1 + i
          );
        }
        if (i === first_day_of_week) {
          day_of_week_calendar_raw[day_of_week_list[i]].num =
            current_month_first_date;
          day_of_week_calendar_raw[day_of_week_list[i]].date = new Date(
            current_month_first_day.getFullYear(),
            current_month_first_day.getMonth(),
            current_month_first_date
          );
          day_remem += 1;
        }

        if (i > first_day_of_week) {
          day_of_week_calendar_raw[day_of_week_list[i]].num =
            current_month_first_date + i - first_day_of_week;
          day_of_week_calendar_raw[day_of_week_list[i]].date = new Date(
            current_month_first_day.getFullYear(),
            current_month_first_day.getMonth(),
            current_month_first_date + i - first_day_of_week
          );
          day_remem += 1;
        }
      }
      day_of_week_calendar_list.push(day_of_week_calendar_raw);
    } else {
      let next_day = next_month_first_day.getDate();
      for (let i = 0; i <= day_of_week_list.length - 1; i++) {
        if (day_remem <= current_month_last_date) {
          day_of_week_calendar_raw[day_of_week_list[i]].num = day_remem;
          day_of_week_calendar_raw[day_of_week_list[i]].date = new Date(
            current_month_last_day.getFullYear(),
            current_month_last_day.getMonth(),
            day_remem
          );
        } else {
          day_of_week_calendar_raw[day_of_week_list[i]].num = next_day;
          day_of_week_calendar_raw[day_of_week_list[i]].date = new Date(
            next_month_first_day.getFullYear(),
            next_month_first_day.getMonth(),
            next_day
          );
          next_day += 1;
        }
        day_remem += 1;
      }
      day_of_week_calendar_list.push(day_of_week_calendar_raw);
    }
  }

  //CSSプロパティのための初期値(上からと横からの長さ)
  const TOP_HEADER = 33;
  const LEFT_RANGE_INTERVAL = 114;
  const TOP_RANGE_INTERVAL = 113;

  useEffect(() => {
    let date_positions: DatePosition[] = [];
    day_of_week_calendar_list.map((day_of_week_calendar_raw, y) => {
      Object.keys(day_of_week_calendar_raw).map((key, x) => {
        const date_position = {
          date: day_of_week_calendar_raw[key].date,
          num: day_of_week_calendar_raw[key].num,
          position: {
            top: y === 0 ? TOP_HEADER : TOP_HEADER + TOP_RANGE_INTERVAL * y,
            left: x === 0 ? 0 : LEFT_RANGE_INTERVAL * x,
          },
        };
        date_positions.push(date_position);
      });
    });
    setDatePositions(date_positions);
  }, [current_month]);

  useEffect(() => {
    let todoCompLines: TodoCompLines = [];
    let topCount = 1;
    //keyを高さで設定したオブジェクトの配列を作成してlengthの高さで揃える
    let top_filters: { [key in number]: { start: number[]; end: number[] } } =
      {};
    todoList.map((todo, index) => {
      const filter_position = datePositions.filter(
        (datePosition) =>
          datePosition.date?.toDateString() ==
            todo.create_time.toDateString() ||
          datePosition.date?.toDateString() == todo.comp_date.toDateString()
      );
      if (todo.create_time.toDateString() == todo.comp_date.toDateString()) {
        filter_position.push(...filter_position);
      }

      if (filter_position.length !== 0) {
        //連想配列にtodo.idを追加
        if (filter_position[0].position.top in top_filters) {
          let positionCount =
            top_filters[filter_position[0].position.top]['start'].length;
          top_filters[filter_position[0].position.top]['start'].push(
            filter_position[0].position.top * (positionCount + 1)
          );
        } else {
          top_filters[filter_position[0].position.top] = {
            start: [filter_position[0].position.top],
            end: [filter_position[1].position.top],
          };
        }

        if (filter_position[1].position.top in top_filters) {
          let positionCount =
            top_filters[filter_position[0].position.top]['end'].length;
          top_filters[filter_position[0].position.top]['end'].push(
            filter_position[1].position.top * (positionCount + 1)
          );
        } else {
          top_filters[filter_position[0].position.top]['end'] = [
            filter_position[1].position.top,
          ];
        }

        todoCompLines.push({
          id: todo.id,
          up: top_filters[filter_position[0].position.top]['start'].slice(
            -1
          )[0],
          // up: filter_position[0].position.top,
          down: top_filters[filter_position[0].position.top]['end'].slice(
            -1
          )[0],
          left: filter_position[0].position.left,
          right: filter_position[1].position.left,
          next_flg:
            filter_position[0].date?.getMonth() !==
            filter_position[1].date?.getMonth(),
          difference_raw:
            filter_position[1].position.top -
              filter_position[0].position.top !==
            0
              ? filter_position[1].position.top / LEFT_RANGE_INTERVAL -
                (filter_position[0].position.top / LEFT_RANGE_INTERVAL === 0
                  ? 1
                  : filter_position[0].position.top / LEFT_RANGE_INTERVAL)
              : 0,
        });
      }
    });
    setTodoCompLines(todoCompLines);
  }, [datePositions, todoList]);

  return (
    <>
      <tbody>
        {day_of_week_calendar_list.map((day_of_week_calendar_raw) => {
          return (
            <tr>
              <td className="border-1 p-1 text-center text-slate-400 border-black bg-red-200">
                {day_of_week_calendar_raw['Sun'].num}
              </td>
              <td className="border-1 p-1 text-center ">
                {day_of_week_calendar_raw['Mon'].num}
              </td>
              <td className="border-1 p-1 text-center">
                {day_of_week_calendar_raw['Tue'].num}
              </td>
              <td className="border-1 p-1 text-center">
                {day_of_week_calendar_raw['Wed'].num}
              </td>
              <td className="border-1 p-1 text-center">
                {day_of_week_calendar_raw['Thu'].num}
              </td>
              <td className="border-1 p-1 text-center">
                {day_of_week_calendar_raw['Fri'].num}
              </td>
              <td className="border-1 p-1 text-center bg-blue-200 text-slate-400 border-black">
                {day_of_week_calendar_raw['Sat'].num}
              </td>
            </tr>
          );
        })}
      </tbody>
      {todoList.map((todo, index) => {
        return todoCompLines.map((todoComp) => {
          if (todo.id !== todoComp.id) {
            return;
          }
          if (todoComp.difference_raw !== 0) {
            for (let i = 0; i <= todoComp.difference_raw; i++) {
              return (
                <div
                  className={`bg-green-600 absolute top-[35px] left-0 rounded-lg text-center text-[8px] font-bold h-[15px] px-2`}
                  style={{
                    top: i === 0 ? todoComp.up : todoComp.up * i,
                    left: i === 0 ? todoComp.left : 0,
                    width: i === todoComp.difference_raw ? todoComp.right : 500,
                  }}
                  ref={(node) => {
                    if (
                      divRefs !== null &&
                      divRefs.current[todo.id] === undefined
                    ) {
                      divRefs.current[todo.id] = node;
                    }
                  }}
                >
                  <p>{todo.title}</p>
                </div>
              );
            }
          } else {
            return (
              <>
                <div
                  className={`bg-green-600 absolute top-[35px] left-0 rounded-lg text-center text-[8px] font-bold h-[15px] px-2`}
                  style={{
                    top: todoComp.up,
                    left: todoComp.left,
                    width:
                      todoComp.right - todoComp.left === 0
                        ? LEFT_RANGE_INTERVAL
                        : todoComp.right - todoComp.left,
                  }}
                  ref={(node) => {
                    if (
                      divRefs !== null &&
                      divRefs.current[todo.id] === undefined
                    ) {
                      divRefs.current[todo.id] = node;
                    }
                  }}
                >
                  <p>{todo.title}</p>
                </div>
              </>
            );
          }
        });
      })}
    </>
  );
};
