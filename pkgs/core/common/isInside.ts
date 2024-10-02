export const isInside = (
  [x, y]: [number, number],
  { center, wh }: { center: [number, number]; wh: [number, number] }
) => {
  return (
    center[0] + wh[0] / 2 > x && x > center[0] - wh[0] / 2 && center[1] + wh[1] / 2 > y && y > center[1] - wh[1] / 2
  );
};
