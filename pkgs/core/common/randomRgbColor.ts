export const randomRgbColor = () => {
  // const hash = string
  //   ? string.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  //   : Math.floor(Math.random() * 1000);
  // const r = (hash & 0xff0000) >> 16;
  // const g = (hash & 0x00ff00) >> 8;
  // const b = hash & 0x0000ff;
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};
