import React, { useEffect, useState } from 'react';
import Card from './Card';
import { BSTValue, parseBSTValue } from '../lib/bst';

export type TraversalType = 'PRE' | 'IN' | 'POST';

export interface CommandHubProps {
  resetSignal?: number;
  onInsert: (val: BSTValue) => void;
  onDelete: (val: BSTValue) => void;
  onSearch: (val: BSTValue) => void;
  onSelectMin: () => void;
  onSelectMax: () => void;
  onSelectPred: () => void;
  onSelectSucc: () => void;
  traversalOrder: TraversalType;
  onTraversalChange: (order: TraversalType) => void;
  className?: string;
}

export const CommandHub: React.FC<CommandHubProps> = ({
  resetSignal = 0,
  onInsert,
  onDelete,
  onSearch,
  onSelectMin,
  onSelectMax,
  onSelectPred,
  onSelectSucc,
  traversalOrder,
  onTraversalChange,
  className = '',
}) => {
  const [insertVal, setInsertVal] = useState('');
  const [deleteVal, setDeleteVal] = useState('');
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    setInsertVal('');
    setDeleteVal('');
    setSearchVal('');
  }, [resetSignal]);

  const handleInsertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseBSTValue(insertVal);
    if (parsed !== null) {
      onInsert(parsed);
      setInsertVal('');
    }
  };

  const handleDeleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseBSTValue(deleteVal);
    if (parsed !== null) {
      onDelete(parsed);
      setDeleteVal('');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseBSTValue(searchVal);
    if (parsed !== null) {
      onSearch(parsed);
      setSearchVal('');
    }
  };

  return (
    <Card
      headerTitle="01 COMMAND HUB"
      headerColorClass="bg-accent-lime"
      className={`w-full max-w-[286px] h-auto min-h-[620px] md:h-[784px] ${className}`}
    >
      <div className="p-5 flex flex-col justify-between flex-1 gap-3 overflow-y-auto">
        {/* Section 1: INSERT NODE */}
        <form onSubmit={handleInsertSubmit} className="flex flex-col gap-1.5">
          <label className="font-sans font-extrabold text-xs tracking-wider uppercase text-ink">
            INSERT NODE
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={insertVal}
              onChange={(e) => setInsertVal(e.target.value)}
              className="w-full h-9 px-3 bg-white border-2 border-ink rounded-[5px] text-ink font-mono text-sm font-semibold focus:outline-none"
            />
            <span className="absolute right-3 text-xs font-mono text-muted-text pointer-events-none select-none">
              Enter
            </span>
          </div>
          <button
            type="submit"
            className="w-full h-10 bg-accent-purple border-2 border-ink rounded-[6px] shadow-btn flex items-center justify-center gap-2 font-sans font-extrabold text-sm text-ink active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <svg
              className="w-4 h-4 stroke-2 stroke-ink"
              viewBox="0 0 16 16"
              fill="none"
              strokeLinecap="round"
            >
              <path d="M8 2.5V13.5M2.5 8H13.5" />
            </svg>
            <span>INSERT</span>
          </button>
        </form>

        {/* Section 2: DELETE NODE */}
        <form onSubmit={handleDeleteSubmit} className="flex flex-col gap-1.5">
          <label className="font-sans font-extrabold text-xs tracking-wider uppercase text-ink">
            DELETE NODE
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={deleteVal}
              onChange={(e) => setDeleteVal(e.target.value)}
              className="w-full h-9 px-3 bg-white border-2 border-ink rounded-[5px] text-ink font-mono text-sm font-semibold focus:outline-none"
            />
            <span className="absolute right-3 text-xs font-mono text-muted-text pointer-events-none select-none">
              Enter
            </span>
          </div>
          <button
            type="submit"
            className="w-full h-10 bg-accent-coral border-2 border-ink rounded-[6px] shadow-btn flex items-center justify-center gap-2 font-sans font-extrabold text-sm text-ink active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <svg
              className="w-4 h-4 stroke-2 stroke-ink"
              viewBox="0 0 16 16"
              fill="none"
              strokeLinecap="round"
            >
              <path d="M3 4.5h10M6 4.5V3a1 1 0 011-1h2a1 1 0 011 1v1.5M4.5 4.5v8a1 1 0 001 1h5a1 1 0 001-1v-8M6.5 7.5v3.5M9.5 7.5v3.5" />
            </svg>
            <span>DELETE</span>
          </button>
        </form>

        {/* Section 3: SEARCH NODE */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-1.5">
          <label className="font-sans font-extrabold text-xs tracking-wider uppercase text-ink">
            SEARCH NODE
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full h-9 px-3 bg-white border-2 border-ink rounded-[5px] text-ink font-mono text-sm font-semibold focus:outline-none"
            />
            <svg
              className="w-4 h-4 stroke-2 stroke-ink absolute right-3 pointer-events-none"
              viewBox="0 0 16 16"
              fill="none"
              strokeLinecap="round"
            >
              <circle cx="7" cy="7" r="4.5" />
              <path d="M10.5 10.5L14 14" />
            </svg>
          </div>
          <button
            type="submit"
            className="w-full h-10 bg-accent-mint border-2 border-ink rounded-[6px] shadow-btn flex items-center justify-center gap-2 font-sans font-extrabold text-sm text-ink active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <svg
              className="w-4 h-4 stroke-2 stroke-ink"
              viewBox="0 0 16 16"
              fill="none"
              strokeLinecap="round"
            >
              <circle cx="7" cy="7" r="4.5" />
              <path d="M10.5 10.5L14 14" />
            </svg>
            <span>SEARCH</span>
          </button>
        </form>

        {/* Section 4: ANALYSIS & TARGETS */}
        <div className="flex flex-col gap-2">
          <div className="font-sans font-extrabold text-xs tracking-wider uppercase text-ink">
            ANALYSIS &amp; TARGETS
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onSelectMin}
              className="h-[34px] bg-accent-yellow border-2 border-ink rounded-[5px] flex items-center justify-center gap-1 font-sans font-extrabold text-xs text-ink active:scale-95 transition-transform cursor-pointer"
            >
              <span>↓</span>
              <span>MIN</span>
            </button>
            <button
              type="button"
              onClick={onSelectMax}
              className="h-[34px] bg-accent-yellow border-2 border-ink rounded-[5px] flex items-center justify-center gap-1 font-sans font-extrabold text-xs text-ink active:scale-95 transition-transform cursor-pointer"
            >
              <span>↑</span>
              <span>MAX</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onSelectPred}
              className="h-[42px] bg-accent-sky border-2 border-ink rounded-[5px] flex flex-col items-center justify-center leading-tight active:scale-95 transition-transform cursor-pointer"
            >
              <span className="font-sans font-extrabold text-xs text-ink">&lt; PRED</span>
              <span className="font-sans font-normal text-[10px] text-muted-text">Previous value</span>
            </button>
            <button
              type="button"
              onClick={onSelectSucc}
              className="h-[42px] bg-accent-mint border-2 border-ink rounded-[5px] flex flex-col items-center justify-center leading-tight active:scale-95 transition-transform cursor-pointer"
            >
              <span className="font-sans font-extrabold text-xs text-ink">SUCC &gt;</span>
              <span className="font-sans font-normal text-[10px] text-muted-text">Next value</span>
            </button>
          </div>
        </div>

        {/* Section 5: TRAVERSALS */}
        <div className="flex flex-col gap-2">
          <div className="font-sans font-extrabold text-xs tracking-wider uppercase text-ink">
            TRAVERSALS
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['PRE', 'IN', 'POST'] as TraversalType[]).map((order) => {
              const isSelected = traversalOrder === order;
              return (
                <button
                  key={order}
                  type="button"
                  onClick={() => onTraversalChange(order)}
                  className={`h-[34px] border-2 border-ink rounded-[5px] font-sans font-extrabold text-xs tracking-wider cursor-pointer transition-colors ${
                    isSelected ? 'bg-ink text-white' : 'bg-card text-ink'
                  }`}
                >
                  {order}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-ink font-sans font-medium leading-relaxed">
            Select an order to explore how the tree is visited
          </p>
          <p className="text-xs text-muted-text font-sans leading-relaxed">
            Tip: select a node before finding its predecessor or successor.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CommandHub;

