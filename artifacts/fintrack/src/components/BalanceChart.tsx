import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

declare const Chart: any;

function fmtFull(n: number) { return '₹' + n.toLocaleString('en-IN'); }

export default function BalanceChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);
  const { transactions, theme } = useApp();

  useEffect(() => {
    if (!canvasRef.current) return;
    const months = ['Nov 25','Dec 25','Jan 26','Feb 26','Mar 26','Apr 26'];
    const monthKeys = ['2025-11','2025-12','2026-01','2026-02','2026-03','2026-04'];

    const incomeByMonth = monthKeys.map(mk =>
      transactions.filter(t => t.type==='income' && t.date.startsWith(mk)).reduce((s,t) => s+t.amount, 0)
    );
    const expByMonth = monthKeys.map(mk =>
      transactions.filter(t => t.type==='expense' && t.date.startsWith(mk)).reduce((s,t) => s+t.amount, 0)
    );
    const balByMonth = incomeByMonth.map((inc, i) => inc - expByMonth[i]);

    const isDark = theme === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#6b7280' : '#9ca3af';

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Balance', data: balByMonth, borderColor: '#00e5a0',
            backgroundColor: 'rgba(0,229,160,0.08)', fill: true,
            tension: 0.4, borderWidth: 2.5, pointRadius: 4, pointBackgroundColor: '#00e5a0'
          },
          {
            label: 'Income', data: incomeByMonth, borderColor: '#22d3ee',
            backgroundColor: 'transparent', fill: false,
            tension: 0.4, borderWidth: 1.5, borderDash: [4,4], pointRadius: 2
          },
          {
            label: 'Expenses', data: expByMonth, borderColor: '#ff4d6d',
            backgroundColor: 'transparent', fill: false,
            tension: 0.4, borderWidth: 1.5, borderDash: [4,4], pointRadius: 2
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? '#181b22' : '#fff',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            borderWidth: 1, titleColor: isDark ? '#f0f2f8' : '#0d0f14',
            bodyColor: isDark ? '#9ca3af' : '#6b7280', padding: 12,
            callbacks: { label: (ctx: any) => ` ${ctx.dataset.label}: ${fmtFull(ctx.parsed.y)}` }
          }
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
          y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 }, callback: (v: number) => '₹'+(v/1000)+'K' } }
        }
      }
    });

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [transactions, theme]);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <div className="chart-title">Balance Trend</div>
          <div className="chart-meta">Last 6 months • Cumulative net</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'12px',fontSize:'12px'}}>
          <span><span className="legend-dot" style={{background:'#00e5a0'}}></span>Balance</span>
          <span><span className="legend-dot" style={{background:'#22d3ee'}}></span>Income</span>
          <span><span className="legend-dot" style={{background:'#ff4d6d'}}></span>Expenses</span>
        </div>
      </div>
      <canvas ref={canvasRef} height={110}></canvas>
    </div>
  );
}
