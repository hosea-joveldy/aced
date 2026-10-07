export function HistoryScreen() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Edit History & Undo
        </h2>
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          Recent modifications and one-tap revert actions.
        </p>
      </div>
    </div>
  );
}
