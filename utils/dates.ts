// utils/dates.ts
export function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const dd   = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function getDateNDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return formatDate(d);
}

export const dates = {
  startDate: getDateNDaysAgo(3), // 3 days ago
  endDate  : getDateNDaysAgo(1)  // yesterday
};
