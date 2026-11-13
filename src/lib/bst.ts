export type BSTValue = number | string;

export function isLetterValue(value: BSTValue): value is string {
  return typeof value === 'string' && /^[A-Za-z]$/.test(value);
}

export function normalizeBSTValue(value: BSTValue): BSTValue {
  if (typeof value === 'string') {
    return value.trim().toUpperCase();
  }

  return value;
}

export function compareBSTValues(a: BSTValue, b: BSTValue): number {
  const left = normalizeBSTValue(a);
  const right = normalizeBSTValue(b);

  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }

  if (typeof left === 'number' && typeof right === 'string') {
    return -1;
  }

  if (typeof left === 'string' && typeof right === 'number') {
    return 1;
  }

  return String(left).localeCompare(String(right), undefined, { sensitivity: 'base' });
}

export function parseBSTValue(raw: string): BSTValue | null {
  const trimmed = raw.trim();

  if (!trimmed) {
    return null;
  }

  if (/^[A-Za-z]$/.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  if (/^-?\d+$/.test(trimmed)) {
    return Number(trimmed);
  }

  return null;
}

export interface BSTNode {
  val: BSTValue;
  left: BSTNode | null;
  right: BSTNode | null;
}

export function createNode(val: BSTValue): BSTNode {
  return {
    val: normalizeBSTValue(val),
    left: null,
    right: null,
  };
}

export function cloneTree(root: BSTNode | null): BSTNode | null {
  if (!root) return null;
  return {
    val: root.val,
    left: cloneTree(root.left),
    right: cloneTree(root.right),
  };
}

export function collectTreeValues(root: BSTNode | null): BSTValue[] {
  const values: BSTValue[] = [];

  function walk(node: BSTNode | null) {
    if (!node) return;
    walk(node.left);
    values.push(node.val);
    walk(node.right);
  }

  walk(root);
  return values;
}

export function insert(root: BSTNode | null, val: BSTValue): BSTNode {
  const normalizedVal = normalizeBSTValue(val);

  if (!root) {
    return createNode(normalizedVal);
  }

  const comparison = compareBSTValues(normalizedVal, root.val);
  if (comparison < 0) {
    return {
      ...root,
      left: insert(root.left, normalizedVal),
    };
  } else if (comparison > 0) {
    return {
      ...root,
      right: insert(root.right, normalizedVal),
    };
  }
  return root; // Equal values leave tree unchanged
}

export function findMinNode(root: BSTNode): BSTNode {
  let curr = root;
  while (curr.left !== null) {
    curr = curr.left;
  }
  return curr;
}

export function findMin(root: BSTNode | null): BSTNode | null {
  if (!root) return null;
  return findMinNode(root);
}

export function findMax(root: BSTNode | null): BSTNode | null {
  if (!root) return null;
  let curr = root;
  while (curr.right !== null) {
    curr = curr.right;
  }
  return curr;
}

export function deleteNode(root: BSTNode | null, val: BSTValue): BSTNode | null {
  const normalizedVal = normalizeBSTValue(val);

  if (!root) return null;

  const comparison = compareBSTValues(normalizedVal, root.val);
  if (comparison < 0) {
    return {
      ...root,
      left: deleteNode(root.left, normalizedVal),
    };
  } else if (comparison > 0) {
    return {
      ...root,
      right: deleteNode(root.right, normalizedVal),
    };
  } else {
    // Node to delete found
    if (!root.left) return root.right;
    if (!root.right) return root.left;

    // Node with two children: get inorder successor (min in right subtree)
    const successor = findMinNode(root.right);
    return {
      ...root,
      val: successor.val,
      right: deleteNode(root.right, successor.val),
    };
  }
}

export function search(root: BSTNode | null, val: BSTValue): BSTNode | null {
  const normalizedVal = normalizeBSTValue(val);

  if (!root) return null;
  const comparison = compareBSTValues(normalizedVal, root.val);
  if (comparison === 0) return root;
  if (comparison < 0) return search(root.left, normalizedVal);
  return search(root.right, normalizedVal);
}

/**
 * Returns the values visited while walking from the root towards `val`.
 * Stops at the matching node, or at the last node compared when absent.
 */
export function getSearchPath(root: BSTNode | null, val: BSTValue): BSTValue[] {
  const normalizedVal = normalizeBSTValue(val);
  const path: BSTValue[] = [];
  let curr = root;

  while (curr !== null) {
    path.push(curr.val);
    const comparison = compareBSTValues(normalizedVal, curr.val);
    if (comparison === 0) break;
    curr = comparison < 0 ? curr.left : curr.right;
  }

  return path;
}

export function findPredecessor(root: BSTNode | null, targetVal: BSTValue): BSTNode | null {
  const normalizedVal = normalizeBSTValue(targetVal);
  let predecessor: BSTNode | null = null;
  let curr = root;

  while (curr !== null) {
    const comparison = compareBSTValues(normalizedVal, curr.val);
    if (comparison > 0) {
      predecessor = curr;
      curr = curr.right;
    } else if (comparison < 0) {
      curr = curr.left;
    } else {
      if (curr.left !== null) {
        predecessor = findMax(curr.left);
      }
      break;
    }
  }

  return predecessor;
}

export function findSuccessor(root: BSTNode | null, targetVal: BSTValue): BSTNode | null {
  const normalizedVal = normalizeBSTValue(targetVal);
  let successor: BSTNode | null = null;
  let curr = root;

  while (curr !== null) {
    const comparison = compareBSTValues(normalizedVal, curr.val);
    if (comparison < 0) {
      successor = curr;
      curr = curr.left;
    } else if (comparison > 0) {
      curr = curr.right;
    } else {
      if (curr.right !== null) {
        successor = findMinNode(curr.right);
      }
      break;
    }
  }

  return successor;
}

export function inorder(root: BSTNode | null): BSTValue[] {
  const result: BSTValue[] = [];
  function traverse(node: BSTNode | null) {
    if (!node) return;
    traverse(node.left);
    result.push(node.val);
    traverse(node.right);
  }
  traverse(root);
  return result;
}

export function preorder(root: BSTNode | null): BSTValue[] {
  const result: BSTValue[] = [];
  function traverse(node: BSTNode | null) {
    if (!node) return;
    result.push(node.val);
    traverse(node.left);
    traverse(node.right);
  }
  traverse(root);
  return result;
}

export function postorder(root: BSTNode | null): BSTValue[] {
  const result: BSTValue[] = [];
  function traverse(node: BSTNode | null) {
    if (!node) return;
    traverse(node.left);
    traverse(node.right);
    result.push(node.val);
  }
  traverse(root);
  return result;
}

export function getNodeCount(root: BSTNode | null): number {
  if (!root) return 0;
  return 1 + getNodeCount(root.left) + getNodeCount(root.right);
}

export function getHeight(root: BSTNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(getHeight(root.left), getHeight(root.right));
}

/**
 * Creates the exact initial balanced BST tree depicted in the Figma frame:
 *        50
 *      /    \
 *    30      70
 *   /  \    /  \
 *  20  40  60  80
 */
export function createDefaultTree(): BSTNode {
  return {
    val: 50,
    left: {
      val: 30,
      left: { val: 20, left: null, right: null },
      right: { val: 40, left: null, right: null },
    },
    right: {
      val: 70,
      left: { val: 60, left: null, right: null },
      right: { val: 80, left: null, right: null },
    },
  };
}

