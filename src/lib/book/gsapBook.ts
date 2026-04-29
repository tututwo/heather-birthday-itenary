import type { Attachment } from 'svelte/attachments';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SCROLL_UNIT_RATIO = 0.25;
const SCALE_START = 0;
const SCALE_END = 1;
const SHIFT_START = 1;
const SHIFT_END = 2;

const BOOK_SELECTOR = '[data-book]';
const PAGE_SELECTOR = '[data-book-page]';

const scrollUnit = () => window.innerHeight * SCROLL_UNIT_RATIO;
const scrollPosition = (unit: number) => unit * scrollUnit();
const pageFlipStart = (index: number) => index + 1;
const timelineEnd = (pages: HTMLElement[]) => Math.max(pages.length, SHIFT_END);
const initialPageDepth = (index: number, pageCount: number) =>
  index === 0 ? pageCount + 1 : -index;
const finalPageDepth = (index: number, pageCount: number) =>
  index === 0 ? -(pageCount + 1) : index;
const pageRotation = (index: number) => `-=${180 - index / 2}`;

type MatchMediaConditions = {
  reduceMotion?: boolean;
};

export type BookAnimation = {
  revert: () => void;
};

const applyReducedMotionState = (book: HTMLElement, pages: HTMLElement[]) => {
  gsap.set(book, { scale: 1, x: () => book.offsetWidth / 2 });
  gsap.set(pages, { rotateY: 0, z: 0 });
};

const createBookTimeline = (
  root: HTMLElement,
  book: HTMLElement,
  pages: HTMLElement[]
) => {
  const pageCount = pages.length;

  gsap.set(book, { scale: 0.5, x: 0 });
  gsap.set(pages, {
    rotateY: 0,
    z: (index) => initialPageDepth(index, pageCount)
  });

  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: root,
      scrub: 1,
      start: 0,
      end: () => scrollPosition(timelineEnd(pages)),
      invalidateOnRefresh: true
    }
  });

  timeline
    .addLabel('scale', SCALE_START)
    .fromTo(book, { scale: 0.5 }, { scale: 1, duration: SCALE_END - SCALE_START }, 'scale')
    .addLabel('shift', SHIFT_START)
    .fromTo(
      book,
      { x: 0 },
      { x: () => book.offsetWidth / 2, duration: SHIFT_END - SHIFT_START },
      'shift'
    );

  pages.forEach((page, index) => {
    const flipStart = pageFlipStart(index);
    const isBackCover = index === pages.length - 1;

    timeline.set(page, { z: initialPageDepth(index, pageCount) }, SCALE_START);

    if (isBackCover) {
      return;
    }

    timeline
      .addLabel(`page-${index + 1}`, flipStart)
      .to(page, { rotateY: pageRotation(index), duration: 1 }, flipStart)
      .to(page, { z: finalPageDepth(index, pageCount), duration: 0.5 }, flipStart);
  });

  return timeline;
};

export function setupBookAnimation(root: HTMLElement): BookAnimation {
  let mm: ReturnType<typeof gsap.matchMedia> | undefined;

  const ctx = gsap.context(() => {
    const book = root.querySelector<HTMLElement>(BOOK_SELECTOR);
    const pages = gsap.utils.toArray<HTMLElement>(PAGE_SELECTOR, root);

    if (!book) {
      return;
    }

    mm = gsap.matchMedia();
    mm.add(
      {
        reduceMotion: '(prefers-reduced-motion: reduce)',
        fullMotion: '(prefers-reduced-motion: no-preference)'
      },
      (context) => {
        const conditions = context.conditions as MatchMediaConditions;

        if (conditions.reduceMotion) {
          applyReducedMotionState(book, pages);
          return;
        }

        createBookTimeline(root, book, pages);
      },
      root
    );
  }, root);

  return {
    revert() {
      mm?.revert();
      ctx.revert();
    }
  };
}

export const bookAnimation: Attachment<HTMLElement> = (root) => {
  const animation = setupBookAnimation(root);
  ScrollTrigger.refresh();

  return () => {
    animation.revert();
  };
};
