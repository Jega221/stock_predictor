export default function TickerList({tickers}:{tickers:string[]}) {
  return (
    <p className="mt-2 space-x-3">
      {tickers.map(t=>(
        <span key={t} className="px-2 py-1 bg-gray-200 rounded">{t}</span>
      ))}
    </p>
  );
}
