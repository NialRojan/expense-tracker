const Summary = ({ transactions }) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expenses;
  const savingsRate = income > 0 ? (((income - expenses) / income) * 100).toFixed(1) : null;

  // Top spending category
  const catTotals = {};
  transactions.filter((t) => t.type === 'expense').forEach((t) => {
    const c = t.category || 'General';
    catTotals[c] = (catTotals[c] || 0) + t.amount;
  });
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="summary">
      <div className={`summary-card balance ${balance < 0 ? 'negative' : ''}`}>
        <span className="summary-label">Total Balance</span>
        <span className="summary-amount">₹{balance.toFixed(2)}</span>
      </div>
      <div className="summary-card income">
        <span className="summary-label">Total Income</span>
        <span className="summary-amount">+₹{income.toFixed(2)}</span>
      </div>
      <div className="summary-card expense">
        <span className="summary-label">Total Expenses</span>
        <span className="summary-amount">-₹{expenses.toFixed(2)}</span>
      </div>
      {(savingsRate !== null || topCat) && (
        <div className="summary-insights">
          {savingsRate !== null && (
            <div className="summary-card savings">
              <span className="summary-label">Savings Rate</span>
              <span className="summary-amount" style={{ fontSize: '1rem' }}>{savingsRate}%</span>
            </div>
          )}
          {topCat && (
            <div className="summary-card top-cat">
              <span className="summary-label">Top Spending</span>
              <span className="summary-amount" style={{ fontSize: '1rem' }}>
                {topCat[0]} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>₹{topCat[1].toFixed(0)}</span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Summary;
