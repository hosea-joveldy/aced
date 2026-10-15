import { Outlet } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { AppHeader } from './AppHeader';
import { Sidebar } from './Sidebar';
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
        <main className="container mx-auto px-4 py-2 sm:py-6">
          <JoinClassForm />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Persistent Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-24 md:pb-12">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Tab Navigation */}
      <BottomTabBar />
    </div>
  );
}
