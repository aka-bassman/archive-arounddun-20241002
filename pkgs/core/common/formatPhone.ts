export const formatPhone = (value: string) => {
  // const comp = value.length > 6 && value[0] === "0" ? value.slice(1) : value;
  // return value.length > 6 && value[0] === "0" ? value.slice(1) : value;
  if (!value) return "";
  if (value.length === 10) return value.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  else if (value.length === 13) return value.replace(/-/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  else return value;
};
