import { useState, useEffect } from 'react';

const today = () => new Date().toISOString().split('T')[0];

const TransactionForm = ({ onAdd, onUpdate, editingTransaction, onCancelEdit }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('General');
  const [date, setDate] = useState(today());
  const [error, setError] = useState('');

  const isEditing = !!editingTransaction;

  useEffect(() => {
    if (editingTransaction) {
      setDescription(editingTransaction.description);
      setAmount(String(editingTransaction.amount));
      setType(editingTransaction.type);
      setCategory(editingTransaction.category || 'General');
      setDate(editingTransaction.date || today());
      setError('');
    } else {
      setDescription('');
      setAmount('');
      setType('income');
      setCategory('General');
      setDate(today());
      setError('');
    }
  }, [editingTransaction]);

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

    const data = {
      id: isEditing ? editingTransaction.id : Date.now(),
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      category,
      date,
    };

    if (isEditing) {
      onUpdate(data);
    } else {
      onAdd(data);
    }

    setDescription('');
    setAmount('');
    setType('income');
    setCategory('General');
    setDate(today());
    setError('');
  };

  const categories = ['General', 'Food', 'Transport', 'Shopping', 'Health', 'Bills', 'Entertainment', 'Salary', 'Other'];

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h2 className="section-title">{isEditing ? 'Edit Transaction' : 'Add Transaction'}</h2>

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
        <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={date}
          max={today()}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="form-btn-group">
        <button type="submit" className="btn-add">
          {isEditing ? 'Update' : 'Add Transaction'}
        </button>
        {isEditing && (
          <button type="button" className="btn-cancel" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TransactionForm;
