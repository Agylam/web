import moment from "moment";
//fixme кастомные хуки нужны, чтобы подцепится к фичам React-а. А тут вроде всё нативно, можно просто функцию создать
export const useWeekDates = () => {
    const currentDate = moment();
    const weekStart = currentDate.clone().startOf("isoWeek");
    const weekDates = [];

    for (let i = 0; i <= 6; i++) {
        weekDates.push(moment(weekStart).add(i, "days").date());
    }

    return weekDates;
};
