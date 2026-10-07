import { Outlet } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { AppHeader } from './AppHeader';
import { BottomTabBar } from './BottomTabBar';
import { JoinClassForm } from '@/components/auth/JoinClassForm';

export function Layout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background" aria-busy="true">
        <div className="text-center">
          <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading Aced...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto px-4">
          <JoinClassForm />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppHeader />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 pt-4 pb-24">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
}
