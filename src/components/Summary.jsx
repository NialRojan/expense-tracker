const Summary = ({ transactions }) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expenses;

  return (
    <div className="summary">
      <div className={`summary-card balance ${balance < 0 ? 'negative' : ''}`}>
        <span className="summary-label">Total Balance</span>
        <span className="summary-amount">
          ₹{balance.toFixed(2)}
        </span>
      </div>
      <div className="summary-card income">
        <span className="summary-label">Total Income</span>
        <span className="summary-amount">+₹{income.toFixed(2)}</span>
      </div>
      <div className="summary-card expense">
        <span className="summary-label">Total Expenses</span>
        <span className="summary-amount">-₹{expenses.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Summary;
