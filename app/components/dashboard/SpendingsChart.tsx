"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend as ChartLegend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, ChartLegend);

export default function SpendingsChart({ data: inputData = [] }: { data?: any[] }) {
  const chartValues = inputData.length > 0 ? inputData.map(d => d.value) : [892, 723, 956, 630];
  const chartLabels = inputData.length > 0 ? inputData.map(d => d.label) : ["Food", "Travel", "Entertainment", "Business"];

  const data = {
    labels: chartLabels,
    datasets: [
      {
        data: chartValues,
        backgroundColor: [
          "#6366f1",
          "#8b5cf6",
          "#3b82f6",
          "#0ea5e9",
          "#64748b", 
        ],
        borderWidth: 2,
        borderColor: "#1e293b",
        hoverBorderColor: "#f1f5f9",
        hoverOffset: 10,
        cutout: "80%",
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: '#334155',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      }
    },
  };

  const total = chartValues.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-background-card border border-border-main rounded-xl p-8 transition-all duration-300">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 text-muted">Spending Allocation</h3>

      <div className="relative h-64 flex items-center justify-center">
        <Doughnut data={data} options={options} />
        <div className="absolute text-center">
          <p className="text-sm font-black uppercase tracking-widest text-muted">Total</p>
          <p className="text-2xl font-black text-text-primary tracking-tighter">₹{total.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-3 mt-10">
        {chartLabels.map((label, idx) => (
          <ChartLegendItem
            key={idx}
            color={data.datasets[0].backgroundColor[idx] as string}
            label={label}
            value={`₹${chartValues[idx].toLocaleString()}`}
          />
        ))}
      </div>
    </div>
  );
}

function ChartLegendItem({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border-main/50 group transition-all">
      <div className="flex items-center gap-3">
        <span
          className="w-2 h-2 rounded-full border border-border-main"
          style={{ backgroundColor: color }}
        />
        <span className="text-xs font-bold text-muted uppercase tracking-wider group-hover:text-text-primary transition-colors">{label}</span>
      </div>
      <span className="text-xs font-black text-text-primary">{value}</span>
    </div>
  );
}
