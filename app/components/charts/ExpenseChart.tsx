import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

export default function ExpenseChart({ labels = [], expenses = [], incomes = [] }: { labels?: string[], expenses?: number[], incomes?: number[] }) {
  const [filter, setFilter] = useState<'both' | 'income' | 'expense'>('both');

  const data = {
    labels: labels.length > 0 ? labels : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Income",
        data: incomes.length > 0 ? incomes : [6500, 7200, 8100, 7800, 9200, 10750],
        backgroundColor: "rgba(59, 130, 246, 0.8)", 
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 4,
        hidden: filter === 'expense',
      },
      {
        label: "Expense",
        data: expenses.length > 0 ? expenses : [5000, 4200, 6100, 4800, 7200, 8750],
        backgroundColor: "rgba(244, 63, 94, 0.8)", 
        borderColor: "rgba(244, 63, 94, 1)",
        borderWidth: 1,
        borderRadius: 4,
        hidden: filter === 'income',
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
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        borderColor: '#334155',
        borderWidth: 1,
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
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-text-primary">Monthly Performance</h3>
          <p className="text-[10px] font-bold text-muted mt-1 uppercase opacity-60">Financial Trends</p>
        </div>

        <div className="flex bg-background-main p-1 rounded-xl border border-border-main self-end sm:self-auto">
          {(['both', 'income', 'expense'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === type
                ? "bg-foreground text-background shadow-lg"
                : "text-muted hover:text-foreground"
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex-grow min-h-[300px]">
        <Bar data={data} options={options as any} />
      </div>
    </div>
  );
}
