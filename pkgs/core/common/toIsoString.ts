export const toIsoString = (date: Date, skipTime?: boolean) => {
  return skipTime ? new Date(date).toISOString().slice(0, 10) : new Date(date).toISOString();
};
