export const formatDuration = (ms: number): string => {
    const totalSec = Math.floor(ms / 1000);
    const hr = Math.floor(totalSec / 3600);
    const min = Math.floor((totalSec % 3600) / 60);
    const sec = totalSec % 60;

    if (hr > 0) {
        return `${hr}:${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
    }
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

export const parseDuration = (input: string): number | null => {
    const cleaned = input.trim().replace(/[^0-9]+/g, ':').replace(/^:+|:+$/g, '');
    if (cleaned.length === 0) return null;

    const parts = cleaned.split(':');
    if (parts.some((p) => !/^\d+$/.test(p))) return null;

    const numbers = parts.map(Number);
    let totalSeconds: number;

    if (numbers.length === 1) {
        totalSeconds = numbers[0];
    } else if (numbers.length === 2) {
        const [min, sec] = numbers;
        if (sec >= 60) return null;
        totalSeconds = min * 60 + sec;
    } else if (numbers.length === 3) {
        const [hr, min, sec] = numbers;
        if (min >= 60 || sec >= 60) return null;
        totalSeconds = hr * 3600 + min * 60 + sec;
    } else {
        return null;
    }

    return totalSeconds * 1000;
};