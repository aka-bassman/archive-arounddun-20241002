"use client";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line as LineChart } from "react-chartjs-2";
import type { ChartProps } from "react-chartjs-2/dist/types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type PropsType = Omit<ChartProps<"line">, "type">;
export default function Line(props: PropsType) {
  return (
    <LineChart
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        },
        ...props.options,
      }}
      {...props}
    />
  );
}
