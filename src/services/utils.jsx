export function sanitizeNulls(obj) {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, value === null ? "" : value]));
}
