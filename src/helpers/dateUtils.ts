export function getDateFromSeconds(seconds: number): Date {
    const epoch = new Date(1970, 0, 1);
    epoch.setSeconds(seconds);

    return epoch;
}
