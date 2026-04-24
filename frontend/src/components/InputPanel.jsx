import { useState, useEffect, useMemo } from 'react';

// Regex matching the backend validation — alphabetic nodes separated by ->
const EDGE_REGEX = /^([A-Za-z]+)\s*->\s*([A-Za-z]+)$/;

/**
 * InputPanel — supports both line-by-line AND JSON format input.
 * Includes real-time validation preview and input history (last 5).
 */
export default function InputPanel({ onSubmit, isLoading }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [inputMode, setInputMode] = useState('json'); // 'lines' or 'json'

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nodegraph_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch { /* ignore corrupt storage */ }
  }, []);

  // ─── Parse input into lines based on mode ──────────────
  const parsedLines = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return [];

    if (inputMode === 'json') {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed && Array.isArray(parsed.data)) {
          return parsed.data.map((item) => String(item).trim());
        }
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item).trim());
        }
        return [];
      } catch {
        return []; // Invalid JSON
      }
    }

    // Line mode
    return trimmed.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  }, [input, inputMode]);

  // ─── JSON validity check ───────────────────────────────
  const jsonValid = useMemo(() => {
    if (inputMode !== 'json') return true;
    const trimmed = input.trim();
    if (!trimmed) return true;
    try {
      const parsed = JSON.parse(trimmed);
      return (parsed && Array.isArray(parsed.data)) || Array.isArray(parsed);
    } catch {
      return false;
    }
  }, [input, inputMode]);

  // ─── Real-time validation preview ──────────────────────
  const preview = useMemo(() => {
    return parsedLines.map((line) => {
      if (!line) return { line, status: 'empty' };
      if (EDGE_REGEX.test(line)) return { line, status: 'valid' };
      return { line, status: 'invalid' };
    });
  }, [parsedLines]);

  const validCount = preview.filter((p) => p.status === 'valid').length;
  const invalidCount = preview.filter((p) => p.status === 'invalid').length;

  // ─── Submit handler ────────────────────────────────────
  const handleSubmit = () => {
    if (parsedLines.length === 0) return;

    // Save to history (max 5)
    const newHistory = [input, ...history.filter((h) => h !== input)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('nodegraph_history', JSON.stringify(newHistory));

    onSubmit(parsedLines);
  };

  // ─── Load from history ─────────────────────────────────
  const loadFromHistory = (entry) => {
    setInput(entry);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('nodegraph_history');
  };

  // ─── Pre-fill example JSON ─────────────────────────────
  const loadExample = () => {
    const example = JSON.stringify({
      data: [
        "A->B", "A->C", "B->D", "C->E", "E->F",
        "X->Y", "Y->Z", "Z->X",
        "P->Q", "Q->R",
        "G->H", "G->H", "G->I",
        "hello", "1->2", "A->"
      ]
    }, null, 2);
    setInput(example);
  };

  return (
    <div className="space-y-4">
      {/* Input area with validation preview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-surface-200 dark:border-gray-700 shadow-card overflow-hidden">
        {/* Header with mode toggle */}
        <div className="px-4 py-3 border-b border-surface-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Input Relationships</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {inputMode === 'json'
                ? 'Paste JSON: { "data": ["A->B", ...] }'
                : 'Enter one relationship per line (e.g. A->B)'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Mode toggle */}
            <div className="flex items-center bg-surface-100 dark:bg-gray-700 rounded-lg p-0.5">
              <button
                id="mode-json-btn"
                onClick={() => setInputMode('json')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                  inputMode === 'json'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                JSON
              </button>
              <button
                id="mode-lines-btn"
                onClick={() => setInputMode('lines')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                  inputMode === 'lines'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                Lines
              </button>
            </div>
            {/* Validation counter */}
            {parsedLines.length > 0 && (
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {validCount} valid
                </span>
                {invalidCount > 0 && (
                  <span className="flex items-center gap-1 text-red-500">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    {invalidCount} invalid
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Validation preview sidebar + textarea */}
        <div className="flex">
          {/* Line validation indicators (for parsed lines) */}
          {parsedLines.length > 0 && (
            <div className="flex flex-col py-3 px-2 border-r border-surface-200 dark:border-gray-700 bg-surface-50 dark:bg-gray-850 min-w-[28px] max-h-[300px] overflow-y-auto">
              {preview.map((p, i) => (
                <div key={i} className="h-[20px] flex items-center justify-center flex-shrink-0">
                  {p.status === 'valid' && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                  {p.status === 'invalid' && <span className="w-2 h-2 rounded-full bg-red-500" />}
                  {p.status === 'empty' && <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />}
                </div>
              ))}
            </div>
          )}

          {/* Textarea */}
          <textarea
            id="input-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputMode === 'json'
              ? '{\n  "data": [\n    "A->B",\n    "B->C",\n    "B->D"\n  ]\n}'
              : 'A->B\nB->C\nB->D\nC->E'}
            rows={10}
            className="flex-1 px-4 py-3 bg-transparent text-gray-900 dark:text-white text-sm font-mono leading-[20px] placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none"
            spellCheck={false}
          />
        </div>

        {/* JSON validity indicator */}
        {inputMode === 'json' && input.trim() && !jsonValid && (
          <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
            <p className="text-xs text-red-600 dark:text-red-400">
              Invalid JSON format. Expected: {"{"} "data": ["X-&gt;Y", ...] {"}"}
            </p>
          </div>
        )}

        {/* Action bar */}
        <div className="px-4 py-3 border-t border-surface-200 dark:border-gray-700 flex items-center justify-between bg-surface-50 dark:bg-gray-850">
          <div className="flex items-center gap-3">
            <button
              id="clear-input-btn"
              onClick={() => setInput('')}
              disabled={!input.trim()}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-40 transition-colors"
            >
              Clear
            </button>
            <button
              id="load-example-btn"
              onClick={loadExample}
              className="text-xs text-accent hover:text-accent-hover transition-colors"
            >
              Load Example
            </button>
          </div>
          <button
            id="submit-btn"
            onClick={handleSubmit}
            disabled={isLoading || parsedLines.length === 0 || (inputMode === 'json' && !jsonValid)}
            className="px-5 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-elevated active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </span>
            ) : (
              'Analyze Graph'
            )}
          </button>
        </div>
      </div>

      {/* ─── Input History Panel ────────────────────────── */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-surface-200 dark:border-gray-700 shadow-card">
          <div className="px-4 py-3 border-b border-surface-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Inputs</h3>
            <button
              id="clear-history-btn"
              onClick={clearHistory}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="divide-y divide-surface-200 dark:divide-gray-700">
            {history.map((entry, i) => {
              // Show a short preview
              const preview = entry.length > 80 ? entry.substring(0, 80) + '...' : entry;
              return (
                <button
                  key={i}
                  id={`history-item-${i}`}
                  onClick={() => loadFromHistory(entry)}
                  className="w-full px-4 py-2.5 text-left hover:bg-surface-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <p className="text-xs font-mono text-gray-600 dark:text-gray-300 truncate">
                    {preview}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
