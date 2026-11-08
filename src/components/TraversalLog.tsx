import React from 'react';
import { TraversalType } from './CommandHub';

export interface TraversalLogProps {
  orderType: TraversalType;
  sequence: number[];
  selectedVal: number | null;
  predVal: number | null;
  succVal: number | null;
  isRoot: boolean;
  statusMessage?: string;
  className?: string;
}

export const TraversalLog: React.FC<TraversalLogProps> = ({
  orderType,
  sequence,
  selectedVal,
  predVal,
  succVal,
  isRoot,
  statusMessage,
  className = '',
}) => {
  const orderFormula =
    orderType === 'IN'
      ? 'INORDER - LEFT / ROOT / RIGHT'
      : orderType === 'PRE'
      ? 'PREORDER - ROOT / LEFT / RIGHT'
      : 'POSTORDER - LEFT / RIGHT / ROOT';

  return (
    <div className={`bg-card flex flex-col justify-between p-5 border-t-3 border-ink h-[228px] ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between text-xs font-extrabold text-ink select-none">
        <span className="tracking-wider uppercase">TRAVERSAL LOG</span>
        <span className="font-mono text-xs tracking-wide">{orderFormula}</span>
      </div>

      {/* Sequence Strip */}
      <div className="w-full h-11 bg-strip border-2 border-ink rounded-[5px] flex items-center px-4 overflow-x-auto gap-2 select-none">
        {sequence.map((val, idx) => {
          const isSelected = val === selectedVal;
          return (
            <React.Fragment key={val}>
              {isSelected ? (
                <div className="h-7 px-2.5 bg-accent-pink border-2 border-ink rounded-[3px] flex items-center justify-center font-mono font-extrabold text-sm text-ink">
                  {val}
                </div>
              ) : (
                <span className="font-mono font-bold text-sm text-ink">{val}</span>
              )}
              {idx < sequence.length - 1 && (
                <span className="font-mono font-bold text-sm text-ink/70">→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* 3 Info Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="h-[52px] bg-tint-pink rounded-[6px] px-3 flex flex-col justify-center">
          <span className="font-sans font-extrabold text-[10px] tracking-wider text-ink uppercase">
            SELECTED
          </span>
          <span className="font-mono font-extrabold text-sm text-ink leading-tight">
            {selectedVal !== null ? `${selectedVal}${isRoot ? ' - Root' : ''}` : 'None'}
          </span>
        </div>

        <div className="h-[52px] bg-tint-sky rounded-[6px] px-3 flex flex-col justify-center">
          <span className="font-sans font-extrabold text-[10px] tracking-wider text-ink uppercase">
            PREDECESSOR
          </span>
          <span className="font-mono font-extrabold text-sm text-ink leading-tight">
            {predVal !== null ? predVal : 'None'}
          </span>
        </div>

        <div className="h-[52px] bg-tint-mint rounded-[6px] px-3 flex flex-col justify-center">
          <span className="font-sans font-extrabold text-[10px] tracking-wider text-ink uppercase">
            SUCCESSOR
          </span>
          <span className="font-mono font-extrabold text-sm text-ink leading-tight">
            {succVal !== null ? succVal : 'None'}
          </span>
        </div>
      </div>

      {/* Status Notice */}
      <div className="flex items-center gap-2 text-xs font-sans font-semibold text-ink select-none">
        <svg
          className="w-4 h-4 text-ink flex-shrink-0"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="8" cy="8" r="7" />
          <path d="M5 8l2 2 4-4" />
        </svg>
        <span className="truncate">
          {statusMessage ||
            (selectedVal !== null
              ? `Found ${selectedVal}. Inorder traversal returns values in ascending order.`
              : 'Select a node or trigger an operation.')}
        </span>
      </div>
    </div>
  );
};

export default TraversalLog;

