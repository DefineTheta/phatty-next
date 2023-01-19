export const getPositiveOrZero = (num?: number) => {
  if (!num || num < 0) return 0;
  else return num;
};
