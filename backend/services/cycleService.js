/**
 * Cycle detection using Depth-First Search with recursion stack tracking.
 * Identifies all cycles present in a directed graph.
 */

/**
 * Detects cycles in the graph using DFS.
 * Uses three states: unvisited, in-stack (currently being explored), and done.
 *
 * @param {import('../models/graphModel.js').Graph} graph
 * @returns {{ hasCycles: boolean, cycles: string[][] }}
 */
export function detectCycles(graph) {
  const UNVISITED = 0;
  const IN_STACK = 1;
  const DONE = 2;

  const state = new Map();
  const parent = new Map(); // Track the path for cycle reconstruction
  const cycles = [];

  // Initialize all nodes as unvisited
  for (const node of graph.getAllNodes()) {
    state.set(node, UNVISITED);
  }

  /**
   * DFS traversal with recursion stack tracking.
   * @param {string} node - Current node being explored
   */
  function dfs(node) {
    state.set(node, IN_STACK);

    for (const neighbor of graph.getChildren(node)) {
      if (state.get(neighbor) === IN_STACK) {
        // Cycle found — reconstruct it
        const cycle = reconstructCycle(node, neighbor, parent);
        cycles.push(cycle);
      } else if (state.get(neighbor) === UNVISITED) {
        parent.set(neighbor, node);
        dfs(neighbor);
      }
    }

    state.set(node, DONE);
  }

  // Run DFS from every unvisited node to catch disconnected components
  for (const node of graph.getAllNodes()) {
    if (state.get(node) === UNVISITED) {
      dfs(node);
    }
  }

  return {
    hasCycles: cycles.length > 0,
    cycles,
  };
}

/**
 * Reconstructs a cycle path from the DFS parent chain.
 *
 * @param {string} current  - Node where cycle was detected from
 * @param {string} ancestor - Node that was re-encountered (start of cycle)
 * @param {Map<string, string>} parent - Parent tracking map
 * @returns {string[]} - Ordered list of nodes forming the cycle
 */
function reconstructCycle(current, ancestor, parent) {
  const path = [ancestor];
  let node = current;

  // Walk back through parent chain until we reach the ancestor
  while (node !== ancestor) {
    path.push(node);
    node = parent.get(node);
    // Safety: break if we somehow can't trace back (shouldn't happen)
    if (node === undefined) break;
  }

  path.reverse();
  return path;
}
