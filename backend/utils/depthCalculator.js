/**
 * Tree depth calculator using longest-path DFS logic.
 */

/**
 * Calculates the depth (height) of a tree structure.
 * Depth is defined as the number of edges on the longest root-to-leaf path.
 *
 * @param {{ name: string, children: object[] }} tree - Tree node object
 * @returns {number} - Maximum depth of the tree
 */
export function calculateDepth(tree) {
  // Leaf node has depth 0
  if (!tree.children || tree.children.length === 0) {
    return 0;
  }

  let maxChildDepth = 0;

  for (const child of tree.children) {
    // Skip cyclic references to avoid infinite recursion
    if (child.cyclic) continue;

    const childDepth = calculateDepth(child);
    if (childDepth > maxChildDepth) {
      maxChildDepth = childDepth;
    }
  }

  return 1 + maxChildDepth;
}

/**
 * Finds the maximum depth across all trees in a forest.
 *
 * @param {Array<{ name: string, children: object[] }>} trees
 * @returns {number}
 */
export function findLargestDepth(trees) {
  if (trees.length === 0) return 0;

  let largest = 0;
  for (const tree of trees) {
    const depth = calculateDepth(tree);
    if (depth > largest) {
      largest = depth;
    }
  }
  return largest;
}
