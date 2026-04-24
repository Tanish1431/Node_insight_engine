/**
 * ResultsPanel — shows invalid entries, duplicate edges, and JSON export.
 * Updated for SRM schema: invalid_entries and duplicate_edges are string arrays.
 */
export default function ResultsPanel({ result }) {
  const { invalid_entries, duplicate_edges, hierarchies } = result;

  // Extract cycles from hierarchies
  const cycleHierarchies = (hierarchies || []).filter((h) => h.has_cycle);

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nodegraph-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Detailed Results</h3>
        <button
          id="download-json-btn"
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-surface-200 dark:border-gray-700 rounded-lg hover:border-accent dark:hover:border-indigo-500 hover:text-accent transition-colors shadow-card"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export JSON
        </button>
      </div>

      {/* Invalid entries */}
      {invalid_entries && invalid_entries.length > 0 && (
        <DetailSection id="invalid-entries-section" title="Invalid Entries" count={invalid_entries.length} color="red">
          <div className="flex flex-wrap gap-1.5">
            {invalid_entries.map((entry, i) => (
              <span key={i} className="px-2 py-0.5 text-xs font-mono rounded bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800">
                {entry || '(empty)'}
              </span>
            ))}
          </div>
        </DetailSection>
      )}

      {/* Duplicate edges */}
      {duplicate_edges && duplicate_edges.length > 0 && (
        <DetailSection id="duplicate-edges-section" title="Duplicate Edges" count={duplicate_edges.length} color="amber">
          <div className="flex flex-wrap gap-1.5">
            {duplicate_edges.map((edge, i) => (
              <span key={i} className="px-2 py-0.5 text-xs font-mono rounded bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {edge}
              </span>
            ))}
          </div>
        </DetailSection>
      )}

      {/* Cycles */}
      {cycleHierarchies.length > 0 && (
        <DetailSection id="cycles-section" title="Cycles Detected" count={cycleHierarchies.length} color="orange">
          <div className="space-y-2">
            {cycleHierarchies.map((h, i) => (
              <div key={i} className="flex items-center gap-1 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                  Cycle at root: {h.root}
                </span>
              </div>
            ))}
          </div>
        </DetailSection>
      )}
    </div>
  );
}

function DetailSection({ id, title, count, color, children }) {
  const colorMap = {
    emerald: 'bg-emerald-500',
    red: 'bg-red-500',
    amber: 'bg-amber-500',
    orange: 'bg-orange-500',
  };

  return (
    <div id={id} className="bg-white dark:bg-gray-800 rounded-xl border border-surface-200 dark:border-gray-700 shadow-card overflow-hidden animate-fade-in">
      <div className="px-4 py-3 border-b border-surface-200 dark:border-gray-700 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${colorMap[color]}`} />
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
        <span className="text-xs text-gray-400 dark:text-gray-500">({count})</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
