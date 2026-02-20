const TransactionList = ({ transactions, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="transaction-list">
        <h2>Transactions</h2>
        <p className="empty-message">No transactions yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <h2>Transactions</h2>
      <ul>
        {transactions.map((t) => (
          <li key={t.id} className={`transaction-item ${t.type}`}>
            <div className="transaction-info">
              <span className="transaction-desc">{t.description}</span>
              <span className="transaction-badge">{t.type}</span>
            </div>
            <div className="transaction-right">
              <span className="transaction-amount">
                {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
              </span>
              <button
                className="btn-delete"
                onClick={() => onDelete(t.id)}
                title="Delete transaction"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
