import { useState, useEffect, createContext, useContext } from 'react';
import Home from './pages/Home.jsx';

// ─── Theme Context ───────────────────────────────────────
export const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark class to HTML element for Tailwind dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-theme">
        {/* ─── Header ──────────────────────────────────── */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-surface-200 dark:border-gray-700">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo icon */}
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  NodeGraph Insight Engine
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Graph analysis and tree visualization
                </p>
              </div>
            </div>

            {/* Theme toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* ─── Main Content ────────────────────────────── */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <Home />
        </main>

        {/* ─── Footer ──────────────────────────────────── */}
        <footer className="border-t border-surface-200 dark:border-gray-700 py-6 mt-12">
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            NodeGraph Insight Engine — Built with Node.js, Express, React
          </p>
        </footer>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
