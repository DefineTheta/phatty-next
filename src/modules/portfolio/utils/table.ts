export const tableSort = (data: any[], key: string, order: 'asc' | 'desc') => {
  return data
    .slice()
    .sort(
      (a, b) => (parseFloat(a[key]) > parseFloat(b[key]) ? 1 : -1) * (order === 'asc' ? 1 : -1)
    );
};
