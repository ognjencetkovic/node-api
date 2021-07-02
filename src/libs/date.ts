import moment from 'moment';

export function getCurrentTimestampInUnix(): number {
    return moment().unix();
}

export function getTimestampInDays(days: number): string {
    return moment().add(days, `days`).toISOString();
}
