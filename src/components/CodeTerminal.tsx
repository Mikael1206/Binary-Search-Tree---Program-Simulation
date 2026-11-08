import React, { useState } from 'react';
import Card from './Card';
import { TraversalType } from './CommandHub';

export type SupportedLanguage = 'C' | 'JAVA' | 'C#';

export type TerminalOperation = 'INSERT' | 'DELETE' | 'SEARCH' | 'TRAVERSAL' | 'MIN' | 'MAX' | 'PRED' | 'SUCC' | 'FIND';

export interface TerminalAction {
  op: TerminalOperation;
  val: number | null;
  path: number[];
  treeValues: number[];
}

export interface CodeTerminalProps {
  action: TerminalAction;
  traversalOrder: TraversalType;
  className?: string;
}

/** Generate C code for the current BST values */
function generateCCode(values: number[], path: number[]): string {
  const sorted = [...values].sort((a, b) => a - b);
  let code = [
    '#include <stdio.h>',
    '#include <stdlib.h>',
    '',
    '// Structure for a BST Node',
    'typedef struct Node {',
    '  int data;',
    '  struct Node* left;',
    '  struct Node* right;',
    '} Node;',
    '',
    '// Helper function to create a new node',
    'Node* createNode(int value) {',
    '  Node* newNode = (Node*)malloc(sizeof(Node));',
    '  newNode->data = value;',
    '  newNode->left = NULL;',
    '  newNode->right = NULL;',
    '  return newNode;',
    '}',
    '',
    '// Insert function to construct the BST',
    'Node* insert(Node* root, int value) {',
    '  if (root == NULL) {',
    '    return createNode(value);',
    '  }',
    '  if (value < root->data) {',
    '    root->left = insert(root->left, value);',
    '  } else if (value > root->data) {',
    '    root->right = insert(root->right, value);',
    '  }',
    '  return root;',
    '}',
    '',
    '// Find Minimum Node (Leftmost element)',
    'Node* findMin(Node* root) {',
    '  if (root == NULL) return NULL;',
    '  while (root->left != NULL) {',
    '    root = root->left;',
    '  }',
    '  return root;',
    '}',
    '',
    '// Find Maximum Node (Rightmost element)',
    'Node* findMax(Node* root) {',
    '  if (root == NULL) return NULL;',
    '  while (root->right != NULL) {',
    '    root = root->right;',
    '  }',
    '  return root;',
    '}',
    '',
    '// Find a node by key',
    'Node* findNode(Node* root, int key) {',
    '  if (root == NULL || root->data == key) {',
    '    return root;',
    '  }',
    '  if (key < root->data) {',
    '    return findNode(root->left, key);',
    '  }',
    '  return findNode(root->right, key);',
    '}',
    '',
    '// Find In-Order Predecessor (Max node in left subtree)',
    'Node* findPredecessor(Node* root, int key) {',
    '  Node* targetNode = findNode(root, key);',
    '  if (targetNode == NULL || targetNode->left == NULL) {',
    '    return NULL;',
    '  }',
    '  Node* findMaxSub(Node* r) {',
    '    if (r == NULL) return NULL;',
    '    while (r->right != NULL) { r = r->right; }',
    '    return r;',
    '  }',
    '  return findMaxSub(targetNode->left);',
    '}',
    '',
    '// Find In-Order Successor (Min node in right subtree)',
    'Node* findSuccessor(Node* root, int key) {',
    '  Node* targetNode = findNode(root, key);',
    '  if (targetNode == NULL || targetNode->right == NULL) {',
    '    return NULL;',
    '  }',
    '  Node* findMinSub(Node* r) {',
    '    if (r == NULL) return NULL;',
    '    while (r->left != NULL) { r = r->left; }',
    '  return r;',
    '}',
    '  return findMinSub(targetNode->right);',
    '}',
    '',
    '// Print In-Order Traversal (Left, Root, Right)',
    'void inorderTraversal(Node* root) {',
    '  if (root != NULL) {',
    '    inorderTraversal(root->left);',
    '    printf("%d ", root->data);',
    '    inorderTraversal(root->right);',
    '  }',
    '}',
  ];

  // Add main function with the actual values
  code.push('// Current tree values (in insertion order as visualized)');
  code.push(`int values[] = {${sorted.map(v => String(v)).join(', ')}};`);
  code.push(`int n = sizeof(values) / sizeof(values[0]);`);
  code.push('');
  code.push('int main() {');
  code.push('  Node* root = NULL;');
  code.push(`  // Insert elements to form the tree shown in the visualizer`);
  code.push('  for (int i = 0; i < n; i++) {');
  code.push('    root = insert(root, values[i]);');
  code.push('  }');
  code.push('');

  // Add operations based on path
  if (path.length > 0) {
    code.push('  // Operations matching the diagram targets');
    code.push('  Node* minNode = findMin(root);');
    code.push('  Node* maxNode = findMax(root);');
    const targetVal = path[path.length - 1];
    code.push(`  Node* targetNode = findNode(root, ${targetVal});`);
    code.push('  Node* predecessor = NULL;');
    code.push('  Node* successor = NULL;');
    if (path.includes(targetVal)) {
      code.push(`  predecessor = findPredecessor(root, ${targetVal});`);
      code.push(`  successor = findSuccessor(root, ${targetVal});`);
    }
    code.push('');
    code.push('  printf("In-Order Traversal: ");');
    code.push('  inorderTraversal(root);');
    code.push('  printf("\\n\\n");');
    code.push(`  printf("TARGET Node: %d\\n", targetNode ? targetNode->data : -1);`);
    code.push(`  printf("MIN Node:    %d\\n", minNode ? minNode->data : -1);`);
    code.push(`  printf("MAX Node:    %d\\n", maxNode ? maxNode->data : -1);`);
    if (path.length >= 2) {
      code.push(`  printf("PRED (<):    %d\\n", predecessor ? predecessor->data : -1);`);
      code.push(`  printf("SUCC (>):    %d\\n", successor ? successor->data : -1);`);
    }
  }
  code.push('  return 0;');
  code.push('}');

  return code.join('\n');
}

