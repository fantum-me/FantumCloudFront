import type {BadgeColor} from "#ui/types";

export function getContrastColor(hex: string) {
    const color = hexToRgb(hex)
    if (!color) return true
    console.log(color.r * 299 + color.g * 587 + color.b * 114)
    return (color.r * 299 + color.g * 587 + color.b * 114) >= 150000 ? "#000" : "#fff";
}


function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export const TABLE_FIELD_SELECT_COLORS: BadgeColor[] = ["red", "orange", "amber", "lime", "green", "cyan", "blue", "indigo", "fuchsia", "pink"];
