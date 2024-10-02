export const getBox = (
  edge: { x: number; y: number },
  point: [number, number]
): { center: [number, number]; wh: [number, number] } => {
  const wh: [number, number] = [
    Math.abs(Math.floor(edge.x - point[0])) + 4,
    Math.abs(Math.floor(edge.y - point[1])) + 4,
  ];
  const center: [number, number] = [Math.floor((edge.x + point[0]) / 2), Math.floor((edge.y + point[1]) / 2)];
  return { center, wh };
};
