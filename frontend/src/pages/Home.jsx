import { useState } from 'react';
import InputPanel from '../components/InputPanel.jsx';
import SummaryCard from '../components/SummaryCard.jsx';
import TreeView from '../components/TreeView.jsx';
import ResultsPanel from '../components/ResultsPanel.jsx';

// API base URL — uses local dev server or relative path in production
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000');

export default function Home() {
  const [result, setResult] = useState(null);
  const [processingTime, setProcessingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (lines) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    const startTime = performance.now();

    try {
      const response = await fetch(`${API_URL}/bfhl`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: lines }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      // No more "is_success" check since the schema doesn't have it.
      // We assume if it returns 200 OK, it's successful.
      setResult(data);
      // Hardcode a default processing time or compute it frontend side if missing
      setProcessingTime(performance.now() - startTime);
    } catch (err) {
      setError(err.message || 'Failed to connect to the server. Make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Input section */}
      <section id="input-section">
        <InputPanel onSubmit={handleSubmit} isLoading={isLoading} />
      </section>

      {/* Error display */}
      {error && (
        <div id="error-display" className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-300">Error</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-0.5">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-surface-200 dark:border-gray-700 p-4 animate-pulse-soft">
                <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-gray-700 mb-3" />
                <div className="h-7 w-12 bg-surface-100 dark:bg-gray-700 rounded mb-1" />
                <div className="h-3 w-20 bg-surface-100 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-surface-200 dark:border-gray-700 p-6 animate-pulse-soft">
            <div className="h-4 w-32 bg-surface-100 dark:bg-gray-700 rounded mb-4" />
            <div className="space-y-2">
              <div className="h-3 w-3/4 bg-surface-100 dark:bg-gray-700 rounded" />
              <div className="h-3 w-1/2 bg-surface-100 dark:bg-gray-700 rounded" />
              <div className="h-3 w-2/3 bg-surface-100 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !isLoading && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary cards */}
          <section id="summary-section">
            <SummaryCard summary={result.summary} processingTime={processingTime} hierarchies={result.hierarchies} />
          </section>

          {/* Tree visualization */}
          <section id="tree-section">
            <TreeView hierarchies={result.hierarchies} />
          </section>

          {/* Detailed results */}
          <section id="results-section">
            <ResultsPanel result={result} />
          </section>
        </div>
      )}
    </div>
  );
}
