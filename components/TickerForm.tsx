'use client';
import { useState, FormEvent } from 'react';
import TickerList from './TickerList';

export default function TickerForm({ onReport }:{
  onReport:(txt:string)=>void }) {

  const [input,setInput]=useState('');
  const [tickers,setTickers]=useState<string[]>([]);
  const [error,setError]   =useState('');
  const [loading,setLoading]=useState(false);

  async function add(e: FormEvent) {
    e.preventDefault();
    setError('');
    const trimmed = input.trim().toUpperCase();
    if (!trimmed) {
      setError('Please enter a ticker symbol.');
      return;
    }
    if (tickers.includes(trimmed)) {
      setError('Ticker already added.');
      return;
    }
    setTickers([...tickers, trimmed]);
    setInput('');
  }

  async function generate(){
    setLoading(true); setError('');
    try{
      const res=await fetch('/api/report',{method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ tickers })
      });
      const {report}=await res.json();
      onReport(report);
    }catch{ setError('Something went wrong'); }
    setLoading(false);
  }

  return (
    <>
      {/* form & ticker chips */}
      <button disabled={!tickers.length||loading} onClick={generate}>
        {loading?'Working…':'Generate report'}
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </>
  );
}
