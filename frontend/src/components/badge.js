export default function Badge({ text }) {
  return (
    <div className="bg-slate-200 rounded px-2 py-1 flex items-center justify-center">
      <p className="text-xs text-slate-600 font-medium">{text}</p>
    </div>
  );
}
