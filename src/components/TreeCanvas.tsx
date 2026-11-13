import React from 'react';
import Card from './Card';
import TraversalLog from './TraversalLog';
import { BSTNode, BSTValue, getNodeCount, getHeight } from '../lib/bst';
import { TraversalType } from './CommandHub';

export interface TreeCanvasProps {
  root: BSTNode | null;
  selectedVal: BSTValue | null;
  minVal: BSTValue | null;
  maxVal: BSTValue | null;
  predVal: BSTValue | null;
  succVal: BSTValue | null;
  traversalOrder: TraversalType;
  traversalSequence: BSTValue[];
  statusMessage?: string;
  onSelectNode: (val: BSTValue) => void;
  onReset: () => void;
  className?: string;
}

interface NodeLayout {
  val: BSTValue;
  x: number;
  y: number;
  role: 'target' | 'min' | 'max' | 'pred' | 'succ' | 'normal';
  subLabel?: string;
}

interface EdgeLayout {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

const NODE_SIZE = 56;
// Horizontal space reserved for every node, so subtrees never overlap.
const H_GAP = 88;
const V_GAP = 116;
const PAD_X = 48;
const PAD_TOP = 76;
const PAD_BOTTOM = 64;
// Visible canvas viewport (card width minus its 3px borders).
const VIEW_W = 684;
const VIEW_H = 440;

export const TreeCanvas: React.FC<TreeCanvasProps> = ({
  root,
  selectedVal,
  minVal,
  maxVal,
  predVal,
  succVal,
  traversalOrder,
  traversalSequence,
  statusMessage,
  onSelectNode,
  onReset,
  className = '',
}) => {
  const nodeCount = getNodeCount(root);
  const height = getHeight(root);

  // --- Layout -------------------------------------------------------------
  // Nodes are spaced by their inorder index, which keeps every node on its own
  // column no matter how lopsided the tree gets.
  const nodes: NodeLayout[] = [];
  const edges: EdgeLayout[] = [];
  const columnByNode = new Map<BSTNode, number>();
  let column = 0;

  const assignColumn = (node: BSTNode | null) => {
    if (!node) return;
    assignColumn(node.left);
    columnByNode.set(node, column);
    column += 1;
    assignColumn(node.right);
  };
  assignColumn(root);

  const span = Math.max(column - 1, 0);
  const contentWidth = Math.max(VIEW_W, span * H_GAP + NODE_SIZE + PAD_X * 2);
  const contentHeight = Math.max(
    VIEW_H,
    Math.max(height - 1, 0) * V_GAP + NODE_SIZE + PAD_TOP + PAD_BOTTOM
  );
  // Keep the tree centred when it is narrower than the viewport.
  const originX = (contentWidth - span * H_GAP) / 2;

  const walk = (node: BSTNode | null, depth: number, parent?: { x: number; y: number }) => {
    if (!node) return;

    const x = originX + (columnByNode.get(node) ?? 0) * H_GAP;
    const y = PAD_TOP + depth * V_GAP;

    if (parent) {
      edges.push({ fromX: parent.x, fromY: parent.y, toX: x, toY: y });
    }

    let role: NodeLayout['role'] = 'normal';
    let subLabel: string | undefined = undefined;

    if (node.val === selectedVal) {
      role = 'target';
    } else if (node.val === minVal) {
      role = 'min';
      subLabel = 'MIN';
    } else if (node.val === maxVal) {
      role = 'max';
      subLabel = 'MAX';
    } else if (node.val === predVal) {
      role = 'pred';
      subLabel = '< PRED';
    } else if (node.val === succVal) {
      role = 'succ';
      subLabel = 'SUCC >';
    }

    nodes.push({ val: node.val, x, y, role, subLabel });

    const childAnchor = { x, y: y + NODE_SIZE };
    walk(node.left, depth + 1, childAnchor);
    walk(node.right, depth + 1, childAnchor);
  };
  walk(root, 0);

  const targetNode = nodes.find((n) => n.val === selectedVal) ?? null;

  const getNodeColorClass = (role: NodeLayout['role']) => {
    switch (role) {
      case 'target':
        return 'bg-accent-pink';
      case 'min':
      case 'max':
        return 'bg-accent-yellow';
      case 'pred':
        return 'bg-accent-sky';
      case 'succ':
        return 'bg-accent-mint';
      default:
        return 'bg-card';
    }
  };

  return (
    <Card
      headerTitle="02 LIVE CANVAS"
      headerColorClass="bg-accent-pink"
      className={`w-full max-w-[690px] h-auto min-h-[620px] md:h-[784px] ${className}`}
    >
      {/* Subbar: Stats & Reset Button */}
      <div className="h-[52px] px-6 border-b-3 border-ink flex items-center justify-between bg-card flex-shrink-0 select-none">
        <div className="flex items-center">
          <span className="font-sans font-extrabold text-xs tracking-wider text-ink uppercase">
            NODES {nodeCount}
          </span>
          <div className="w-px h-[18px] bg-muted-divider mx-4" />
          <span className="font-sans font-extrabold text-xs tracking-wider text-ink uppercase">
            HEIGHT {height} levels
          </span>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 font-sans font-extrabold text-xs text-ink hover:underline cursor-pointer active:scale-95 transition-transform"
        >
          <svg
            className="w-3.5 h-3.5 stroke-2 stroke-ink fill-none"
            viewBox="0 0 16 16"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 8a5.5 5.5 0 101.6-3.9L2 6M2 2v4h4" />
          </svg>
          <span>Reset tree</span>
        </button>
      </div>

      {/* Live Canvas Area — scrolls when the tree grows past the viewport */}
      <div
        className="relative w-full h-[320px] sm:h-[360px] md:h-[440px] bg-panel border-b-3 border-ink overflow-auto select-none flex-shrink-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(32,32,28,0.08) 0.9px, transparent 0.9px)',
          backgroundSize: '12px 12px',
        }}
      >
        {root === null ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-8 text-center">
            <span className="font-sans font-extrabold text-sm tracking-wider uppercase text-ink">
              Empty tree
            </span>
            <span className="font-sans font-medium text-xs text-muted-text leading-relaxed max-w-[280px]">
              Insert a value from the command hub to start building the tree.
            </span>
          </div>
        ) : (
          <div
            className="relative"
            style={{ width: contentWidth, height: contentHeight, minWidth: '100%' }}
          >
            {/* Target Indicator badge */}
            {targetNode && (
              <div
                className="absolute -translate-x-1/2 z-20 pointer-events-none"
                style={{ left: targetNode.x, top: targetNode.y - 34 }}
              >
                <span className="px-3 py-1 bg-ink text-white font-sans font-extrabold text-[11px] tracking-wider rounded-[4px] uppercase shadow-sm">
                  TARGET
                </span>
              </div>
            )}

            {/* Tree SVG Lines */}
            <svg
              className="absolute left-0 top-0 pointer-events-none z-0"
              width={contentWidth}
              height={contentHeight}
            >
              {edges.map((edge, idx) => (
                <line
                  key={idx}
                  x1={edge.fromX}
                  y1={edge.fromY}
                  x2={edge.toX}
                  y2={edge.toY}
                  className="stroke-ink stroke-[3px]"
                  strokeLinecap="round"
                />
              ))}
            </svg>

            {/* Tree Nodes */}
            {nodes.map((node) => (
              <div
                key={node.val}
                className="absolute -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer"
                style={{ left: node.x, top: node.y }}
                onClick={() => onSelectNode(node.val)}
              >
                <div
                  className={`w-14 h-14 rounded-node border-3 border-ink shadow-node flex items-center justify-center font-mono font-extrabold text-lg text-ink transition-transform hover:scale-105 active:scale-95 ${getNodeColorClass(
                    node.role
                  )}`}
                >
                  {node.val}
                </div>

                {/* Sublabel below node */}
                {node.subLabel && (
                  <span className="absolute -bottom-5 font-sans font-extrabold text-[10px] text-ink whitespace-nowrap tracking-wider">
                    {node.subLabel}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Traversal Log Subpanel */}
      <TraversalLog
        orderType={traversalOrder}
        sequence={traversalSequence}
        selectedVal={selectedVal}
        predVal={predVal}
        succVal={succVal}
        isRoot={root !== null && selectedVal === root.val}
        statusMessage={statusMessage}
      />
    </Card>
  );
};

export default TreeCanvas;
