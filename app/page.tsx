'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import Loader from '@/components/Loader';

export default function HomePage() {
  const [input, setInput]       = useState('');
  const [tickers, setTickers]   = useState<string[]>([]);
  const [loading, setLoading]   = useState(false);
  const [report, setReport]     = useState<string | null>(null);
  const [err, setErr]           = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const val = input.trim().toUpperCase();
    if (val.length >= 3 && tickers.length < 3 && !tickers.includes(val)) {
      setTickers([...tickers, val]);
    }
    setInput('');
  };

  async function generateReport() {
    setLoading(true);
    setReport(null);
    setErr(null);
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickers })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Unknown error');
      setReport(json.report);
    } catch (e: unknown) { // Change 'any' to 'unknown' here
      if (e instanceof Error) { // Best practice: Check if it's an Error instance
        setErr(e.message);
      } else {
        setErr('An unexpected error occurred.'); // Fallback for other types of errors
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-red-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-sm shadow-xl rounded-md overflow-hidden">

        {/* header */}
        <div className="bg-black text-white py-4 px-6 flex items-center justify-center gap-2">
          <Image src="/dave-face.png" alt="Dave" width={40} height={40} />
          <h1 className="text-xl font-semibold">
            Dodgy&nbsp;<span className="text-pink-400">Dave&apos;s</span>
          </h1>
        </div>

        <p className="text-center text-lg mt-2 text-pink-500 font-bold">
          Stock&nbsp;Predictions
        </p>

        {/* form */}
        <p className="text-center text-sm text-gray-800 px-6 py-4">
          Add up to <strong>3</strong> stock tickers below 👇
        </p>

        <form onSubmit={handleSubmit} className="flex items-center gap-1 px-6 mb-4">
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

        {/* ticker chips */}
        <div className="px-6 pb-2 min-h-[46px]">
          {tickers.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">Your tickers will appear here…</p>
          ) : (
            <div className="flex flex-wrap gap-1">
              {tickers.map(t => (
                <span key={t} className="bg-gray-200 text-black font-mono px-2 py-1 text-xs rounded">{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* generate */}
        <div className="px-6 pb-4">
          <button
            onClick={generateReport}
            disabled={tickers.length === 0 || loading}
            className="w-full bg-green-400 text-white font-semibold py-2 rounded-md disabled:opacity-50 hover:bg-green-500 transition"
          >
            GENERATE REPORT
          </button>
        </div>

        {/* loader / error / report */}
        {loading && <Loader msg="Summoning Dave’s crystal ball…" />}
        {err && <p className="text-red-600 text-center text-sm p-4">{err}</p>}
        {report && (
          <div className="px-6 pb-6 text-gray-500">
            <h2 className="font-semibold mb-2">Your Report 😜</h2>
            <p className="text-sm whitespace-pre-line">{report}</p>
          </div>
        )}

        <p className="text-center text-xs italic text-gray-600 pb-2">
          Always correct 15 % of the time!
        </p>
        <footer className="text-center text-xs text-gray-600 py-4">
          © This is <u>not</u> real financial advice!
        </footer>
      </div>
    </div>
  );
}
