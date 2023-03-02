export const periods = ['1st', '2nd', '3rd', 'OT', 'SO'] as const;
export type Period = typeof periods[number];
