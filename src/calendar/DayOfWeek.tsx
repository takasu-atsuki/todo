import { Day_of_week_date } from '../type';

export const DayOfWeek = ({}: {}) => {
  //曜日確定のためのリスト(取得したインデックスをこれで使用する)
  const day_of_week_list = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <thead className="border-1">
      <tr className="">
        {day_of_week_list.map((youbi) => {
          return (
            <th
              key={youbi}
              className={`border-1 p-1 text-center ${
                youbi == 'Sun' && 'bg-red-200'
              } ${youbi == 'Sat' && 'bg-blue-200'}`}
            >
              {youbi}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
