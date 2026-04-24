import { Graph } from '../models/graphModel.js';

/**
 * Builds a directed graph from validated edges.
 *
 * @param {Array<[string, string]>} edges - Array of [from, to] tuples
 * @returns {Graph} - Populated Graph instance
 */
export function buildGraph(edges) {
  const graph = new Graph();

  for (const [from, to] of edges) {
    graph.addEdge(from, to);
  }

  return graph;
}

/**
 * Identifies root nodes in the graph (nodes with no incoming edges).
 *
 * @param {Graph} graph
 * @returns {string[]}
 */
export function findRoots(graph) {
  return graph.getRoots();
}
