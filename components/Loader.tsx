export default function Loader({ msg = 'Working…' }: { msg?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-10">
      <svg
        className="w-8 h-8 animate-spin text-black"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
        <path
          className="opacity-75"
          d="M4 12a8 8 0 018-8"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <p className="text-sm text-gray-800">{msg}</p>
    </div>
  );
}
