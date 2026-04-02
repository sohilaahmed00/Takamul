export function PlaceholderPage({ label }: { label: string }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 h-full">
      <div className="text-center text-gray-400">
        <div className="text-4xl mb-3">🚧</div>
        <div className="font-bold text-sm">{label} — Coming Soon</div>
      </div>
    </div>
  );
}
