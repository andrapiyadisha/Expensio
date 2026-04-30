"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
);

export default function ExpenseTrendChart({ labels = [], data: inputData = [] }: { labels?: string[], data?: number[] }) {
  const data = {
    labels: labels.length > 0 ? labels : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Trend Index",
        data: inputData.length > 0 ? inputData : [500, 1200, 800, 1500, 900, 2000, 1750],
        borderColor: "#6366f1",
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, "rgba(99, 102, 241, 0)");
          gradient.addColorStop(1, "rgba(99, 102, 241, 0.2)");
          return gradient;
        },
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#6366f1",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 2,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        displayColors: false,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 10, weight: 600 } }
      },
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.4)', drawBorder: false },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      },
    },
  };

  return (
    <div className="bg-background-card border border-border-main rounded-xl p-8 transition-all duration-300 group hover:border-indigo-500/30 shadow-xl shadow-black/20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary group-hover:text-indigo-400 transition-colors">Momentum Matrix</h3>
          <p className="text-[8px] font-bold text-text-secondary opacity-50 uppercase tracking-widest mt-1">Resource flow analysis</p>
        </div>
        <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-[8px] font-black text-indigo-400 uppercase tracking-widest shadow-sm">
          Real-time
        </div>
      </div>
      <div className="h-64">
        <Line data={data} options={options as any} />
      </div>
    </div>
  );
}
