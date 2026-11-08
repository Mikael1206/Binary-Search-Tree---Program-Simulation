import React, { useState } from 'react';
import {
  insert,
  deleteNode,
  search,
  findMin,
  findMax,
  findPredecessor,
  findSuccessor,
  getSearchPath,
  inorder,
  preorder,
  postorder,
  collectTreeValues,
  BSTNode,
} from './lib/bst';
import CommandHub, { TraversalType } from './components/CommandHub';
import TreeCanvas from './components/TreeCanvas';
import CodeTerminal, { TerminalAction } from './components/CodeTerminal';

export const App: React.FC = () => {
  // The canvas starts empty; nodes appear as the user inserts them.
  const [tree, setTree] = useState<BSTNode | null>(null);
  const [selectedVal, setSelectedVal] = useState<number | null>(null);
  const [traversalOrder, setTraversalOrder] = useState<TraversalType>('IN');
  const [statusMessage, setStatusMessage] = useState<string>(
    'Tree is empty. Insert a value from the command hub to begin.'
  );
  const [hubResetSignal, setHubResetSignal] = useState(0);
  const [lastAction, setLastAction] = useState<TerminalAction>({
    op: 'INSERT',
    val: null,
    path: [] as number[],
    treeValues: [] as number[],
  });

  // Compute active min, max, predecessor, and successor
  const minNode = findMin(tree);
  const maxNode = findMax(tree);
  const predNode = selectedVal !== null ? findPredecessor(tree, selectedVal) : null;
  const succNode = selectedVal !== null ? findSuccessor(tree, selectedVal) : null;

  // Compute active traversal sequence
  const traversalSequence =
    traversalOrder === 'IN'
      ? inorder(tree)
      : traversalOrder === 'PRE'
      ? preorder(tree)
      : postorder(tree);

  const handleInsert = (val: number) => {
    const exists = search(tree, val) !== null;
    const path = getSearchPath(tree, val);
    if (!exists) path.push(val);

    const nextTree = insert(tree, val);
    setTree(nextTree);
    setSelectedVal(val);

    setLastAction({
      op: 'INSERT',
      val,
      path,
      treeValues: collectTreeValues(nextTree),
    });
    setStatusMessage(
      exists
        ? `Node ${val} already exists. BST keeps unique values.`
        : `Inserted node ${val}. Tree updated.`
    );
  };

  const handleDelete = (val: number) => {
    const exists = search(tree, val) !== null;
    const path = getSearchPath(tree, val);
    const nextTree = deleteNode(tree, val);

    setTree(nextTree);
    if (selectedVal === val) {
      setSelectedVal(nextTree ? nextTree.val : null);
    }

    setLastAction({
      op: 'DELETE',
      val,
      path,
      treeValues: collectTreeValues(nextTree),
    });
    setStatusMessage(
      exists ? `Deleted node ${val} from tree.` : `Node ${val} not found. Nothing deleted.`
    );
  };

  const handleSearch = (val: number) => {
    const path = getSearchPath(tree, val);
    const found = search(tree, val);

    setLastAction({
      op: 'SEARCH',
      val,
      path,
      treeValues: collectTreeValues(tree),
    });
    if (found) {
      setSelectedVal(val);
      setStatusMessage(`Found node ${val} in tree.`);
    } else {
      setStatusMessage(`Node ${val} not found in tree.`);
    }
  };

  const handleSelectMin = () => {
    if (minNode) {
      setSelectedVal(minNode.val);
      setStatusMessage(`Minimum node: ${minNode.val}`);
    }
  };

  const handleSelectMax = () => {
    if (maxNode) {
      setSelectedVal(maxNode.val);
      setStatusMessage(`Maximum node: ${maxNode.val}`);
    }
  };

  const handleSelectPred = () => {
    if (predNode) {
      setSelectedVal(predNode.val);
      setStatusMessage(`Predecessor found: ${predNode.val}`);
    } else {
      setStatusMessage(`No predecessor for node ${selectedVal}`);
    }
  };

  const handleSelectSucc = () => {
    if (succNode) {
      setSelectedVal(succNode.val);
      setStatusMessage(`Successor found: ${succNode.val}`);
    } else {
      setStatusMessage(`No successor for node ${selectedVal}`);
    }
  };

  const handleTraversalChange = (order: TraversalType) => {
    setTraversalOrder(order);
    setLastAction({
      op: 'TRAVERSAL',
      val: null,
      path: [],
      treeValues: collectTreeValues(tree),
    });
  };

  const handleReset = () => {
    setTree(null);
    setSelectedVal(null);
    setTraversalOrder('IN');
    setHubResetSignal((prev) => prev + 1);
    setLastAction({
      op: 'INSERT',
      val: null,
      path: [],
      treeValues: [],
    });
    setStatusMessage('Tree reset. Insert a value from the command hub to begin.');
  };

  return (
    <div
      className="min-h-screen bg-canvas text-ink px-3 sm:px-4 md:px-6 xl:px-8 pt-3 sm:pt-4 pb-8 sm:pb-10 flex flex-col items-center select-text"
      style={{
        backgroundImage: 'radial-gradient(rgba(32,32,28,0.12) 0.9px, transparent 0.9px)',
        backgroundSize: '12px 12px',
      }}
    >
      <div className="w-full max-w-[1376px] flex flex-col gap-2 sm:gap-3">
        <header className="flex justify-center select-none flex-shrink-0 pb-1 pt-1">
          <h1 className="flex flex-col items-center justify-center whitespace-nowrap leading-none tracking-[-0.085em] text-ink uppercase max-w-full sm:flex-row sm:items-end sm:justify-center">
            <span className="inline-block font-black italic leading-[0.72] text-[68px] xs:text-[80px] sm:text-[120px] md:text-[150px] lg:text-[180px] xl:text-[210px] align-middle">
              BINARY
            </span>
            <span className="inline-block font-black leading-[0.9] text-[26px] sm:pb-1 sm:text-[38px] md:text-[52px] lg:text-[70px] xl:text-[76px] tracking-[-0.07em] align-bottom">
              SEARCH TREE
            </span>
          </h1>
        </header>

        <main className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-[minmax(260px,286px)_minmax(0,1fr)_minmax(280px,360px)] justify-center items-start mt-0.5">
          <CommandHub
            resetSignal={hubResetSignal}
            onInsert={handleInsert}
            onDelete={handleDelete}
            onSearch={handleSearch}
            onSelectMin={handleSelectMin}
            onSelectMax={handleSelectMax}
            onSelectPred={handleSelectPred}
            onSelectSucc={handleSelectSucc}
            traversalOrder={traversalOrder}
            onTraversalChange={handleTraversalChange}
            className="w-full max-w-[420px] justify-self-center lg:max-w-none lg:w-[286px]"
          />

          <TreeCanvas
            root={tree}
            selectedVal={selectedVal}
            minVal={minNode ? minNode.val : null}
            maxVal={maxNode ? maxNode.val : null}
            predVal={predNode ? predNode.val : null}
            succVal={succNode ? succNode.val : null}
            traversalOrder={traversalOrder}
            traversalSequence={traversalSequence}
            statusMessage={statusMessage}
            onSelectNode={setSelectedVal}
            onReset={handleReset}
            className="w-full max-w-[420px] justify-self-center lg:max-w-none lg:w-full"
          />

          <CodeTerminal
            action={lastAction}
            traversalOrder={traversalOrder}
            className="w-full max-w-[420px] justify-self-center lg:max-w-none lg:w-[360px]"
          />
        </main>
      </div>
    </div>
  );
};

export default App;
