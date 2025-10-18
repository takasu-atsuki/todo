import { SlArrowLeft } from 'react-icons/sl';
import { SlArrowRight } from 'react-icons/sl';

export const ChoiceCalendar = ({
  current_year,
  current_month,
  choiceDate,
  setChoiceDate,
}: {
  current_year: number;
  current_month: number;
  choiceDate: Date;
  setChoiceDate: React.Dispatch<React.SetStateAction<Date>>;
}) => {
  const calendarUpdateButtonClick = (direction: string) => {
    if (direction === 'left') {
      current_month == 1
        ? setChoiceDate(
            new Date(current_year, current_month - 2, choiceDate.getDate())
          )
        : setChoiceDate(
            new Date(current_year, current_month - 2, choiceDate.getDate())
          );
    } else {
      current_month == 12
        ? setChoiceDate(
            new Date(current_year, current_month, choiceDate.getDate())
          )
        : setChoiceDate(
            new Date(current_year, current_month, choiceDate.getDate())
          );
    }
  };

  return (
    <div className="flex justify-around items-center mt-2">
      <button onClick={() => calendarUpdateButtonClick('left')}>
        <h1 className="text-2xl font-extrabold tracking-[10px]">
          <SlArrowLeft />
        </h1>
      </button>
      <h1 className="text-3xl font-extrabold tracking-[10px]">
        {`${current_year}/${current_month}`}
      </h1>
      <button onClick={() => calendarUpdateButtonClick('right')}>
        <h1 className="text-2xl font-extrabold tracking-[10px]">
          <SlArrowRight />
        </h1>
      </button>
    </div>
  );
};
