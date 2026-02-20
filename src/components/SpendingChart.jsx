import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const balance = payload[0]?.value ?? 0;
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderRadius: '6px',
      padding: '8px 12px',
      fontSize: '0.82rem',
      color: 'var(--text-main)',
    }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>{label}</p>
      <p style={{ color: balance >= 0 ? 'var(--text-muted)' : 'var(--accent)', fontWeight: 700 }}>
        Balance: ₹{balance.toFixed(2)}
      </p>
    </div>
  );
};

const SpendingChart = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="chart-container">
        <h2 className="section-title">Balance Timeline</h2>
        <p className="empty-message">No data yet. Add transactions to see your balance timeline.</p>
      </div>
    );
  }

  // Group net change per day, sort chronologically, then compute running balance
  const dateMap = {};
  transactions.forEach((t) => {
    const raw = t.date || new Date(t.id).toISOString().split('T')[0];
    if (!dateMap[raw]) dateMap[raw] = { _raw: raw, net: 0 };
    dateMap[raw].net += t.type === 'income' ? t.amount : -t.amount;
  });

  let running = 0;
  const data = Object.values(dateMap)
    .sort((a, b) => new Date(a._raw) - new Date(b._raw))
    .map(({ _raw, net }) => {
      running += net;
      return {
        date: new Date(_raw).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }),
        balance: parseFloat(running.toFixed(2)),
      };
    });

  const isNegative = data[data.length - 1]?.balance < 0;

  const lineColor = isNegative ? '#A41F13' : '#8F7A6E';
  const gradientId = isNegative ? 'balanceNeg' : 'balancePos';

  return (
    <div className="chart-container">
      <h2 className="section-title">Balance Timeline</h2>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 12, right: 16, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lineColor} stopOpacity={0.18} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${v}`}
          />
          <ReferenceLine y={0} stroke="var(--border)" strokeDasharray="4 4" label={{ value: '₹0', fill: 'var(--text-muted)', fontSize: 10, position: 'insideTopLeft' }} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area
            type="monotone"
            dataKey="balance"
            stroke={lineColor}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={{ r: 3.5, fill: lineColor, stroke: 'var(--card-bg)', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: lineColor, stroke: 'var(--card-bg)', strokeWidth: 2, filter: 'url(#glow)' }}
            name="Balance"
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingChart;
