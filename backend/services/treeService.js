/**
 * Tree construction service.
 * Recursively builds hierarchical tree objects from root nodes.
 */

/**
 * Builds a tree structure starting from a given root node.
 * Handles visited tracking to avoid infinite recursion in cyclic graphs.
 *
 * @param {string} root - Starting node
 * @param {import('../models/graphModel.js').Graph} graph
 * @param {Set<string>} [visited] - Tracks visited nodes to prevent loops
 * @returns {{ name: string, children: object[] }}
 */
export function buildTree(root, graph, visited = new Set()) {
  // Mark current node as visited to prevent infinite recursion
  visited.add(root);

  const children = graph.getChildren(root);
  const childNodes = [];

  for (const child of children) {
    if (!visited.has(child)) {
      // Recursively build subtree for unvisited children
      childNodes.push(buildTree(child, graph, visited));
    } else {
      // Mark cyclic reference but don't recurse
      childNodes.push({ name: child, children: [], cyclic: true });
    }
  }

  return {
    name: root,
    children: childNodes,
  };
}

/**
 * Builds all trees in the forest (one per root node).
 *
 * @param {string[]} roots - Array of root node identifiers
 * @param {import('../models/graphModel.js').Graph} graph
 * @returns {Array<{ name: string, children: object[] }>}
 */
export function buildForest(roots, graph) {
  const visited = new Set();
  const trees = [];

  for (const root of roots) {
    if (!visited.has(root)) {
      trees.push(buildTree(root, graph, visited));
    }
  }

  return trees;
}

/**
 * Converts the { name, children } format to a nested object format:
 * { "A": { "B": { "D": {} }, "C": { "E": { "F": {} } } } }
 */
export function convertToNestedObject(node) {
  const build = (n) => {
    if (n.cyclic) return {};
    const obj = {};
    for (const child of n.children) {
      obj[child.name] = build(child);
    }
    return obj;
  };
  
  return { [node.name]: build(node) };
}
