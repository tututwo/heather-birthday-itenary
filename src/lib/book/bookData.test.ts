import { describe, expect, it } from 'vitest';
import { leaves, storyboardSpreads } from './bookData';

const getStoryboardFace = (leafIndex: number, side: 'front' | 'back') => {
  const face = leaves[leafIndex]?.[side];

  if (face?.kind !== 'storyboard') {
    throw new Error(`Expected storyboard face at leaf ${leafIndex} ${side}`);
  }

  return face;
};

describe('bookData storyboard layout', () => {
  it('creates one visible spread from each adjacent pair of leaf faces', () => {
    expect(storyboardSpreads).toHaveLength(7);
    expect(leaves).toHaveLength(storyboardSpreads.length + 1);
    expect(leaves[0]?.front).toMatchObject({
      kind: 'cover',
      title: "Heather's Birthday Trip"
    });

    storyboardSpreads.forEach((spread, index) => {
      const leftFace = getStoryboardFace(index, 'back');
      const rightFace = getStoryboardFace(index + 1, 'front');

      expect(leftFace).toMatchObject({
        side: 'left',
        spreadId: spread.id,
        imageSrc: spread.imageSrc
      });
      expect(rightFace).toMatchObject({
        side: 'right',
        spreadId: spread.id,
        imageSrc: spread.imageSrc
      });
    });
  });
});
