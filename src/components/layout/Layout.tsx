import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { AppHeader } from './AppHeader';
import { Sidebar } from './Sidebar';
import { BottomTabBar } from './BottomTabBar';
import { JoinClassForm } from '@/components/auth/JoinClassForm';
import { LandingScreen } from '@/screens/LandingScreen';

export function Layout() {
  const { session, isLoading } = useSession();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine if URL points to auth / join / login
  const isAuthRoute =
    location.pathname === '/auth' ||
    location.pathname === '/join' ||
    location.pathname === '/login';

  const [showAuth, setShowAuth] = useState(isAuthRoute);
  const [authMode, setAuthMode] = useState<'join' | 'create'>('join');

  useEffect(() => {
    if (isAuthRoute) {
      setShowAuth(true);
    }
  }, [isAuthRoute]);

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#FAF9F5] text-[#141413]"
        aria-busy="true"
      >
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#D5D4CC] border-t-[#141413]" />
          <p className="text-xs text-[#73726C]">Loading Aced...</p>
        </div>
      </div>
    );
  }

  // When not authenticated:
  if (!session) {
    if (showAuth) {
      return (
        <JoinClassForm
          initialMode={authMode}
          onBackToLanding={() => {
            setShowAuth(false);
            if (isAuthRoute) {
              navigate('/');
            }
          }}
        />
      );
    }

    return (
      <LandingScreen
        onJoinClick={() => {
          setAuthMode('join');
          setShowAuth(true);
        }}
        onCreateClick={() => {
          setAuthMode('create');
          setShowAuth(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413] flex selection:bg-[#141413] selection:text-[#FAF9F5]">
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