/** Generate Java code for the current BST values */
function generateJavaCode(values: number[], path: number[]): string {
  const sorted = [...values].sort((a, b) => a - b);
  let code = [
    '// Structure for a BST Node',
    'class Node {',
    '  int data;',
    '  Node left, right;',
    '  Node(int v) { data = v; }',
    '}',
    '',
    '// Insert function to construct the BST',
    'Node insert(Node root, int value) {',
    '  if (root == null) {',
    '    return new Node(value);',
    '  }',
    '  if (value < root.data) {',
    '    root.left = insert(root.left, value);',
    '  } else if (value > root.data) {',
    '    root.right = insert(root.right, value);',
    '  }',
    '  return root;',
    '}',
    '',
    '// Find Minimum Node (Leftmost element)',
    'Node findMin(Node root) {',
    '  if (root == null) return null;',
    '  while (root.left != null) { root = root.left; }',
    '  return root;',
    '}',
    '',
    '// Find Maximum Node (Rightmost element)',
    'Node findMax(Node root) {',
    '  if (root == null) return null;',
    '  while (root.right != null) { root = root.right; }',
    '  return root;',
    '}',
    '',
    '// Find a node by key',
    'Node findNode(Node root, int key) {',
    '  if (root == null || root.data == key) {',
    '    return root;',
    '  }',
    '  if (key < root.data) {',
    '    return findNode(root.left, key);',
    '  }',
    '  return findNode(root.right, key);',
    '}',
    '',
    '// Find In-Order Predecessor (Max node in left subtree)',
    'Node findPredecessor(Node root, int key) {',
    '  Node targetNode = findNode(root, key);',
    '  if (targetNode == null || targetNode.left == null) {',
    '    return null;',
    '  }',
    '  Node findMaxSub(Node r) {',
    '    if (r == null) return null;',
    '    while (r.right != null) { r = r.right; }',
    '    return r;',
    '}',
    '  return findMaxSub(targetNode.left);',
    '}',
    '',
    '// Find In-Order Successor (Min node in right subtree)',
    'Node findSuccessor(Node root, int key) {',
    '  Node targetNode = findNode(root, key);',
    '  if (targetNode == null || targetNode.right == null) {',
    '    return null;',
    '  }',
    '  Node findMinSub(Node r) {',
    '    if (r == null) return null;',
    '    while (r.left != null) { r = r.left; }',
    '  return r;',
    '}',
    '  return findMinSub(targetNode.right);',
    '}',
    '',
    '// Print In-Order Traversal (Left, Root, Right)',
    'void inorderTraversal(Node root) {',
    '  if (root != null) {',
    '    inorderTraversal(root.left);',
    '    System.out.print(root.data + " ");',
    '    inorderTraversal(root.right);',
    '  }',
    '}',
  ];

  // Add main function
  code.push('// Current tree values (in insertion order as visualized)');
  code.push(`int[] values = {${sorted.map(v => String(v)).join(', ')}};`);
  code.push(`int n = values.length;`);
  code.push('');
  code.push('public class BSTVisualizer {');
  code.push('  public static void main(String[] args) {');
  code.push('    Node root = null;');
  code.push(`    // Insert elements to form the tree shown in the visualizer`);
  code.push('    for (int i = 0; i < n; i++) {');
  code.push('      root = insert(root, values[i]);');
  code.push('    }');
  code.push('');

  if (path.length > 0) {
    code.push('    // Operations matching the diagram targets');
    code.push('    Node minNode = findMin(root);');
    code.push('    Node maxNode = findMax(root);');
    const targetVal = path[path.length - 1];
    code.push(`    Node targetNode = findNode(root, ${targetVal});`);
    code.push('    Node predecessor = null;');
    code.push('    Node successor = null;');
    if (path.includes(targetVal)) {
      code.push('    predecessor = findPredecessor(root, ' + targetVal + ');');
      code.push('    successor = findSuccessor(root, ' + targetVal + ');');
    }
    code.push('');
    code.push('    System.out.print("In-Order Traversal: ");');
    code.push('    inorderTraversal(root);');
    code.push('    System.out.println("");');
    code.push(`    System.out.println("TARGET Node: " + targetNode.data)`);
    code.push(`    System.out.println("MIN Node:    " + minNode.data)`);
    code.push(`    System.out.println("MAX Node:    " + maxNode.data)`);
    if (path.length >= 2) {
      code.push('    System.out.println("PRED (<):    " + predecessor.data);');
      code.push('    System.out.println("SUCC (>):    " + successor.data);');
    }
  }
  code.push('  }');
  code.push('}');

  return code.join('\n');
}

