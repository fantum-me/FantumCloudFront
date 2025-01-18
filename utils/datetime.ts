export const getTodayNoon = () => new Date(new Date().setHours(12, 0, 0, 0))

export const getTheNextDay = (date: Date) => new Date(date.getTime() + 86400000)

export const areSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

export const formatDatetimeToString = (dateString: string) => {
    const format = (dateString: string) => {
        const date = new Date(dateString);
        const isTimePresent = dateString.includes("T");

        const options: any = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        if (isTimePresent) {
            options.hour = '2-digit';
            options.minute = '2-digit';
            options.hour12 = false; // 24-hour format
        }

        return date.toLocaleString('en-US', options).replace(" at ", " ");
    }

    return dateString.split(",").map(d => format(d)).join("\n")
}
