export const getPeriodicType = (now = new Date()): ["monthly" | "weekly" | "daily" | "hourly", Date] => {
  now.setMinutes(0, 0, 0);
  const [hour, weekDay, date] = [now.getHours(), now.getDay(), now.getDate()];
  const type =
    date === 1 && hour === 0 ? "monthly" : weekDay === 0 && hour === 0 ? "weekly" : hour === 0 ? "daily" : "hourly";
  return [type, now];
};
