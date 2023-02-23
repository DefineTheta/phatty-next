export const truncateAddress = (add: string) => {
  return `${(add || '').slice(0, 4)}...${(add || '').slice((add || '').length - 4)}`;
};

export const truncateAddressList = (addresses: string[]) => {
  return addresses.reduce(
    (name, address, index) => `${index !== 0 ? `${name} |` : ''} ${truncateAddress(address)}`,
    ''
  );
};

export const roundToPrecision = (amount: number, precision: number) => {
  return Math.round((amount + Number.EPSILON) * Math.pow(10, precision)) / Math.pow(10, precision);
};

export const timestampToDate = (timestamp: number) => {
  const date = new Date(timestamp);

  return `${date.toLocaleDateString()}`;
};
