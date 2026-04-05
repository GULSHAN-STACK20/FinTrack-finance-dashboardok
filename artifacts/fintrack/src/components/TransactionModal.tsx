import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { EXPENSE_CATS, INCOME_CATS, CAT_ICONS, Transaction } from '../data/transactions';

interface TransactionModalProps {
  isOpen: boolean;
  editId: number | null;
  onClose: () => void;
  onSaved: (msg: string) => void;
}

function getDefaultDate() {
  return new Date().toISOString().split('T')[0];
}

export default function TransactionModal({ isOpen, editId, onClose, onSaved }: TransactionModalProps) {
  const { transactions, addTransaction, updateTransaction } = useApp();

  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getDefaultDate());
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');

  const cats = type === 'income' ? INCOME_CATS : EXPENSE_CATS;

  useEffect(() => {
    if (!isOpen) return;
    if (editId !== null) {
      const tx = transactions.find(t => t.id === editId);
      if (tx) {
        setDesc(tx.desc);
        setAmount(String(tx.amount));
        setDate(tx.date);
        setType(tx.type);
        setCategory(tx.category);
      }
    } else {
      setDesc('');
      setAmount('');
      setDate(getDefaultDate());
      setType('expense');
      setCategory(EXPENSE_CATS[0]);
    }
  }, [isOpen, editId]);

  useEffect(() => {
    if (!category || !cats.includes(category)) {
      setCategory(cats[0]);
    }
  }, [type]);

  function handleSave() {
    if (!desc.trim()) { onSaved('Please enter a description'); return; }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { onSaved('Please enter a valid amount'); return; }
    if (!date) { onSaved('Please pick a date'); return; }

    if (editId !== null) {
      updateTransaction(editId, { desc: desc.trim(), amount: amt, date, type, category });
      onSaved('Transaction updated!');
    } else {
      addTransaction({ date, desc: desc.trim(), category, type, amount: amt });
      onSaved('Transaction added!');
    }
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-title">{editId ? 'Edit Transaction' : 'Add Transaction'}</div>
        <div className="modal-sub">
          {editId ? 'Update the transaction details below' : 'Record a new income or expense'}
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            className="form-input"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="e.g. Swiggy dinner, Salary…"
            autoFocus
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input
              className="form-input"
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              min="1"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              className="form-input"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              className="form-input"
              value={type}
              onChange={e => setType(e.target.value as 'income' | 'expense')}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
              {cats.map(c => (
                <option key={c} value={c}>{CAT_ICONS[c] || ''} {c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>Save Transaction</button>
        </div>
      </div>
    </div>
  );
}
