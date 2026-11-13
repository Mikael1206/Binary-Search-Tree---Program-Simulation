import { describe, expect, it } from 'vitest';
import { collectTreeValues, createDefaultTree, insert, search } from './bst';

describe('collectTreeValues', () => {
  it('returns the live BST values in sorted in-order sequence', () => {
    expect(collectTreeValues(createDefaultTree())).toEqual([20, 30, 40, 50, 60, 70, 80]);
  });

  it('supports alphabetic values from A through Z in BST ordering', () => {
    const tree = insert(insert(insert(null, 'C'), 'A'), 'B');

    expect(search(tree, 'A')).not.toBeNull();
    expect(search(tree, 'B')).not.toBeNull();
    expect(search(tree, 'C')).not.toBeNull();
    expect(collectTreeValues(tree)).toEqual(['A', 'B', 'C']);
  });
});
