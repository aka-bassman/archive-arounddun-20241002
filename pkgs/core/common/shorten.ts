export const shorten = (data: string | number, totalLength = 8, padNum = 3, padChar = ".") => {
  const str = String(data);
  if (str.length <= totalLength) return String(data);
  return str.slice(0, totalLength - padNum) + padChar.repeat(padNum);
};
