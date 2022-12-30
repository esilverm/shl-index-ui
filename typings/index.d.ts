// Utility type to get keys of object in object literal
type Keys<T> = T extends { [key: string]: any } ? keyof T : never;
