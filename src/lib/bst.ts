export interface BSTNode {
  val: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

export function createNode(val: number): BSTNode {
  return {
    val,
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

export function collectTreeValues(root: BSTNode | null): number[] {
  const values: number[] = [];

  function walk(node: BSTNode | null) {
    if (!node) return;
    walk(node.left);
    values.push(node.val);
    walk(node.right);
  }

  walk(root);
  return values;
}

export function insert(root: BSTNode | null, val: number): BSTNode {
  if (!root) {
    return createNode(val);
  }
  if (val < root.val) {
    return {
      ...root,
      left: insert(root.left, val),
    };
  } else if (val > root.val) {
    return {
      ...root,
      right: insert(root.right, val),
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

export function deleteNode(root: BSTNode | null, val: number): BSTNode | null {
  if (!root) return null;

  if (val < root.val) {
    return {
      ...root,
      left: deleteNode(root.left, val),
    };
  } else if (val > root.val) {
    return {
      ...root,
      right: deleteNode(root.right, val),
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

export function search(root: BSTNode | null, val: number): BSTNode | null {
  if (!root) return null;
  if (root.val === val) return root;
  if (val < root.val) return search(root.left, val);
  return search(root.right, val);
}

/**
 * Returns the values visited while walking from the root towards `val`.
 * Stops at the matching node, or at the last node compared when absent.
 */
export function getSearchPath(root: BSTNode | null, val: number): number[] {
  const path: number[] = [];
  let curr = root;

  while (curr !== null) {
    path.push(curr.val);
    if (val === curr.val) break;
    curr = val < curr.val ? curr.left : curr.right;
  }

  return path;
}

export function findPredecessor(root: BSTNode | null, targetVal: number): BSTNode | null {
  let predecessor: BSTNode | null = null;
  let curr = root;

  while (curr !== null) {
    if (targetVal > curr.val) {
      predecessor = curr;
      curr = curr.right;
    } else if (targetVal < curr.val) {
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

export function findSuccessor(root: BSTNode | null, targetVal: number): BSTNode | null {
  let successor: BSTNode | null = null;
  let curr = root;

  while (curr !== null) {
    if (targetVal < curr.val) {
      successor = curr;
      curr = curr.left;
    } else if (targetVal > curr.val) {
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

export function inorder(root: BSTNode | null): number[] {
  const result: number[] = [];
  function traverse(node: BSTNode | null) {
    if (!node) return;
    traverse(node.left);
    result.push(node.val);
    traverse(node.right);
  }
  traverse(root);
  return result;
}

export function preorder(root: BSTNode | null): number[] {
  const result: number[] = [];
  function traverse(node: BSTNode | null) {
    if (!node) return;
    result.push(node.val);
    traverse(node.left);
    traverse(node.right);
  }
  traverse(root);
  return result;
}

export function postorder(root: BSTNode | null): number[] {
  const result: number[] = [];
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

