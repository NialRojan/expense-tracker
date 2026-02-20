import { useState } from 'react';

const TransactionForm = ({ onAdd }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description.trim()) {
      setError('Description is required.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    onAdd({
      id: Date.now(),
      description: description.trim(),
      amount: parseFloat(amount),
      type,
    });

    setDescription('');
    setAmount('');
    setType('income');
    setError('');
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h2>Add Transaction</h2>

      {error && <p className="form-error">{error}</p>}

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          placeholder="e.g. Salary, Groceries"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          placeholder="0.00"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="type">Type</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <button type="submit" className="btn-add">
        Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm;
