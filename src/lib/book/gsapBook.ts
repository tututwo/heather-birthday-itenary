import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const scrollUnit = () => window.innerHeight * 0.25;

export type BookAnimation = {
  revert: () => void;
};

export function setupBookAnimation(root: HTMLElement): BookAnimation {
  let mm: ReturnType<typeof gsap.matchMedia> | undefined;

  const ctx = gsap.context(() => {
    const book = root.querySelector<HTMLElement>('.book');
    const logo = root.querySelector<HTMLElement>('.logo');
    const pages = gsap.utils.toArray<HTMLElement>('.book__page', root);

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
        const conditions = context.conditions as { reduceMotion?: boolean };

        if (conditions.reduceMotion) {
          gsap.set(book, { scale: 1 });
          gsap.set(pages, { rotateY: 0, z: 0 });

          if (logo) {
            gsap.set(logo, { autoAlpha: 1 });
          }

          return;
        }

        gsap.to(book, {
          scale: 1,
          scrollTrigger: {
            scrub: 1,
            start: 0,
            end: () => scrollUnit(),
            invalidateOnRefresh: true
          }
        });

        if (logo) {
          gsap.to(logo, {
            autoAlpha: 1,
            scrollTrigger: {
              scrub: true,
              start: () => 13.5 * scrollUnit(),
              end: () => 14 * scrollUnit(),
              invalidateOnRefresh: true
            }
          });
        }

        pages.forEach((page, index) => {
          gsap.set(page, { z: index === 0 ? 13 : -index });

          const isBackCover = index === pages.length - 1;

          if (isBackCover) {
            return;
          }

          gsap.to(page, {
            rotateY: `-=${180 - index / 2}`,
            scrollTrigger: {
              scrub: 1,
              start: () => (index + 1) * scrollUnit(),
              end: () => (index + 2) * scrollUnit(),
              invalidateOnRefresh: true
            }
          });

          gsap.to(page, {
            z: index === 0 ? -13 : index,
            scrollTrigger: {
              scrub: 1,
              start: () => (index + 1) * scrollUnit(),
              end: () => (index + 1.5) * scrollUnit(),
              invalidateOnRefresh: true
            }
          });
        });
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
