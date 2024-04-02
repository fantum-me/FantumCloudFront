export const formatSize = (size: number): string => {
    if (size === 0) return "0"
    const suffixes = ["bytes", "kB", "MB", "GB", "TB"];
    let magnitude = 0;

    while (size >= 1024) {
        size /= 1024;
        magnitude++;
    }

    const num = size.toFixed(size % 1 < 0.1 ? 0 : 1)

    return num + " " + suffixes[magnitude];
}
