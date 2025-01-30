import {DatabaseViewIconBoard, DatabaseViewIconCalendar, DatabaseViewIconTable,} from "#components";
import TableFieldType from "~/types/database/TableFieldType";
import type DatabaseView from "~/types/database/DatabaseView";

enum DatabaseViewType {
    TableView = 'table',
    CalendarView = 'calendar',
    BoardView = 'board',
}

export default DatabaseViewType

export const DATABASE_TABLE_MIN_WIDTH = 150;

export function getViewTypeIcon(type: DatabaseViewType) {
    if (type === DatabaseViewType.TableView) return DatabaseViewIconTable;
    else if (type === DatabaseViewType.CalendarView) return DatabaseViewIconCalendar;
    else if (type === DatabaseViewType.BoardView) return DatabaseViewIconBoard;
    else return "";
}

export function getViewTargetFieldTypes(view: DatabaseView): TableFieldType[] | null {
    switch (view.type) {
        case DatabaseViewType.CalendarView:
        case DatabaseViewType.BoardView:
            return [TableFieldType.BooleanType, TableFieldType.SelectType]
        default:
            return null;
    }
}
