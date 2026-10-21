import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RepositoryProvider } from '@/context/RepositoryContext';
import { SessionProvider } from '@/context/SessionContext';
import { Layout } from '@/components/layout/Layout';
import { BoardScreen } from '@/screens/BoardScreen';
import { SubjectsScreen } from '@/screens/SubjectsScreen';
import { HistoryScreen } from '@/screens/HistoryScreen';

export default function App() {
  return (
    <RepositoryProvider>
      <SessionProvider>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<BoardScreen />} />
              <Route path="/subjects" element={<SubjectsScreen />} />
              <Route path="/history" element={<HistoryScreen />} />
              <Route path="/auth" element={<Navigate to="/" replace />} />
              <Route path="/join" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      </SessionProvider>
    </RepositoryProvider>
  );
}
