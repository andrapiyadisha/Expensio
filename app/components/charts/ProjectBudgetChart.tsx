"use client";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ProjectBudgetChart() {
  return (
    <div className="bg-background-card border border-border-main rounded-xl p-8 transition-all duration-300 group hover:border-blue-500/30 shadow-xl shadow-black/20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary group-hover:text-blue-400 transition-colors">Capital Utilization</h3>
          <p className="text-[8px] font-bold text-text-secondary opacity-50 uppercase tracking-widest mt-1">Budget vs Actual Performance</p>
        </div>
        <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md text-[8px] font-black text-blue-400 uppercase tracking-widest shadow-sm">
          Analytics
        </div>
      </div>

      <div className="h-64">
        <Bar
          data={{
            labels: ["Website", "Mobile App", "CRM", "Marketing"],
            datasets: [
              {
                label: "Allocation",
                data: [200000, 300000, 150000, 100000],
                backgroundColor: "rgba(59, 130, 246, 0.8)", 
                borderColor: "rgba(59, 130, 246, 1)",
                borderWidth: 1,
                borderRadius: 4,
              },
              {
                label: "Outflow",
                data: [140000, 260000, 90000, 75000],
                backgroundColor: "rgba(244, 63, 94, 0.8)", 
                borderColor: "rgba(244, 63, 94, 1)",
                borderWidth: 1,
                borderRadius: 4,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  color: '#94a3b8',
                  font: { size: 10, weight: 600 },
                  padding: 20,
                  boxWidth: 10,
                  boxHeight: 10,
                  usePointStyle: true,
                }
              },
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
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: '#94a3b8', font: { size: 10, weight: 600 } }
              },
              y: {
                grid: { color: 'rgba(51, 65, 85, 0.4)' },
                ticks: { color: '#94a3b8', font: { size: 10 } }
              },
            },
          }}
        />
      </div>
    </div>
  );
}
