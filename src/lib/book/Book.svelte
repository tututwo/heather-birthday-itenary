<script lang="ts">
  import { BOOK_LEAF_COUNT, leaves, storyboardSpreads, TOTAL_SCROLL_VH } from './bookData';
  import BookPage from './BookPage.svelte';
  import { bookAnimation } from './gsapBook';
</script>

<main
  class="book-scene"
  data-book-scene
  {@attach bookAnimation}
  style:--total-scroll-vh={TOTAL_SCROLL_VH}
  style:--page-count={BOOK_LEAF_COUNT}
>
  <div class="classroom-canvas" aria-hidden="true">
    <span class="canvas-doodle canvas-doodle--abc">ABC</span>
    <span class="canvas-doodle canvas-doodle--math">2 + 2 = ♥</span>
    <span class="canvas-doodle canvas-doodle--star">✦</span>
    <span class="canvas-doodle canvas-doodle--apple">🍎</span>
    <span class="canvas-doodle canvas-doodle--note">best teacher</span>
    <span class="canvas-doodle canvas-doodle--ruler"></span>
  </div>

  <h1 class="scroll-heading">Scroll</h1>

  <div class="book-frame">
    <div class="book" data-book aria-label="Animated birthday itinerary book">
      <div class="book__spine" aria-hidden="true"></div>
      {#each leaves as leaf (leaf.id)}
        <BookPage {leaf} />
      {/each}
    </div>
  </div>

  <section class="book-fallback" aria-label="Birthday itinerary pages">
    {#each storyboardSpreads as spread (spread.id)}
      <figure class="fallback-card">
        <img src={spread.imageSrc} alt={spread.imageAlt} loading="lazy" />
        <figcaption>Stop {spread.stopNumber}</figcaption>
      </figure>
    {/each}
  </section>
</main>

<style>
  .book-scene {
    min-height: calc(var(--total-scroll-vh) * 1vh);
    position: relative;
    isolation: isolate;
    overflow: hidden;
  }

  .book-scene::before {
    content: "";
    position: fixed;
    inset: 1.5rem;
    z-index: -2;
    pointer-events: none;
    background:
      linear-gradient(90deg, var(--cork), hsl(32, 72%, 76%)) top / 100% 1rem no-repeat,
      linear-gradient(90deg, var(--cork), hsl(32, 72%, 76%)) bottom / 100% 1rem no-repeat,
      linear-gradient(0deg, var(--cork), hsl(32, 72%, 76%)) left / 1rem 100% no-repeat,
      linear-gradient(0deg, var(--cork), hsl(32, 72%, 76%)) right / 1rem 100% no-repeat;
    border-radius: 1rem;
    box-shadow:
      inset 0 0 0 2px hsla(28, 44%, 33%, 0.28),
      0 1.2rem 3rem hsla(0, 0%, 0%, 0.14);
  }

  .book-scene::after {
    content: "";
    position: fixed;
    inset: 0;
    z-index: -3;
    pointer-events: none;
    background:
      radial-gradient(circle at 24% 72%, var(--chalk-dust), transparent 9rem),
      radial-gradient(circle at 70% 34%, hsla(52, 100%, 90%, 0.1), transparent 12rem),
      linear-gradient(90deg, transparent 0 49.8%, hsla(0, 0%, 100%, 0.12) 50%, transparent 50.2%),
      linear-gradient(0deg, transparent 0 49.8%, hsla(0, 0%, 100%, 0.1) 50%, transparent 50.2%);
    background-size:
      auto,
      auto,
      14rem 14rem,
      14rem 14rem;
  }

  .classroom-canvas {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    color: hsla(52, 100%, 91%, 0.72);
    font-family: "Comic Sans MS", "Bradley Hand", ui-rounded, cursive;
    font-weight: 800;
  }

  .canvas-doodle {
    position: absolute;
    display: inline-block;
    text-shadow: 0 1px 0 hsla(0, 0%, 100%, 0.16);
    transform: rotate(var(--rotate, -5deg));
  }

  .canvas-doodle--abc {
    --rotate: -8deg;
    top: 11%;
    left: 8%;
    color: hsl(52, 100%, 88%);
    font-size: clamp(1.4rem, 3vw, 3.4rem);
  }

  .canvas-doodle--math {
    --rotate: 6deg;
    top: 15%;
    right: 9%;
    color: hsl(344, 100%, 88%);
    font-size: clamp(1rem, 2vw, 2.4rem);
  }

  .canvas-doodle--star {
    --rotate: 12deg;
    top: 34%;
    left: 14%;
    color: hsl(48, 100%, 76%);
    font-size: clamp(1.8rem, 3.8vw, 4rem);
  }

  .canvas-doodle--apple {
    --rotate: -10deg;
    right: 14%;
    bottom: 22%;
    font-size: clamp(1.8rem, 3.5vw, 3.6rem);
    filter: drop-shadow(0 0.25rem 0 hsla(0, 0%, 0%, 0.08));
  }

  .canvas-doodle--note {
    --rotate: -4deg;
    bottom: 13%;
    left: 9%;
    color: hsl(186, 86%, 86%);
    font-size: clamp(0.95rem, 1.8vw, 2rem);
    text-decoration: underline;
    text-decoration-thickness: 0.08em;
    text-underline-offset: 0.22em;
  }

  .canvas-doodle--ruler {
    --rotate: 9deg;
    width: clamp(7rem, 15vw, 12rem);
    height: 1.4rem;
    right: 7%;
    top: 42%;
    background:
      repeating-linear-gradient(
        90deg,
        transparent 0 0.65rem,
        hsla(30, 48%, 34%, 0.5) 0.68rem 0.78rem,
        transparent 0.82rem 1.3rem
      ),
      hsl(46, 100%, 74%);
    border: 2px solid hsla(30, 48%, 34%, 0.52);
    border-radius: 0.25rem;
    opacity: 0.82;
  }

  .scroll-heading {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 20;
    margin: 0;
    color: hsla(52, 100%, 91%, 0.74);
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
    width: 8%;
    height: 105%;
    background:
      repeating-linear-gradient(
        180deg,
        hsla(0, 0%, 100%, 0.32) 0 0.45rem,
        transparent 0.45rem 0.9rem
      ),
      var(--spine);
    border-radius: 8% 0 0 8%;
    opacity: 0.88;
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

    .book-scene::before {
      inset: 0.75rem;
    }

    .canvas-doodle--ruler,
    .canvas-doodle--math {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .book-scene {
      min-height: auto;
      padding: 4rem 1rem;
    }

    .scroll-heading,
    .book-frame,
    .classroom-canvas {
      display: none;
    }

    .book-fallback {
      width: min(100%, 940px);
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .fallback-card {
      margin: 0;
      display: grid;
      gap: 0.75rem;
      padding: 1rem;
      color: var(--ink);
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
      height: auto;
      aspect-ratio: 3 / 2;
      object-fit: contain;
    }

    .fallback-card figcaption {
      color: hsl(0, 0%, 28%);
      font-size: 0.9rem;
      font-weight: 700;
    }
  }
</style>
