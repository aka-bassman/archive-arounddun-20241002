export const isIn = (
  { x, y }: { x: number; y: number },
  { center, wh }: { center: [number, number]; wh: [number, number] }
) => {
  return center[0] + wh[0] > x && x > center[0] - wh[0] && center[1] + wh[1] > y && y > center[1] - wh[1];
};
