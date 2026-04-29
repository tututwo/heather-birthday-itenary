<script lang="ts">
  import type { CoverPageFace } from './bookData';
  import { coverDoodleDrawing } from './roughCover';

  let { face }: { face: CoverPageFace } = $props();
</script>

<div class="teacher-cover">
  <svg
    class="cover-doodles"
    viewBox="0 0 300 400"
    aria-hidden="true"
    {@attach coverDoodleDrawing}
  ></svg>
  <div class="cover-copy">
    <p class="cover-kicker">{face.caption}</p>
    <h2>{face.title}</h2>
    <p>{face.subtitle}</p>
  </div>
</div>

<style>
  .teacher-cover {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    color: #27211d;
    background:
      radial-gradient(circle at 20% 18%, hsla(47, 100%, 73%, 0.45), transparent 22%),
      linear-gradient(135deg, #fff8dc, #ffe7ef 48%, #d8f0ff);
  }

  .cover-doodles {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
  }

  .cover-copy {
    width: 78%;
    display: grid;
    justify-items: center;
    gap: 0.48rem;
    position: absolute;
    top: 28%;
    left: 50%;
    z-index: 1;
    padding: 7% 6%;
    text-align: center;
    background: hsla(52, 100%, 97%, 0.88);
    border: 1px solid hsla(33, 42%, 35%, 0.35);
    transform: translateX(-50%) rotate(-1.4deg);
  }

  .cover-copy h2,
  .cover-copy p {
    margin: 0;
  }

  .cover-copy h2 {
    max-width: 10ch;
    color: #2f4a7c;
    font-size: clamp(1.05rem, 3.5vmin, 2.35rem);
    line-height: 1.02;
  }

  .cover-copy p {
    max-width: 18ch;
    color: #4d3b32;
    font-size: clamp(0.58rem, 1.28vmin, 0.86rem);
    font-weight: 700;
    line-height: 1.3;
  }

  .cover-copy .cover-kicker {
    padding: 0.2rem 0.35rem;
    color: #7b3c6f;
    font-size: clamp(0.48rem, 1.02vmin, 0.72rem);
    text-transform: uppercase;
    background: hsla(51, 100%, 74%, 0.76);
  }
</style>
