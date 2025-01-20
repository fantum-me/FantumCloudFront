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

    return dateString.split(",").map(d => format(d)).join(" → ")
}

export const areDateStringsEqual = (d1: string, d2: string) => {
    if (!d1 || !d2) return false;
    const date2 = new Date(d2);

    // Check if d1 a date range
    if (d1.includes(",")) {
        const date1Start = new Date(d1.split(",")[0])
        const date1End = new Date(d1.split(",")[1])
        if (rangesOverlap(date1Start.getTime(), date1End.getTime(), date2.getTime(), date2.getTime())) return true
        else return areSameDay(date1Start, date2) || areSameDay(date1End, date2)
    } else {
        const date1 = new Date(d1);
        return areSameDay(date1, date2);
    }
}
