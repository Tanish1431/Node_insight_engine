import { validateAll } from '../utils/validator.js';
import { buildGraph, findRoots } from '../services/graphService.js';
import { detectCycles } from '../services/cycleService.js';
import { buildTree, convertToNestedObject } from '../services/treeService.js';
import { calculateDepth } from '../utils/depthCalculator.js';

const MAX_PROCESSING_MS = 3000;

export async function handleBfhl(req, res, next) {
  const startTime = performance.now();

  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        error: 'Request body must contain a "data" array of strings.',
      });
    }

    const { validEdges, invalidEntries, duplicateEdges } = validateAll(data);
    const graph = buildGraph(validEdges);
    const roots = findRoots(graph);
    const { cycles } = detectCycles(graph);

    // Track first appearance order of each "from" node in valid edges
    const firstAppearance = new Map();
    for (let i = 0; i < validEdges.length; i++) {
      const from = validEdges[i][0];
      if (!firstAppearance.has(from)) {
        firstAppearance.set(from, i);
      }
    }

    // Build tree for each root
    const treeMap = new Map();
    for (const root of roots) {
      const tree = buildTree(root, graph, new Set());
      treeMap.set(root, tree);
    }

    // Identify standalone cycle nodes (not already a tree root)
    const cycleRootSet = new Set();
    for (const cycle of cycles) {
      const cycleRoot = [...cycle].sort()[0];
      if (!roots.includes(cycleRoot) && !cycleRootSet.has(cycleRoot)) {
        cycleRootSet.add(cycleRoot);
      }
    }

    // Merge all roots + cycle roots, sort by first appearance in input
    const allRoots = [...roots, ...cycleRootSet];
    allRoots.sort((a, b) => {
      const orderA = firstAppearance.has(a) ? firstAppearance.get(a) : Infinity;
      const orderB = firstAppearance.has(b) ? firstAppearance.get(b) : Infinity;
      return orderA - orderB;
    });

    // Build hierarchies in input order
    const hierarchies = [];
    let largestDepth = 0;
    let largestTreeRoot = null;

    for (const root of allRoots) {
      if (cycleRootSet.has(root)) {
        hierarchies.push({ root, tree: {}, has_cycle: true });
      } else {
        const tree = treeMap.get(root);
        const depth = calculateDepth(tree) + 1; // node count, not edge count

        if (depth > largestDepth) {
          largestDepth = depth;
          largestTreeRoot = root;
        }

        hierarchies.push({ root, tree: convertToNestedObject(tree), depth });
      }
    }

    const elapsed = performance.now() - startTime;
    if (elapsed > MAX_PROCESSING_MS) {
      console.warn(`Processing exceeded ${MAX_PROCESSING_MS}ms: ${elapsed.toFixed(2)}ms`);
    }

    const response = {
      user_id: "johndoe_17091999",
      email_id: "john.doe@college.edu",
      college_roll_number: "21CS1001",
      hierarchies,
      invalid_entries: invalidEntries,
      duplicate_edges: duplicateEdges,
      summary: {
        total_trees: hierarchies.filter((h) => !h.has_cycle).length,
        total_cycles: cycles.length,
        largest_tree_root: largestTreeRoot || "",
      },
    };

    console.log(`Processed ${data.length} entries in ${elapsed.toFixed(2)}ms`);
    return res.json(response);
  } catch (err) {
    next(err);
  }
}
