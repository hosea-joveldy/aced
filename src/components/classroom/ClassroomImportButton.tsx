import { classroomImportEnabled } from '@/lib/env';
import { DownloadCloud } from 'lucide-react';

export function ClassroomImportButton() {
  // When feature flag is OFF, the component returns null and is completely absent from the DOM
  if (!classroomImportEnabled()) {
    return null;
  }

  return (
    <button
      type="button"
      className="flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted transition"
      data-testid="classroom-import-button"
    >
      <DownloadCloud className="h-4 w-4 text-primary" />
      <span>Classroom Import</span>
    </button>
  );
}
