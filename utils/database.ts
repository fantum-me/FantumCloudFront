import type TableField from "~/types/database/TableField";
import type Database from "~/types/database/Database";

export const repositionField = (database: Database, id: string, newPosition: number) => {
    const field = database.fields?.find(f => f.id === id) as TableField
    const currentPosition = field.position
    const targetPosition = (database.fields?.find(f => f.position === newPosition) as TableField).position

    database.fields?.forEach((f) => {
        if (f.id === field.id) {
            f.position = targetPosition;
        } else if (currentPosition < targetPosition && f.position > currentPosition && f.position <= targetPosition) {
            f.position--;
        } else if (currentPosition > targetPosition && f.position < currentPosition && f.position >= targetPosition) {
            f.position++;
        }
    });

    database.fields?.sort((a, b) => a.position - b.position)
}
