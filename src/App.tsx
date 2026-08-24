import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import { DataProvider } from './contexts/DataContext';
import { PomodoroProvider } from './contexts/PomodoroContext';
import { Layout } from './components/Sidebar/Layout';
import { PomodoroPage } from './pages/Pomodoro';
import { ArticulatePage } from './pages/Articulate';
import { SpeakingHistoryPage } from './pages/SpeakingHistory';
import { SettingsPage } from './pages/Settings';

// Analytics pulls in Recharts, which is the largest dependency in the app —
// split it into its own chunk so the Pomodoro/Articulate pages (used far
// more often) load as fast as possible.
const AnalyticsPage = lazy(() =>
  import('./pages/Analytics').then((m) => ({ default: m.AnalyticsPage }))
);

export default function App() {
  return (
    <SettingsProvider>
      <DataProvider>
        <PomodoroProvider>
          <HashRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<PomodoroPage />} />
                <Route path="/articulate" element={<ArticulatePage />} />
                <Route
                  path="/analytics"
                  element={
                    <Suspense fallback={<div className="page">Loading analytics…</div>}>
                      <AnalyticsPage />
                    </Suspense>
                  }
                />
                <Route path="/speaking-history" element={<SpeakingHistoryPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </HashRouter>
        </PomodoroProvider>
      </DataProvider>
    </SettingsProvider>
  );
}
