export const timeFromLocal = (time: string) => {
    const formattedTime = (/(\d{2}):(\d{2})/gm).exec(time);
    if (formattedTime === null) throw new Error("Неправильный формат времени");

    const localTimeMinutes = Number(formattedTime[1]) * 60 + Number(formattedTime[2]);

    const offset = new Date().getTimezoneOffset();
    const utcTimeMinutes = localTimeMinutes + offset;
    const utcHours = Math.floor(utcTimeMinutes / 60);
    const utcMinutes = utcTimeMinutes % 60;

    return [utcHours, utcMinutes];
};

export const timeToLocal = (time: number[]) => {
    if (time.length != 2 || typeof time[0] != "number" || typeof time[1] != "number")
        throw new Error("Неправильный формат времени");

    const utcTimeMinutes = time[0] * 60 + time[1];
    const offset = new Date().getTimezoneOffset();
    const localTimeMinutes = utcTimeMinutes - offset;
    const localHours = Math.floor(localTimeMinutes / 60);
    const localMinutes = utcTimeMinutes % 60;

    return (localHours < 10 ? "0" : "") + localHours + ":" + (localMinutes < 10 ? "0" : "") + localMinutes;
};