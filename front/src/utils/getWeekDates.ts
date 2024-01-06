export const getWeekDates = () => {
    return [...Array(7).keys()].map((i) => {
        const date = new Date();
        date.setDate(date.getDate() - date.getDay() + i + 1);
        return date.getDate();
    });
};