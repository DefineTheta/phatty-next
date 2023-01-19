export const addObjects = <
  T extends { [key: string]: number },
  K extends { [key: string]: number }
>(
  a: T,
  b: K
): T & K => {
  const c: { [key: string]: number } = {};

  [a, b].forEach((obj) =>
    Object.keys(obj).forEach((key) => {
      c[key] = (c[key] || 0) + obj[key];
    })
  );

  return c as T & K;
};
