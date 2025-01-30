import type TableRecord from "~/types/database/TableRecord";
import type TableField from "~/types/database/TableField";

export const getWeekStart = (week: Date[]) => new Date(week[0].getFullYear(), week[0].getMonth(), week[0].getDate(), 0, 0, 0, 0);
export const getWeekEnd = (week: Date[]) => {
    const lastDate = week.at(-1) as Date;
    return new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + 1, 0, 0, 0, 0);
}

export const dateInWeek = (week: Date[], date: Date) => date >= getWeekStart(week) && date <= getWeekEnd(week)
export const dateRangeInWeek = (week: Date[], d1: Date, d2: Date) => {
    const start = getWeekStart(week), end = getWeekEnd(week);
    return (d1 >= start && d1 <= end) || (d2 >= start && d2 <= end) || (d1 < start && d2 > end)
}

export const getDisplayedWeekDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1, 0, 0, 0, 0);
    const firstDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    firstDay.setDate(firstDay.getDate() - firstDayIndex);

    const lastDay = new Date(year, month + 1, 0, 0, 0, 0, 0);
    const lastDayIndex = lastDay.getDay() === 0 ? 6 : lastDay.getDay() - 1;
    lastDay.setDate(lastDay.getDate() + (6 - lastDayIndex));

    const totalDays = Math.ceil((lastDay.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const calendarDays: Date[] = [];
    for (let i = 0; i < totalDays; i++) {
        const currentDate = new Date(firstDay);
        currentDate.setDate(firstDay.getDate() + i);
        calendarDays.push(currentDate);
    }

    return calendarDays;
}

export const calculateWeeks = (currentDate: Date, records: TableRecord[], targetField: TableField) => {
    type Week = {
        days: Date[],
        events: {
            record: TableRecord,
            startIndex: number,
            endIndex: number,
            position: number,
            isStart: boolean,
            isEnd: boolean,
        }[]
    }

    const daysToAdd = getDisplayedWeekDays(currentDate)
    const weeks: Week[] = [];

    while (daysToAdd.length > 0) {
        weeks.push({
            days: daysToAdd.splice(0, 7),
            events: []
        });
    }

    weeks.forEach(week => {
        if (!targetField) return
        const weekStart = getWeekStart(week.days), weekEnd = getWeekEnd(week.days);

        for (const record of records) {
            const value = record.values[targetField.id]
            if (!value) continue;

            const dates = record.values[targetField.id].split(',').map(d => new Date(d))
            const startDate = dates[0]
            const endDate = dates.at(-1) as Date

            if (!rangesOverlap(weekStart.getTime(), weekEnd.getTime(), startDate.getTime(), endDate.getTime())) continue;

            const startIndex = startDate <= weekStart ? 0 : startDate.getDay() === 0 ? 6 : startDate.getDay() - 1
            const endIndex = endDate >= weekEnd || endDate.getDay() === 0 ? 6 : endDate.getDay() - 1

            let position = 0
            while (week.events.find(e => e.position === position && rangesOverlap(e.startIndex, e.endIndex, startIndex, endIndex))) {
                position++
            }

            week.events.push({
                record: record,
                startIndex: startIndex,
                endIndex: endIndex,
                position: position,
                isStart: dates[0] >= weekStart,
                isEnd: endDate <= weekEnd
            })
        }
    })

    return weeks
}
