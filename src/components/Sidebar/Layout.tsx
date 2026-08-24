import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { PageTransition } from './PageTransition';

const TITLES: Record<string, string> = {
  '/': 'Pomodoro',
  '/articulate': 'Articulate',
  '/analytics': 'Analytics',
  '/speaking-history': 'Speaking History',
  '/settings': 'Settings',
};

export function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const title = TITLES[location.pathname] ?? 'The Study';

  return (
    <div className="app-shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="app-main">
        <div className="mobile-topbar">
          <button
            className="menu-btn"
            aria-label="Open navigation menu"
            onClick={() => setOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="mobile-topbar-title">{title}</span>
          <span style={{ width: 42 }} />
        </div>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </div>
    </div>
  );
}
