export const moveCenter = (...points: [number, number][]): [number, number] => {
  return points.reduce((acc, cur) => [acc[0] + cur[0], acc[1] + cur[1]]);
};
