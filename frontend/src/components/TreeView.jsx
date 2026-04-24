import { useState } from 'react';

/**
 * Converts a nested object tree like { "A": { "B": { "D": {} }, "C": {} } }
 * into { name: "A", children: [{ name: "B", children: [{ name: "D", children: [] }] }, ...] }
 */
function objectToTree(obj) {
  const keys = Object.keys(obj);
  if (keys.length === 0) return null;

  const rootName = keys[0];
  const rootChildren = obj[rootName];

  function build(name, childrenObj) {
    const children = Object.keys(childrenObj || {}).map((key) =>
      build(key, childrenObj[key])
    );
    return { name, children };
  }

  return build(rootName, rootChildren);
}

export default function TreeView({ hierarchies }) {
  if (!hierarchies || hierarchies.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-surface-200 dark:border-gray-700 shadow-card p-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">No trees to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-surface-200 dark:border-gray-700 shadow-card overflow-hidden">
      <div className="px-4 py-3 border-b border-surface-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Tree Visualization</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Click nodes to expand or collapse</p>
      </div>
      <div className="p-4 space-y-4">
        {hierarchies.map((h, index) => (
          <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            {hierarchies.length > 1 && (
              <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500 mb-2">
                {h.has_cycle ? `Cycle — root: ${h.root}` : `Tree ${index + 1} — root: ${h.root} (depth ${h.depth})`}
              </p>
            )}
            {h.has_cycle ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                  Cycle detected at root "{h.root}" — tree cannot be constructed
                </span>
              </div>
            ) : (
              (() => {
                const tree = objectToTree(h.tree);
                return tree ? <TreeNode node={tree} depth={0} /> : null;
              })()
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TreeNode({ node, depth }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 group cursor-pointer py-1"
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {depth > 0 && <div style={{ width: `${depth * 20}px` }} className="flex-shrink-0" />}

        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
          {hasChildren ? (
            <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
          )}
        </div>

        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium transition-colors ${
          depth === 0
            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
            : 'bg-surface-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-surface-200 dark:border-gray-600 group-hover:border-indigo-300'
        }`}>
          {node.name}
        </span>

        {hasChildren && (
          <span className="text-[10px] text-gray-400 font-medium">{node.children.length}</span>
        )}
      </div>

      {hasChildren && expanded && (
        <div className="animate-slide-down ml-2 tree-line" style={{ marginLeft: `${depth * 20 + 18}px` }}>
          {node.children.map((child, i) => (
            <TreeNode key={`${child.name}-${i}`} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
