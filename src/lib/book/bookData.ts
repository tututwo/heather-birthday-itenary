export const PAGE_SCROLL_VH = 25;

export type StoryboardSpread = {
  id: string;
  stopNumber: number;
  imageSrc: string;
  imageAlt: string;
};

export type StoryboardPageFace = {
  kind: 'storyboard';
  id: string;
  spreadId: string;
  side: 'left' | 'right';
  imageSrc: string;
  imageAlt: string;
  objectPosition: 'left center' | 'right center';
};

export type CoverPageFace = {
  kind: 'cover';
  id: string;
  title: string;
  subtitle: string;
  caption: string;
};

export type PageFace = StoryboardPageFace | CoverPageFace;

export type BookLeaf = {
  id: string;
  pageIndex: number;
  front?: PageFace;
  back?: PageFace;
  variant: 'front-cover' | 'paper' | 'back-cover';
};

export const storyboardSpreads: readonly StoryboardSpread[] = [
  {
    id: 'stop-1',
    stopNumber: 1,
    imageSrc: new URL('../../../assets/storyboard/stop1.png', import.meta.url).href,
    imageAlt: 'Birthday trip itinerary stop 1 spread'
  },
  {
    id: 'stop-2',
    stopNumber: 2,
    imageSrc: new URL('../../../assets/storyboard/stop2.png', import.meta.url).href,
    imageAlt: 'Birthday trip itinerary stop 2 spread'
  },
  {
    id: 'stop-3',
    stopNumber: 3,
    imageSrc: new URL('../../../assets/storyboard/stop3.png', import.meta.url).href,
    imageAlt: 'Birthday trip itinerary stop 3 spread'
  },
  {
    id: 'stop-4',
    stopNumber: 4,
    imageSrc: new URL('../../../assets/storyboard/stop4.png', import.meta.url).href,
    imageAlt: 'Birthday trip itinerary stop 4 spread'
  },
  {
    id: 'stop-5',
    stopNumber: 5,
    imageSrc: new URL('../../../assets/storyboard/stop5.png', import.meta.url).href,
    imageAlt: 'Birthday trip itinerary stop 5 spread'
  },
  {
    id: 'stop-6',
    stopNumber: 6,
    imageSrc: new URL('../../../assets/storyboard/stop6.png', import.meta.url).href,
    imageAlt: 'Birthday trip itinerary stop 6 spread'
  },
  {
    id: 'stop-7',
    stopNumber: 7,
    imageSrc: new URL('../../../assets/storyboard/stop7.png', import.meta.url).href,
    imageAlt: 'Birthday trip itinerary stop 7 spread'
  }
];

export const STORYBOARD_SPREAD_COUNT = storyboardSpreads.length;
export const BOOK_LEAF_COUNT = STORYBOARD_SPREAD_COUNT + 1;
export const TOTAL_SCROLL_VH = BOOK_LEAF_COUNT * PAGE_SCROLL_VH + 100;

const frontCoverFace: CoverPageFace = {
  kind: 'cover',
  id: 'front-cover-face',
  title: "Heather's Birthday Trip",
  subtitle: 'A birthday field trip in little stops',
  caption: 'For my favorite teacher <3'
};

const backCoverFace: CoverPageFace = {
  kind: 'cover',
  id: 'back-cover-face',
  title: 'The End',
  subtitle: 'One more birthday memory with you',
  caption: 'Always my favorite person'
};

const storyboardFace = (spread: StoryboardSpread, side: StoryboardPageFace['side']): StoryboardPageFace => ({
  kind: 'storyboard',
  id: `${spread.id}-${side}`,
  spreadId: spread.id,
  side,
  imageSrc: spread.imageSrc,
  imageAlt: `${spread.imageAlt}, ${side} page`,
  objectPosition: side === 'left' ? 'left center' : 'right center'
});

const paperLeaves: readonly BookLeaf[] = storyboardSpreads.slice(0, -1).map((spread, index) => {
  const nextSpread = storyboardSpreads[index + 1];

  return {
    id: `paper-${index + 1}`,
    pageIndex: index + 2,
    front: storyboardFace(spread, 'right'),
    back: storyboardFace(nextSpread, 'left'),
    variant: 'paper'
  };
});

export const leaves: readonly BookLeaf[] = [
  {
    id: 'front-cover',
    pageIndex: 1,
    front: frontCoverFace,
    back: storyboardFace(storyboardSpreads[0], 'left'),
    variant: 'front-cover'
  },
  ...paperLeaves,
  {
    id: 'back-cover',
    pageIndex: BOOK_LEAF_COUNT,
    front: storyboardFace(storyboardSpreads[STORYBOARD_SPREAD_COUNT - 1], 'right'),
    back: backCoverFace,
    variant: 'back-cover'
  }
];
