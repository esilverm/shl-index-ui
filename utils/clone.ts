// NOTE: I was having trouble with using structuredClone for some reason so we have to use
// this instead which kinda sucks but it does the job. We should attempt to remove
// this in a year or whenever I find this file again.

export function clone<T>(a: T): T {
  return JSON.parse(JSON.stringify(a));
}
