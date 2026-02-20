import { useState, useEffect } from 'react';
import Summary from './components/Summary';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import SpendingChart from './components/SpendingChart';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('et_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('et_theme') || 'light');

  useEffect(() => {
    localStorage.setItem('et_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('et_theme', theme);
  }, [theme]);

  const addTransaction = (transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  const updateTransaction = (updated) => {
    setTransactions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setEditingTransaction(null);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const startEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Expense Tracker</h1>
          <p>Track your income and expenses easily :)</p>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          title="Toggle theme"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      <main className="app-main">
        <Summary transactions={transactions} />
        <SpendingChart transactions={transactions} />
        <div className="app-body">
          <TransactionForm
            onAdd={addTransaction}
            onUpdate={updateTransaction}
            editingTransaction={editingTransaction}
            onCancelEdit={() => setEditingTransaction(null)}
          />
          <TransactionList
            transactions={transactions}
            onDelete={deleteTransaction}
            onEdit={startEdit}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
