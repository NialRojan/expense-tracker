import { useState, useMemo } from 'react';

const exportCSV = (transactions) => {
  const header = 'Date,Description,Category,Type,Amount';
  const rows = transactions.map((t) =>
    `${t.date || ''},"${t.description}",${t.category || 'General'},${t.type},${t.amount.toFixed(2)}`
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transactions.csv';
  a.click();
  URL.revokeObjectURL(url);
};

const TransactionList = ({ transactions, onDelete, onEdit }) => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = useMemo(() => {
    const cats = [...new Set(transactions.map((t) => t.category || 'General'))];
    return cats.sort();
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchType = typeFilter === 'all' || t.type === typeFilter;
      const matchCat = categoryFilter === 'all' || (t.category || 'General') === categoryFilter;
      return matchType && matchCat;
    });
  }, [transactions, typeFilter, categoryFilter]);

  return (
    <div className="transaction-list">
      <div className="list-header">
        <h2 className="section-title">Transactions</h2>
        {transactions.length > 0 && (
          <button className="btn-export" onClick={() => exportCSV(transactions)} title="Export as CSV">
            ↓ CSV
          </button>
        )}
      </div>

      {transactions.length > 0 && (
        <div className="filter-bar">
          <div className="filter-group">
            {['all', 'income', 'expense'].map((f) => (
              <button
                key={f}
                className={`filter-pill${typeFilter === f ? ' active' : ''}`}
                onClick={() => setTypeFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          {categories.length > 1 && (
            <select
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="empty-message">
          {transactions.length === 0 ? 'No transactions yet. Add one above!' : 'No transactions match the filters.'}
        </p>
      ) : (
        <ul>
          {filtered.map((t) => (
            <li key={t.id} className={`transaction-item ${t.type}`}>
              <div className="transaction-info">
                <span className="transaction-desc">{t.description}</span>
                <div className="transaction-meta">
                  <span className="transaction-badge">{t.type}</span>
                  {t.category && t.category !== 'General' && (
                    <span className="transaction-category">{t.category}</span>
                  )}
                  {t.date && (
                    <span className="transaction-date">
                      {new Date(t.date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
              <div className="transaction-right">
                <span className="transaction-amount">
                  {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
                </span>
                <button className="btn-icon btn-edit-icon" onClick={() => onEdit(t)} title="Edit transaction">✎</button>
                <button className="btn-icon btn-delete" onClick={() => onDelete(t.id)} title="Delete transaction">✕</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;
