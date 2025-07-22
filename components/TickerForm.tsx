'use client';
import { useState, FormEvent } from 'react';

interface TickerFormProps {
  onAddTicker: (ticker: string) => void;
  onGenerateReport: () => void;
  tickersCount: number; // To disable based on count in parent
  loading: boolean;
}

export default function TickerForm({ onAddTicker, onGenerateReport, tickersCount, loading }: TickerFormProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = input.trim().toUpperCase();
    if (!trimmed) {
      setError('Please enter a ticker symbol.');
      return;
    }
    // The check for `tickers.includes(trimmed)` and `tickers.length < 3`
    // should ideally happen in the parent (HomePage) or passed as a prop,
    // as TickerForm shouldn't manage the entire tickers array.
    onAddTicker(trimmed);
    setInput('');
  };

  return (
    <>
      <form onSubmit={handleAdd} className="flex items-center gap-1 px-6 mb-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="MSFT"
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900"
        />
        <button type="submit" className="bg-black text-white p-2 rounded-md hover:bg-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </form>
      {error && <p className="text-red-600 text-center text-sm p-4">{error}</p>}
      <div className="px-6 pb-4">
        <button
          onClick={onGenerateReport}
          disabled={tickersCount === 0 || loading}
          className="w-full bg-green-400 text-white font-semibold py-2 rounded-md disabled:opacity-50 hover:bg-green-500 transition"
        >
          {loading ? 'Working…' : 'GENERATE REPORT'}
        </button>
      </div>
    </>
  );
}