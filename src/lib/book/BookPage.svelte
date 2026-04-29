<script module lang="ts">
  import type { BookLeaf, PageFace } from './bookData';

  const labelForFace = (face: PageFace | undefined) => {
    if (!face) {
      return '';
    }

    if (face.kind === 'cover') {
      return face.title;
    }

    return `Stop ${face.spreadId.replace('stop-', '')} ${face.side} page`;
  };

  const labelForLeaf = (currentLeaf: BookLeaf) => {
    if (currentLeaf.variant === 'front-cover') {
      return 'Front cover and first itinerary page';
    }

    if (currentLeaf.variant === 'back-cover') {
      return 'Final itinerary page and back cover';
    }

    return [labelForFace(currentLeaf.front), labelForFace(currentLeaf.back)]
      .filter(Boolean)
      .join(' and ');
  };
</script>

<script lang="ts">
  import CoverFace from './CoverFace.svelte';

  let { leaf }: { leaf: BookLeaf } = $props();
</script>

{#snippet pageFace(face: PageFace | undefined)}
  {#if face?.kind === 'storyboard'}
    <img
      class="page__image page__image--storyboard"
      src={face.imageSrc}
      alt={face.imageAlt}
      style:--storyboard-position={face.objectPosition}
    />
  {:else if face?.kind === 'cover'}
    <CoverFace {face} />
  {/if}
{/snippet}

<article
  class={[
    'page',
    'book__page',
    leaf.variant !== 'paper' && 'book__cover',
    leaf.variant === 'front-cover' && 'book__cover--front',
    leaf.variant === 'back-cover' && 'book__cover--back'
  ]}
  data-book-page
  style:--page-index={leaf.pageIndex}
  aria-label={labelForLeaf(leaf)}
>
  <div class="page__half page__half--front">
    {@render pageFace(leaf.front)}
  </div>

  <div class="page__half page__half--back">
    {@render pageFace(leaf.back)}
  </div>
</article>

<style>
  .page {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
  }

  .book__page {
    position: absolute;
    top: 0;
    left: 0;
    z-index: calc((var(--page-count) + 2 - var(--page-index)) * 2);
    transform-origin: 0% 50%;
    transform-style: preserve-3d;
    will-change: transform;
  }

  .page__half {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    transform: rotateY(calc(var(--rotation) * 1deg))
      translate3d(0, 0, calc((0.5 * var(--coefficient)) * 1px));
    transform-style: preserve-3d;
    clip-path: inset(0 0.5% 0 0.5%);
  }

  .page__half--front {
    --rotation: 0;
    --coefficient: 0;
    border-radius: 0 5% 5% 0;
    backface-visibility: hidden;
  }

  .page__half--back {
    --rotation: 180;
    --coefficient: 2;
    border-radius: 5% 0 0 5%;
  }

  .book__page:not(.book__cover) .page__half {
    background:
      repeating-linear-gradient(
          0deg,
          transparent 0 1rem,
          var(--underline) 1rem calc(1rem + 1px),
          transparent calc(1rem + 1px)
        )
        0 1rem / 100% 100% no-repeat,
      var(--page);
  }

  .book__cover {
    width: 100%;
    height: 100%;
  }

  .book__cover .page__half {
    background: var(--cover);
  }

  .page__image {
    width: 100%;
    height: 100%;
    display: block;
  }

  .page__image--storyboard {
    object-fit: cover;
    object-position: var(--storyboard-position);
  }
</style>