/** Generate C# code for the current BST values */
function generateCSharpCode(values: number[], path: number[]): string {
  const sorted = [...values].sort((a, b) => a - b);
  let code = [
    '// Structure for a BST Node',
    'public class Node {',
    '  public int Data;',
    '  public Node? Left, Right;',
    '  public Node(int v) => Data = v;',
    '}',
    '',
    '// Insert function to construct the BST',
    'Node? Insert(Node? root, int val) {',
    '  if (root == null)',
    '    return new Node(val);',
    '  if (val < root.Data)',
    '    root.Left = Insert(root.Left, val);',
    '  else if (val > root.Data)',
    '    root.Right = Insert(root.Right, val);',
    '  return root;',
    '}',
    '',
    '// Find Minimum Node (Leftmost element)',
    'Node? FindMin(Node? root) {',
    '  if (root == null) return null;',
    '  while (root.Left != null) { root = root.Left; }',
    '  return root;',
    '}',
    '',
    '// Find Maximum Node (Rightmost element)',
    'Node? FindMax(Node? root) {',
    '  if (root == null) return null;',
    '  while (root.Right != null) { root = root.Right; }',
    '  return root;',
    '}',
    '',
    '// Find a node by key',
    'Node? FindNode(Node? root, int val) {',
    '  if (root == null || root.Data == val) {',
    '    return root;',
    '  }',
    '  if (val < root.Data)',
    '    return FindNode(root.Left, val);',
    '  return FindNode(root.Right, val);',
    '}',
    '',
    '// Find In-Order Predecessor (Max node in left subtree)',
    'Node? FindPredecessor(Node? root, int key) {',
    '  Node? targetNode = FindNode(root, key);',
    '  if (targetNode == null || targetNode.Left == null) {',
    '    return null;',
    '  }',
    '  Node? FindMaxSub(Node? r) {',
    '    if (r == null) return null;',
    '    while (r.Left != null) { r = r.Left; }',
    '    return r;',
    '}',
    '  return FindMaxSub(targetNode.Left);',
    '}',
    '',
    '// Find In-Order Successor (Min node in right subtree)',
    'Node? FindSuccessor(Node? root, int key) {',
    '  Node? targetNode = FindNode(root, key);',
    '  if (targetNode == null || targetNode.Right == null) {',
    '    return null;',
    '  }',
    '  Node? FindMinSub(Node? r) {',
    '    if (r == null) return null;',
    '    while (r.Right != null) { r = r.Right; }',
    '  return r;',
    '}',
    '  return FindMinSub(targetNode.Right);',
    '}',
    '',
    '// Print In-Order Traversal (Left, Root, Right)',
    'void InorderTraversal(Node? root) {',
    '  if (root != null) {',
    '    InorderTraversal(root.Left);',
    '    Console.Write(root.Data + " ");',
    '    InorderTraversal(root.Right);',
    '  }',
    '}',
  ];

  // Add main function
  code.push('// Current tree values (in insertion order as visualized)');
  code.push(`int[] values = {${sorted.map(v => String(v)).join(', ')}};`);
  code.push(`int n = values.Length;`);
  code.push('');
  code.push('class BSTVisualizer {');
  code.push('  static void Main(string[] args) {');
  code.push('    Node? root = null;');
  code.push(`    // Insert elements to form the tree shown in the visualizer`);
  code.push('    for (int i = 0; i < n; i++) {');
  code.push('      root = Insert(root, values[i]);');
  code.push('    }');
  code.push('');

  if (path.length > 0) {
    code.push('    // Operations matching the diagram targets');
    code.push('    Node? minNode = FindMin(root);');
    code.push('    Node? maxNode = FindMax(root);');
    const targetVal = path[path.length - 1];
    code.push(`    Node? targetNode = FindNode(root, ${targetVal});`);
    code.push('    Node? predecessor = null;');
    code.push('    Node? successor = null;');
    if (path.includes(targetVal)) {
      code.push('    predecessor = FindPredecessor(root, ' + targetVal + ');');
      code.push('    successor = FindSuccessor(root, ' + targetVal + ');');
    }
    code.push('');
    code.push('    InorderTraversal(root);');
    code.push('    Console.WriteLine("");');
    code.push(`    Console.WriteLine("TARGET Node: " + targetNode?.Data)`);
    code.push(`    Console.WriteLine("MIN Node:    " + minNode?.Data)`);
    code.push(`    Console.WriteLine("MAX Node:    " + maxNode?.Data)`);
    if (path.length >= 2) {
      code.push('    Console.WriteLine("PRED (<):    " + predecessor?.Data);');
      code.push('    Console.WriteLine("SUCC (>):    " + successor?.Data);');
    }
  }
  code.push('  }');
  code.push('}');

  return code.join('\n');
}

