"use client";
import { clsx } from "@core/client";
import { st, usePage } from "@shared/client";

interface InsightProps<T extends string, Insight> {
  className?: string;
  insight: Insight;
  sliceName: T;
  columns?: (keyof Insight)[];
}

export default function Insight<T extends string, Insight>({
  className,
  insight,
  sliceName,
  columns,
}: InsightProps<T, Insight>) {
  const { l } = usePage();
  const refName = st.slice[sliceName as "admin"].refName;
  return (
    <div className={clsx("stats my-2 flex w-full flex-wrap justify-center py-2 shadow ", className)}>
      <div className="stats">
        {columns?.map(
          (column: keyof Insight, idx) =>
            insight[column] !== undefined && (
              <div key={idx} className="stat mx-1 flex items-center rounded-none">
                <div className="stat-title">{l.field(refName, column as string)}</div>
                <div className="stat-value text-xl">{(insight[column] as string).toLocaleString()}</div>
              </div>
            )
        )}
      </div>
    </div>
  );
}
