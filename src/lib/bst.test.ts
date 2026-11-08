import { describe, expect, it } from 'vitest';
import { collectTreeValues, createDefaultTree } from './bst';

describe('collectTreeValues', () => {
  it('returns the live BST values in sorted in-order sequence', () => {
    expect(collectTreeValues(createDefaultTree())).toEqual([20, 30, 40, 50, 60, 70, 80]);
  });
});
