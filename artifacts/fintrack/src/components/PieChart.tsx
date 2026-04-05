import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CAT_COLORS } from '../data/transactions';

declare const Chart: any;

function fmtFull(n: number) { return '₹' + n.toLocaleString('en-IN'); }

export default function PieChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);
  const { transactions, theme } = useApp();

  useEffect(() => {
    if (!canvasRef.current) return;
    const expenses = transactions.filter(t => t.type === 'expense');
    const catTotals: Record<string, number> = {};
    expenses.forEach(t => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount; });
    const labels = Object.keys(catTotals).sort((a, b) => catTotals[b] - catTotals[a]).slice(0, 7);
    const data = labels.map(l => catTotals[l]);
    const colors = labels.map(l => CAT_COLORS[l] || '#6b7280');
    const isDark = theme === 'dark';

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 6 }] },
      options: {
        responsive: true, cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: isDark ? '#9ca3af' : '#6b7280', font: { size: 11, family: 'DM Sans' }, padding: 12, boxWidth: 10, boxHeight: 10 }
          },
          tooltip: {
            backgroundColor: isDark ? '#181b22' : '#fff',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            borderWidth: 1, titleColor: isDark ? '#f0f2f8' : '#0d0f14',
            bodyColor: isDark ? '#9ca3af' : '#6b7280',
            callbacks: { label: (ctx: any) => ` ${ctx.label}: ${fmtFull(ctx.parsed)}` }
          }
        }
      }
    });

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [transactions, theme]);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <div className="chart-title">Spending by Category</div>
          <div className="chart-meta">All time expenses</div>
        </div>
      </div>
      <canvas ref={canvasRef} height={200}></canvas>
    </div>
  );
}