const CODE_GENERATORS: Record<SupportedLanguage, (values: number[], path: number[]) => string> = {
  C: generateCCode,
  JAVA: generateJavaCode,
  'C#': generateCSharpCode,
};

const OPERATION_HIGHLIGHTERS: Record<TerminalOperation, (lines: string[], highlightRef: { current: [number, number] }) => void> = {
  INSERT: (lines, ref) => {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('root = insert(root, values[i]);')) {
        ref.current = [i + 1, i + 1];
        return;
      }
    }
    ref.current = [1, 1];
  },
  DELETE: (lines, ref) => {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('root = delete') || lines[i].includes('root = Insert')) {
        ref.current = [i + 1, i + 1];
        return;
      }
    }
    ref.current = [1, 1];
  },
  SEARCH: (lines, ref) => {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('findNode(root, ')) {
        ref.current = [i + 1, i + 1];
        return;
      }
    }
    ref.current = [1, 1];
  },
  TRAVERSAL: (lines, ref) => {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('void inorderTraversal') || lines[i].includes('void InorderTraversal') || lines[i].includes('void postorder') || lines[i].includes('void preorder')) {
        ref.current = [i + 1, i + 1];
        return;
      }
    }
    ref.current = [1, 1];
  },
  MIN: (lines, ref) => {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('Node* minNode') || lines[i].includes('Node minNode')) {
        ref.current = [i + 1, i + 1];
        return;
      }
    }
    ref.current = [1, 1];
  },
  MAX: (lines, ref) => {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('Node* maxNode') || lines[i].includes('Node maxNode')) {
        ref.current = [i + 1, i + 1];
        return;
      }
    }
    ref.current = [1, 1];
  },
  PRED: (lines, ref) => {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('findPredecessor') || lines[i].includes('FindPredecessor')) {
        ref.current = [i + 1, i + 1];
        return;
      }
    }
    ref.current = [1, 1];
  },
  SUCC: (lines, ref) => {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('findSuccessor') || lines[i].includes('FindSuccessor')) {
        ref.current = [i + 1, i + 1];
        return;
      }
    }
    ref.current = [1, 1];
  },
  FIND: (lines, ref) => {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('findNode(root, ')) {
        ref.current = [i + 1, i + 1];
        return;
      }
    }
    ref.current = [1, 1];
  },
};

