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
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-zinc-100" aria-busy="true">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-100" />
          <p className="text-xs text-zinc-400">Loading Aced...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <JoinClassForm />;
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex selection:bg-zinc-800 selection:text-white">
      {/* Desktop Persistent Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-12">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Tab Navigation */}
      <BottomTabBar />
    </div>
  );
}
