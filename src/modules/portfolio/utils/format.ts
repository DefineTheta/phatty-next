export const formatWithCommas = (num: number) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const roundToPrecision = (amount: number, precision: number) => {
  return Math.round((amount + Number.EPSILON) * Math.pow(10, precision)) / Math.pow(10, precision);
};

export const formatToMoney = (num: number) => {
  return `$${formatWithCommas(roundToPrecision(num, 2))}`;
};

export const styleNumber = (num: number, precision = 2) => {
  return formatWithCommas(roundToPrecision(num, precision));
};
