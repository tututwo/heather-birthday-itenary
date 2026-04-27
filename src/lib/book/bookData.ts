export const PAGE_COUNT = 10;
export const PAGE_SCROLL_VH = 25;
export const TOTAL_SCROLL_VH = (PAGE_COUNT * 2 + 2) * PAGE_SCROLL_VH;
export const BEAR_LOGO_URL = 'https://assets.codepen.io/605876/bear-with-cap.svg';

export type Demo = {
  name: string;
  id: string;
};

export type SketchPage = {
  number: number;
  demo: Demo;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

export type BookLeaf = {
  id: string;
  pageIndex: number;
  front?: SketchPage;
  back?: SketchPage;
  variant: 'front-cover' | 'paper' | 'back-cover';
};

export const DEMOS: readonly Demo[] = [
  { name: 'Kitkat', id: 'LYpNyvm' },
  { name: 'Newton', id: 'abzeaWJ' },
  { name: 'Launch', id: 'rNOqzbN' },
  { name: 'Birthday', id: 'BaobKOJ' },
  { name: 'Impossible', id: 'ZjLKGY' },
  { name: 'Care', id: 'RwPrOoz' },
  { name: 'Cubes', id: 'QWbRxXb' },
  { name: 'Elon', id: 'RwWMwvY' },
  { name: 'Gun', id: 'GRoKOyg' },
  { name: 'Moon', id: 'NWqemYK' },
  { name: 'Pokedex', id: 'eYpGQxr' },
  { name: 'Record', id: 'RwraKYZ' },
  { name: 'Tcannon', id: 'eYpmBxQ' },
  { name: 'Cloud', id: 'MWwRKvd' },
  { name: 'Fireflies', id: 'zYGQYWJ' },
  { name: 'Train', id: 'eYpdPWa' },
  { name: 'Pancake', id: 'jJVpWZ' },
  { name: 'Earth', id: 'aPzVme' },
  { name: 'Matryoshka', id: 'jOOYMLm' },
  { name: 'Truck', id: 'MWWowEb' }
];

const sketchPageForDemo = (demo: Demo, index: number): SketchPage => ({
  number: index + 1,
  demo,
  href: `https://codepen.io/jh3y/full/${demo.id}`,
  imageSrc: `https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/${demo.name}-sketch.svg`,
  imageAlt: `${demo.name} sketch preview`
});

export const sketchPages: readonly SketchPage[] = DEMOS.slice(0, PAGE_COUNT * 2).map(
  sketchPageForDemo
);

const paperLeaves: readonly BookLeaf[] = Array.from({ length: PAGE_COUNT }, (_, index) => ({
  id: `paper-${index + 1}`,
  pageIndex: index + 2,
  front: sketchPages[index * 2],
  back: sketchPages[index * 2 + 1],
  variant: 'paper'
}));

export const leaves: readonly BookLeaf[] = [
  {
    id: 'front-cover',
    pageIndex: 1,
    variant: 'front-cover'
  },
  ...paperLeaves,
  {
    id: 'back-cover',
    pageIndex: PAGE_COUNT + 2,
    variant: 'back-cover'
  }
];
