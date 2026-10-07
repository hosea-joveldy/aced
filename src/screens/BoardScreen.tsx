import { useSession } from '@/context/SessionContext';

export function BoardScreen() {
  const { session } = useSession();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Assignments & Deadlines
        </h2>
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          Welcome to {session?.className}.
        </p>
      </div>
    </div>
  );
}
