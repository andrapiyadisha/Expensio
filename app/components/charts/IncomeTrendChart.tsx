"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

export default function IncomeTrendChart() {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
      <h3 className="font-semibold mb-4">Income Trend</h3>

      <Line
        data={{
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          datasets: [
            {
              label: "Income",
              data: [12000, 18000, 15000, 22000],
              borderColor: "#10b981",
              backgroundColor: "rgba(16,185,129,0.2)",
              tension: 0.4,
            },
          ],
        }}
        options={{
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: "#e5e7eb" } },
          },
        }}
      />
    </div>
  );
}
