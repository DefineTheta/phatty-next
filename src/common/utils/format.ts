export const truncateAddress = (add: string) => {
  return `${(add || '').slice(0, 4)}...${(add || '').slice((add || '').length - 4)}`;
};

export const roundToPrecision = (amount: number, precision: number) => {
  return Math.round((amount + Number.EPSILON) * Math.pow(10, precision)) / Math.pow(10, precision);
};

export const timestampToDate = (timestamp: number) => {
  const date = new Date(timestamp);

  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};
