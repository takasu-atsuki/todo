import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  DatePosition,
  DatePositions,
  Day_of_week_date,
  StartPosition_And_EndPosition,
  TodoCompLines,
  TodoDifferenceLines,
  TodoList,
} from '../type';

const colorClassMap: Record<string, string> = {
  green: 'bg-green-600',
  red: 'bg-red-600',
  orange: 'bg-orange-600',
  amber: 'bg-amber-600',
  yellow: 'bg-yellow-600',
  lime: 'bg-lime-600',
  emerald: 'bg-emerald-600',
  teal: 'bg-teal-600',
  cyan: 'bg-cyan-600',
  sky: 'bg-sky-600',
  blue: 'bg-blue-600',
  indigo: 'bg-indigo-600',
  violet: 'bg-violet-600',
  purple: 'bg-purple-600',
  fuchsia: 'bg-fuchsia-600',
  pink: 'bg-pink-600',
  rose: 'bg-rose-600',
};

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
  // const divRefs = useRef<{ [key in string]: HTMLDivElement[] }>({});
  const divRefs = useRef<Record<string, HTMLDivElement[]>>({});
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
  const color_list = [
    'green',
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'lime',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
  ];

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
        if (i < first_day_of_week) {
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
  const GANTO_HEIGHT = 10;

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
    let todoDifferenceLines: TodoDifferenceLines | null = null;
    let interval_index: { [key in string]: number } = {};
    let interval_count = 1;
    let positionCount = 1;

    //keyを高さで設定したオブジェクトの配列を作成してlengthの高さで揃える
    // let top_filters: { [key in string]: { start: number[]; end: number[] } } =
    //   {};
    let top_filters: Record<string, StartPosition_And_EndPosition> = {};
    todoList.map((todo, index) => {
      const filter_position = datePositions.filter((datePosition) => {
        return (
          datePosition.date?.toDateString() ==
            new Date(todo.create_time).toDateString() ||
          datePosition.date?.toDateString() ==
            new Date(todo.comp_date).toDateString()
        );
      });
      if (filter_position.length == 1) {
        if (todo.create_time == todo.comp_date) {
          filter_position.push(...filter_position);
        }
        if (filter_position.length == 1) {
          if (
            datePositions.find((datePosition) => {
              return (
                datePosition.date?.toDateString() ==
                new Date(todo.create_time).toDateString()
              );
            })
          ) {
            filter_position.push(datePositions.slice(-1)[0]);
          }
          if (
            datePositions.find((datePosition) => {
              return (
                datePosition.date?.toDateString() ==
                new Date(todo.comp_date).toDateString()
              );
            })
          ) {
            filter_position.unshift(datePositions.slice(0)[0]);
          }
        }
      }
      if (filter_position.length !== 0) {
        //連想配列にtodo.idを追加
        if (filter_position[0].position.top in top_filters) {
          // let positionCount =
          //   top_filters[filter_position[0].position.top]['start'].length;
          top_filters[filter_position[0].position.top]['start'].push(
            filter_position[0].position.top + (GANTO_HEIGHT + 2) * positionCount
          );
          interval_index[
            Math.ceil(
              top_filters[filter_position[0].position.top]['start'][0] /
                (TOP_RANGE_INTERVAL + TOP_HEADER)
            )
          ] = interval_count;
          interval_count += 1;
          positionCount += 1;
        } else {
          if (
            filter_position[0].position.top !==
              filter_position[1].position.top &&
            Object.keys(top_filters).length > 1
          ) {
            Object.keys(top_filters).map((key: string) => {
              if (
                Math.ceil(
                  top_filters[key].start[0] / (TOP_RANGE_INTERVAL + TOP_HEADER)
                ) <=
                  Math.ceil(
                    filter_position[0].position.top /
                      (TOP_RANGE_INTERVAL + TOP_HEADER)
                  ) &&
                Math.ceil(
                  top_filters[key].end[0] / (TOP_RANGE_INTERVAL + TOP_HEADER)
                ) >=
                  Math.ceil(
                    filter_position[1].position.top /
                      (TOP_RANGE_INTERVAL + TOP_HEADER)
                  )
              ) {
                top_filters[filter_position[0].position.top] = {
                  start: [
                    filter_position[0].position.top +
                      (GANTO_HEIGHT + 2) * positionCount,
                  ],
                  end: [
                    filter_position[1].position.top +
                      (GANTO_HEIGHT + 2) * positionCount,
                  ],
                };
                top_filters[filter_position[1].position.top] = {
                  start: [
                    filter_position[1].position.top +
                      (GANTO_HEIGHT + 2) * positionCount,
                  ],
                  end: [
                    filter_position[1].position.top +
                      (GANTO_HEIGHT + 2) * positionCount,
                  ],
                };
                positionCount += 1;
                for (
                  let i = Math.ceil(
                    top_filters[key].start[0] /
                      (TOP_RANGE_INTERVAL + TOP_HEADER)
                  );
                  i <
                  Math.ceil(
                    top_filters[key].end[0] / (TOP_RANGE_INTERVAL + TOP_HEADER)
                  );
                  i++
                ) {
                  interval_index[i] = interval_count;
                }
                interval_count += 1;
              }
            });
          } else if (
            // if (
            filter_position[0].position.top !== filter_position[1].position.top
          ) {
            top_filters[filter_position[0].position.top] = {
              start: [filter_position[0].position.top],
              end: [filter_position[1].position.top],
            };
            top_filters[filter_position[1].position.top] = {
              start: [filter_position[1].position.top],
              end: [filter_position[1].position.top],
            };
            interval_index[
              Math.ceil(
                top_filters[filter_position[0].position.top]['start'][0] /
                  (TOP_RANGE_INTERVAL + TOP_HEADER)
              )
            ] = interval_count;
            interval_count += 1;
          } else {
            top_filters[filter_position[0].position.top] = {
              start: [filter_position[0].position.top],
              end: [filter_position[1].position.top],
            };
          }
        }

        // if (filter_position[1].position.top in top_filters) {
        //   let positionCount =
        //     top_filters[filter_position[0].position.top]['end'].length;
        //   top_filters[filter_position[0].position.top]['end'].push(
        //     filter_position[1].position.top + GANTO_HEIGHT * positionCount + 2
        //   );
        // } else {
        //   top_filters[filter_position[0].position.top]['end'] = [
        //     filter_position[1].position.top,
        //   ];
        // }

        const difference_raw =
          filter_position[1].position.top - filter_position[0].position.top !==
          0
            ? Math.ceil(
                (filter_position[1].position.top + TOP_HEADER) /
                  TOP_RANGE_INTERVAL
              ) -
              ((filter_position[0].position.top + TOP_HEADER) /
                TOP_RANGE_INTERVAL ===
              0
                ? 1
                : Math.ceil(
                    (filter_position[0].position.top + TOP_HEADER) /
                      TOP_RANGE_INTERVAL
                  ))
            : 0;

        if (difference_raw !== 0) {
          todoDifferenceLines = [];
          for (let i = 0; i <= difference_raw; i++) {
            let todoDifferenceLine = {
              index: i,
              up:
                i !== 0
                  ? top_filters[filter_position[0].position.top]['start'].slice(
                      -1
                    )[0] +
                    TOP_RANGE_INTERVAL * i
                  : top_filters[filter_position[0].position.top]['start'].slice(
                      -1
                    )[0],
              width:
                i === difference_raw
                  ? filter_position[1].position.left
                  : i === 0
                  ? 800 - filter_position[0].position.left
                  : 800,
              down: top_filters[filter_position[0].position.top]['end'][0],
            };
            todoDifferenceLines.push(todoDifferenceLine);
          }
        }

        todoCompLines.push({
          id: todo.id,
          up: top_filters[filter_position[0].position.top]['start'].slice(
            -1
          )[0],
          down: top_filters[filter_position[0].position.top]['end'].slice(
            -1
          )[0],
          left: filter_position[0].position.left,
          right: filter_position[1].position.left,
          next_flg:
            filter_position[0].date?.getMonth() !==
            filter_position[1].date?.getMonth(),
          difference_raw: difference_raw,
          difference_lines: todoDifferenceLines,
          color: color_list[index],
        });
      }
    });
    setTodoCompLines(todoCompLines);
  }, [datePositions, todoList]);

  return (
    <>
      <tbody className="w-[800px]">
        {day_of_week_calendar_list.map((day_of_week_calendar_raw) => {
          return (
            <tr
              key={day_of_week_calendar_raw['Sun'].date?.toDateString()}
              className="border-black"
            >
              <td
                className={`border-1 p-1 text-center border-black bg-red-200 w-[114px] h-[113px] ${
                  day_of_week_calendar_raw['Sun'].date?.getMonth() !==
                  current_month - 1
                    ? 'text-slate-400'
                    : 'text-red-400'
                }`}
              >
                {day_of_week_calendar_raw['Sun'].num}
              </td>
              <td
                className={`border-1 p-1 text-center w-[114px] h-[113px] border-black ${
                  day_of_week_calendar_raw['Mon'].date?.getMonth() !==
                  current_month - 1
                    ? 'text-slate-400'
                    : 'text-black'
                }`}
              >
                {day_of_week_calendar_raw['Mon'].num}
              </td>
              <td
                className={`border-1 p-1 text-center w-[114px] h-[113px] border-black ${
                  day_of_week_calendar_raw['Tue'].date?.getMonth() !==
                  current_month - 1
                    ? 'text-slate-400'
                    : 'text-black'
                }`}
              >
                {day_of_week_calendar_raw['Tue'].num}
              </td>
              <td
                className={`border-1 p-1 text-center w-[114px] h-[113px] border-black ${
                  day_of_week_calendar_raw['Wed'].date?.getMonth() !==
                  current_month - 1
                    ? 'text-slate-400'
                    : 'text-black'
                }`}
              >
                {day_of_week_calendar_raw['Wed'].num}
              </td>
              <td
                className={`border-1 p-1 text-center w-[114px] h-[113px] border-black ${
                  day_of_week_calendar_raw['Thu'].date?.getMonth() !==
                  current_month - 1
                    ? 'text-slate-400'
                    : 'text-black'
                }`}
              >
                {day_of_week_calendar_raw['Thu'].num}
              </td>
              <td
                className={`border-1 p-1 text-center w-[114px] h-[113px] border-black ${
                  day_of_week_calendar_raw['Fri'].date?.getMonth() !==
                  current_month - 1
                    ? 'text-slate-400'
                    : 'text-black'
                }`}
              >
                {day_of_week_calendar_raw['Fri'].num}
              </td>
              <td
                className={`border-1 p-1 text-center w-[114px] h-[113px] border-black ${
                  day_of_week_calendar_raw['Sat'].date?.getMonth() !==
                  current_month - 1
                    ? 'text-slate-400'
                    : 'text-red-400'
                }`}
              >
                {day_of_week_calendar_raw['Sat'].num}
              </td>
            </tr>
          );
        })}
      </tbody>
      {todoList.flatMap((todo) =>
        todoCompLines
          .filter((todoComp) => todoComp.id === todo.id)
          .flatMap((todoComp) =>
            todoComp.difference_raw !== 0 && todoComp.difference_lines
              ? todoComp.difference_lines.map((difference_line, i) => (
                  <div
                    key={`${todoComp.id}_${i}`}
                    className={`${
                      colorClassMap[todoComp.color] ?? 'bg-gray-600'
                    } absolute rounded-lg text-center text-[8px] font-bold h-[${GANTO_HEIGHT}px] px-2 opacity-70`}
                    style={{
                      top: difference_line.up,
                      left: difference_line.index === 0 ? todoComp.left : 0,
                      width: difference_line.width,
                    }}
                    ref={(node) => {
                      if (node) {
                        if (!divRefs.current[todo.id])
                          divRefs.current[todo.id] = [];
                        divRefs.current[todo.id].push(node);
                      }
                    }}
                  >
                    <p>{todo.title}</p>
                  </div>
                ))
              : [
                  <div
                    key={`${todoComp.id}_single`}
                    className={`${
                      colorClassMap[todoComp.color] ?? 'bg-gray-600'
                    } absolute rounded-lg text-center text-[10px]  font-bold h-[${GANTO_HEIGHT}px] px-2 opacity-70`}
                    style={{
                      top: todoComp.up,
                      left: todoComp.left,
                      width:
                        todoComp.right - todoComp.left === 0
                          ? LEFT_RANGE_INTERVAL
                          : todoComp.right - todoComp.left,
                    }}
                  >
                    <p>{todo.title}</p>
                  </div>,
                ]
          )
      )}
    </>
  );
};
