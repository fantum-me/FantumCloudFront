import {
    DatabaseViewIconBoard,
    DatabaseViewIconCalendar,
    DatabaseViewIconTable,
    DatabaseViewIconTimeline
} from "#components";

enum DatabaseViewType {
    TableView = 'table',
    CalendarView = 'calendar',
    BoardView = 'board',
    TimelineView = 'timeline',
}

export default DatabaseViewType

export const DATABASE_TABLE_MIN_WIDTH = 150;

export function getViewTypeIcon(type: DatabaseViewType) {
    if (type === DatabaseViewType.TableView) return DatabaseViewIconTable;
    else if (type === DatabaseViewType.CalendarView) return DatabaseViewIconCalendar;
    else if (type === DatabaseViewType.BoardView) return DatabaseViewIconBoard;
    else if (type === DatabaseViewType.TimelineView) return DatabaseViewIconTimeline;
    else return "";
}
