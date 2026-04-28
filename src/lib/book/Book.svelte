<script lang="ts">
  import { leaves, sketchPages, TOTAL_SCROLL_VH } from './bookData';
  import BookPage from './BookPage.svelte';
  import { bookAnimation } from './gsapBook';
</script>

<main
  class="book-scene"
  data-book-scene
  {@attach bookAnimation}
  style:--total-scroll-vh={TOTAL_SCROLL_VH}
>
  <h1 class="scroll-heading">Scroll</h1>

  <div class="book-frame">
    <div class="book" data-book aria-label="Animated sketch book">
      <div class="book__spine" aria-hidden="true"></div>
      {#each leaves as leaf (leaf.id)}
        <BookPage {leaf} />
      {/each}
    </div>
  </div>

  <section class="book-fallback" aria-label="Sketch pages">
    {#each sketchPages as page (page.number)}
      <a class="fallback-card" href={page.href} target="_blank" rel="noreferrer noopener">
        <img src={page.imageSrc} alt={page.imageAlt} loading="lazy" />
        <span>{page.number}. {page.demo.name}</span>
      </a>
    {/each}
  </section>
</main>

<style>
  .book-scene {
    min-height: calc(var(--total-scroll-vh) * 1vh);
    position: relative;
    isolation: isolate;
  }

  .scroll-heading {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 20;
    margin: 0;
    color: var(--muted);
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
    pointer-events: none;
  }

  .book-frame {
    width: 30vmin;
    height: 40vmin;
    min-width: 150px;
    min-height: 200px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .book {
    width: 100%;
    height: 100%;
    position: relative;
    transform: scale(0.5);
    transform-style: preserve-3d;
    perspective: 1200px;
    will-change: transform;
  }

  .book__spine {
    position: absolute;
    top: 50%;
    left: 0;
    z-index: 1;
    width: 12%;
    height: 105%;
    background: var(--spine);
    border-radius: 8% 0 0 8%;
    transform: translate(-50%, -50%) rotateY(90deg) translate3d(0, 0, -0.6vmin);
    transform-origin: 50% 50%;
  }

  .book-fallback {
    display: none;
  }

  @media (max-width: 700px) {
    .book-frame {
      width: 42vmin;
      height: 56vmin;
    }

    .scroll-heading {
      font-size: 1.5rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .book-scene {
      min-height: auto;
      padding: 4rem 1rem;
    }

    .scroll-heading,
    .book-frame {
      display: none;
    }

    .book-fallback {
      width: min(100%, 940px);
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .fallback-card {
      min-height: 190px;
      display: grid;
      grid-template-rows: 1fr auto;
      gap: 0.75rem;
      padding: 1rem;
      color: var(--ink);
      text-decoration: none;
      background:
        repeating-linear-gradient(
            0deg,
            transparent 0 1rem,
            var(--underline) 1rem calc(1rem + 1px),
            transparent calc(1rem + 1px)
          )
          0 1rem / 100% 100% no-repeat,
        var(--page);
      border-radius: 8px;
    }

    .fallback-card img {
      width: 100%;
      height: 150px;
      object-fit: contain;
    }

    .fallback-card span {
      color: hsl(0, 0%, 28%);
      font-size: 0.9rem;
      font-weight: 700;
    }
  }
</style>
