/**
 * SummaryCard — displays key metrics from the new SRM schema.
 * Shows: total trees, total cycles, largest tree root, processing time.
 */
export default function SummaryCard({ summary, processingTime, hierarchies }) {
  const totalNodes = new Set();
  for (const h of (hierarchies || [])) {
    const countNodes = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      for (const key of Object.keys(obj)) {
        totalNodes.add(key);
        countNodes(obj[key]);
      }
    };
    totalNodes.add(h.root);
    if (h.tree && !h.has_cycle) countNodes(h.tree);
  }

  const cards = [
    {
      id: 'total-trees',
      label: 'Trees Found',
      value: summary.total_trees,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z" />
        </svg>
      ),
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      id: 'total-cycles',
      label: 'Cycles Detected',
      value: summary.total_cycles,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
        </svg>
      ),
      color: summary.total_cycles > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400',
      bg: summary.total_cycles > 0 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      id: 'largest-tree-root',
      label: 'Largest Tree Root',
      value: summary.largest_tree_root || '—',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
        </svg>
      ),
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-900/20',
    },
    {
      id: 'total-nodes',
      label: 'Total Nodes',
      value: totalNodes.size,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
        </svg>
      ),
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-900/20',
    },
    {
      id: 'processing-time',
      label: 'Processing Time',
      value: `${(processingTime / 1000).toFixed(2)}s`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-gray-600 dark:text-gray-400',
      bg: 'bg-gray-100 dark:bg-gray-800',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card, i) => (
        <div
          key={card.id}
          id={card.id}
          className="bg-white dark:bg-gray-800 rounded-xl border border-surface-200 dark:border-gray-700 shadow-card p-4 animate-fade-in"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className={`w-9 h-9 rounded-lg ${card.bg} ${card.color} flex items-center justify-center mb-3`}>
            {card.icon}
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
