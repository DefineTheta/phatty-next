import { roundToPrecision } from '@app-src/common/utils/format';

export const formatWithCommas = (num: number) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const formatToMoney = (num: number) => {
  return `$${formatWithCommas(roundToPrecision(num, 2))}`;
};

export const styleNumber = (num: number, precision = 2) => {
  return formatWithCommas(roundToPrecision(num, precision));
};
