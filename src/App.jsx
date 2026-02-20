import { useState } from 'react';
import Summary from './components/Summary';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Expense Tracker</h1>
        <p>Track your income and expenses easily</p>
      </header>

      <main className="app-main">
        <Summary transactions={transactions} />
        <div className="app-body">
          <TransactionForm onAdd={addTransaction} />
          <TransactionList
            transactions={transactions}
            onDelete={deleteTransaction}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
