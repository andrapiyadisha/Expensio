"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend as ChartLegend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, ChartLegend);

export default function IncomeSourceChart({ data: inputData = [] }: { data?: any[] }) {
  const chartValues = inputData.length > 0 ? inputData.map(d => d.value) : [25000, 8000, 3000];
  const chartLabels = inputData.length > 0 ? inputData.map(d => d.label) : ["Salary", "Freelance", "Bonus"];

  return (
    <div className="bg-background-card border border-border-main rounded-xl p-8 transition-all duration-300">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 text-muted">Income Sources</h3>

      <div className="relative h-64 flex items-center justify-center">
        <Doughnut
          data={{
            labels: chartLabels,
            datasets: [
              {
                data: chartValues,
                backgroundColor: [
                  "#10b981",
                  "#14b8a6",
                  "#06b6d4",
                  "#0891b2", 
                  "#0d9488", 
                ],
                borderWidth: 2,
                borderColor: "#1e293b",
                hoverBorderColor: "#f1f5f9",
                hoverOffset: 10,
              },
            ],
          }}
          options={{
            cutout: "80%",
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
          }}
        />
        <div className="absolute text-center group-hover:scale-110 transition-transform duration-500">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60">Liquidity</p>
          <p className="text-xl font-black text-text-primary tracking-tighter drop-shadow-sm">Growth</p>
        </div>
      </div>
    </div>
  );
}