const COMPLEXITY_TEXTS: Record<TerminalOperation, { time: string; note: string }> = {
  INSERT: { time: 'TIME O(h)', note: 'h = tree height' },
  DELETE: { time: 'TIME O(h)', note: 'h = tree height' },
  SEARCH: { time: 'TIME O(h)', note: 'h = tree height' },
  TRAVERSAL: { time: 'TIME O(n)', note: 'n = node count' },
  MIN: { time: 'TIME O(h)', note: 'h = tree height' },
  MAX: { time: 'TIME O(h)', note: 'h = tree height' },
  PRED: { time: 'TIME O(h)', note: 'h = tree height' },
  SUCC: { time: 'TIME O(h)', note: 'h = tree height' },
  FIND: { time: 'TIME O(h)', note: 'h = tree height' },
};

export const CodeTerminal: React.FC<CodeTerminalProps> = ({
  action,
  traversalOrder,
  className = '',
}) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('C');
  // Only render code when the tree has values; empty canvas shows the placeholder.
  const treeValues = action.treeValues ?? [];
  const hasTree = treeValues.length > 0;
  const generateCode = CODE_GENERATORS[selectedLang];
  const fullCode = hasTree ? generateCode(treeValues, action.path) : '';
  const lines = hasTree ? fullCode.split('\n') : [];
  // Determine highlight range based on operation
  const highlightRef = { current: [1, 1] as [number, number] };
  const highlightHeder = OPERATION_HIGHLIGHTERS[action.op];
  if (hasTree && highlightHeder) {
    highlightHeder(lines, highlightRef);
  }
  // Apply traversal-order-aware highlighting for TRAVERSAL operation (use traversalOrder to select correct function)
  if (hasTree && action.op === 'TRAVERSAL') {
    // Highlight the function matching the selected traversal order: IN, PRE, or POST
    for (let i = 0; i < lines.length; i++) {
      const lower = lines[i].toLowerCase();
      const isIN = lower.includes('inorder') && lower.includes('traversal');
      const isPRE = lower.includes('preorder') && !lower.includes('inorder');
      const isPOST = lower.includes('postorder') && !lower.includes('inorder') && !lower.includes('preorder');
      if (isIN || isPRE || isPOST) {
        highlightRef.current = [i + 1, i + 1];
        break;
      }
    }
  }
  // traversalOrder drives which traversal function is highlighted when op === 'TRAVERSAL'
  void traversalOrder;

  // Build explanation and complexity based on operation
  const opInfo = COMPLEXITY_TEXTS[action.op];
  const operationLabels: Record<TerminalOperation, string> = {
    INSERT: 'INSERT',
    DELETE: 'DELETE',
    SEARCH: 'SEARCH',
    TRAVERSAL: 'TRAVERSAL',
    MIN: 'MIN',
    MAX: 'MAX',
    PRED: 'PRED',
    SUCC: 'SUCC',
    FIND: 'FIND',
  };

  const traceText = action.path.length > 0 ? action.path.join(' → ') : '—';

  return (
    <Card
      headerTitle="03 CODE TERMINAL"
      headerColorClass="bg-accent-yellow"
      className={`w-full max-w-[360px] h-auto min-h-[620px] md:h-[784px] ${className}`}
    >
      {/* Language Tabs Row */}
      <div className="p-4 border-b-3 border-ink flex items-center gap-2 bg-card select-none flex-shrink-0">
        {(['C', 'JAVA', 'C#'] as SupportedLanguage[]).map((lang) => {
          const isActive = selectedLang === lang;
          return (
            <button
              key={lang}
              type="button"
              onClick={() => setSelectedLang(lang)}
              className={`flex-1 h-[34px] border-2 border-ink rounded-[5px] font-sans font-extrabold text-xs tracking-wider cursor-pointer transition-colors ${
                isActive ? 'bg-ink text-white' : 'bg-card text-ink hover:bg-neutral-100'
              }`}
            >
              {lang}
            </button>
          );
        })}
      </div>

      {/* Subheader — shows filename/operator when tree exists, idle hint otherwise */}
      <div className="h-10 px-4 bg-strip border-b border-ink flex items-center justify-between text-xs font-mono font-bold text-ink select-none flex-shrink-0">
        {hasTree ? (
          <span>{selectedLang === 'C' ? 'insert.c' : selectedLang === 'JAVA' ? 'BST.java' : 'Node.cs'}</span>
        ) : (
          <span className="text-muted-text/70 font-sans">no file yet</span>
        )}
        <span className="text-[11px] tracking-wider uppercase font-sans font-extrabold text-ink/80">
          {hasTree ? operationLabels[action.op] : 'idle'}
        </span>
      </div>

      {/* Code Viewer Panel — empty placeholder until the first insert */}
      {!hasTree ? (
        <div
          className="h-[260px] sm:h-[300px] md:h-[392px] bg-panel flex flex-col items-center justify-center gap-3 select-none flex-shrink-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(32,32,28,0.08) 0.9px, transparent 0.9px)',
            backgroundSize: '12px 12px',
          }}
        >
          <span className="font-sans font-extrabold text-sm tracking-wider uppercase text-ink">
            No tree yet
          </span>
          <span className="font-sans text-xs text-muted-text leading-relaxed text-center max-w-[220px]">
            Insert a value from the command hub to generate the BST code in C, Java, and C#.
          </span>
        </div>
      ) : (
        <div
          className="h-[260px] sm:h-[300px] md:h-[392px] bg-panel p-4 overflow-y-auto font-mono text-[13px] leading-[22px] text-ink select-text flex-shrink-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(32,32,28,0.08) 0.9px, transparent 0.9px)',
            backgroundSize: '12px 12px',
          }}
        >
          {lines.map((line, idx) => {
            const currentLine = idx + 1;
            const isHighlighted =
              currentLine >= highlightRef.current[0] && currentLine <= highlightRef.current[1];

            return (
              <div
                key={currentLine}
                className={`flex items-center -mx-4 px-4 ${
                  isHighlighted ? 'bg-tint-purple font-semibold' : ''
                }`}
              >
                <span className="w-8 text-muted-text/70 select-none text-right pr-3 font-mono text-xs">
                  {String(currentLine).padStart(2, '0')}
                </span>
                <pre className="font-mono text-ink overflow-x-auto whitespace-pre">
                  {line || ' '}
                </pre>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Explanation Panel — empty until the tree has values */}
      <div className="flex-1 bg-card border-t-3 border-ink p-4 flex flex-col justify-between select-none">
        {!hasTree ? (
          <div className="flex flex-col items-center justify-center gap-2 h-full">
            <span className="font-sans font-extrabold text-xs tracking-wider uppercase text-muted-text">
              Waiting for tree
            </span>
            <span className="font-sans text-[11px] text-muted-text/80 text-center max-w-[220px]">
              The code, trace, and complexity will appear here once you insert a node.
            </span>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <div className="font-sans font-extrabold text-xs tracking-wide text-ink">
                {opInfo ? opInfo.time : 'TIME O(h)'}
              </div>
              <p className="font-sans text-xs text-ink/90 leading-relaxed font-normal">
                {opInfo ? opInfo.note : 'h = tree height'}
              </p>

              {/* Live trace from canvas */}
              <div className="h-[26px] bg-strip border-2 border-ink rounded-[5px] px-2.5 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                <span className="font-sans font-extrabold text-[10px] tracking-wider uppercase text-ink flex-shrink-0">
                  Trace
                </span>
                <span className="font-mono font-bold text-[11px] text-ink">
                  {traceText}
                </span>
              </div>
            </div>

            {/* Complexity Badge */}
            <div className="h-[38px] bg-accent-lime border-2 border-ink rounded-[5px] px-3 flex items-center justify-between mt-3">
              <span className="font-sans font-extrabold text-xs tracking-wider text-ink uppercase">
                {opInfo ? opInfo.time : 'TIME O(h)'}
              </span>
              <span className="font-sans font-medium text-xs text-ink">
                {opInfo ? opInfo.note : 'h = tree height'}
              </span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default CodeTerminal;