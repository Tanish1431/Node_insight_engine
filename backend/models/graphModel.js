/**
 * Directed graph model using adjacency lists.
 * Efficiently stores edges and provides lookup methods.
 */
export class Graph {
  constructor() {
    // Map<string, string[]> — parent -> [children]
    this.adjacency = new Map();
    // Track in-degree for each node to identify roots
    this.inDegree = new Map();
  }

  /**
   * Ensures a node exists in the graph structures.
   * @param {string} node - Node identifier
   */
  ensureNode(node) {
    if (!this.adjacency.has(node)) {
      this.adjacency.set(node, []);
    }
    if (!this.inDegree.has(node)) {
      this.inDegree.set(node, 0);
    }
  }

  /**
   * Adds a directed edge from `from` to `to`.
   * @param {string} from - Source node
   * @param {string} to   - Target node
   */
  addEdge(from, to) {
    this.ensureNode(from);
    this.ensureNode(to);
    this.adjacency.get(from).push(to);
    this.inDegree.set(to, this.inDegree.get(to) + 1);
  }

  /**
   * Returns children of a given node.
   * @param {string} node
   * @returns {string[]}
   */
  getChildren(node) {
    return this.adjacency.get(node) || [];
  }

  /**
   * Returns all node identifiers in the graph.
   * @returns {string[]}
   */
  getAllNodes() {
    return Array.from(this.adjacency.keys());
  }

  /**
   * Returns root nodes — nodes with zero incoming edges.
   * @returns {string[]}
   */
  getRoots() {
    const roots = [];
    for (const [node, degree] of this.inDegree.entries()) {
      if (degree === 0) {
        roots.push(node);
      }
    }
    return roots.sort(); // Sorted for deterministic output
  }

  /**
   * Returns the total number of nodes in the graph.
   * @returns {number}
   */
  get nodeCount() {
    return this.adjacency.size;
  }
}
