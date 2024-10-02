import { Logger } from "./Logger";

interface PageForm<Output> {
  name: string;
  fn: (from: number, to: number) => Promise<Output[]>;
  from?: number;
  to: number;
  step: number;
}
export const pageProcess = async <Output>({ name, fn, from = 0, to, step }: PageForm<Output>): Promise<Output[]> => {
  Logger.log(`${name} Page Job Started`);
  const res: Output[] = [];
  for (let i = from; i < to; i += step) {
    Logger.log(`${name} Page Job Processing... ${i}/${to - from}`);
    const data = await fn(i, Math.min(i + step, to));
    res.push(...data);
  }
  Logger.log(`${name} Page Job Completed ${to - from}/${to - from}`);
  return res;
};
