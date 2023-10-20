export const fetcher = (url: string, data?: RequestInit) => {
	return fetch("/api" + url, data).then(res => res.json());
};

export const getSchedule = ([class_range, day]: string[]) => {
	return fetcher(`/schedule/${class_range}/${day}`);
};