<script module lang="ts">
  import type { BookLeaf } from './bookData';

  const COVER_CODE = [
    'const book = gsap.timeline({',
    '  scrollTrigger: { scrub: 1 }',
    '});',
    'book.to(page, { rotateY: -180 });',
    'ScrollTrigger.refresh();'
  ].join('\n');

  const labelForLeaf = (currentLeaf: BookLeaf) => {
    if (currentLeaf.variant === 'front-cover') {
      return 'Front cover';
    }

    if (currentLeaf.variant === 'back-cover') {
      return 'Back cover';
    }

    return `Pages ${currentLeaf.front?.number ?? ''} and ${currentLeaf.back?.number ?? ''}`;
  };
</script>

<script lang="ts">
  import { BEAR_LOGO_URL } from './bookData';

  let { leaf }: { leaf: BookLeaf } = $props();
</script>

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
    {#if leaf.variant === 'front-cover'}
      <span class="code" aria-hidden="true">{COVER_CODE}</span>
      <img class="sticker" src={BEAR_LOGO_URL} alt="" aria-hidden="true" />
    {:else if leaf.front}
      <a class="page__media-link" href={leaf.front.href} target="_blank" rel="noreferrer noopener">
        <img class="page__image" src={leaf.front.imageSrc} alt={leaf.front.imageAlt} />
      </a>
      <span class="page__number">{leaf.front.number}</span>
    {/if}
  </div>

  <div class="page__half page__half--back">
    {#if leaf.variant === 'front-cover'}
      <div class="book__insert" aria-hidden="true"></div>
    {:else if leaf.variant === 'back-cover'}
      <span class="code" aria-hidden="true">{COVER_CODE}</span>
    {:else if leaf.back}
      <a class="page__media-link" href={leaf.back.href} target="_blank" rel="noreferrer noopener">
        <img class="page__image" src={leaf.back.imageSrc} alt={leaf.back.imageAlt} />
      </a>
      <span class="page__number">{leaf.back.number}</span>
    {/if}
  </div>

  {#if leaf.variant === 'back-cover'}
    <div class="book__insert">
      <a class="logo-link" href="https://jhey.dev" target="_blank" rel="noopener noreferrer">
        <img class="logo" data-book-logo src={BEAR_LOGO_URL} alt="Jhey bear logo" />
      </a>
    </div>
  {/if}
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
    color: hsl(0, 0%, 96%);
  }

  .book__cover .page__half {
    background: var(--cover);
  }

  .book__cover--front .page__half--back {
    border-right: 1rem solid var(--spine);
  }

  .book__cover--back .page__half--front {
    border-left: 1rem solid var(--spine);
  }

  .book__insert {
    width: 94%;
    height: 94%;
    position: absolute;
    top: 50%;
    right: -1rem;
    background: var(--insert);
    border-radius: 5% 0 0 5%;
    transform: translateY(-50%);
  }

  .book__cover--back .book__insert {
    right: auto;
    left: 0;
    border-radius: 0 5% 5% 0;
  }

  .page__media-link {
    width: 100%;
    height: 100%;
    display: block;
    position: relative;
  }

  .page__image {
    width: 90%;
    height: 90%;
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    object-fit: contain;
    transform: translate(-50%, -50%);
  }

  .page__number {
    position: absolute;
    bottom: 1rem;
    color: hsl(0, 0%, 50%);
    font-size: max(0.625rem, 1vmin);
    font-weight: 700;
  }

  .page__half--front .page__number {
    right: 1rem;
  }

  .page__half--back .page__number {
    left: 1rem;
  }

  .code {
    max-width: 84%;
    max-height: 76%;
    display: block;
    overflow: hidden;
    color: hsl(0, 0%, 96%);
    font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
    font-size: clamp(0.45rem, 1.4vmin, 0.85rem);
    font-weight: 700;
    line-height: 1.25;
    white-space: pre-line;
    opacity: 0.82;
  }

  .sticker {
    width: auto;
    height: 15%;
    position: absolute;
    right: 6%;
    bottom: 5%;
    filter: drop-shadow(0 0.2rem 0.25rem hsla(0, 0%, 0%, 0.35));
    transform: rotate(-25deg);
  }

  .logo-link {
    width: 28%;
    height: 28%;
    position: relative;
    top: 50%;
    left: 50%;
    display: block;
    transform: translate(-50%, -50%);
  }

  .logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0;
    visibility: hidden;
    will-change: opacity;
  }
</style>
