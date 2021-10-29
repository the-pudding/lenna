<script>
  import PixelGalaxy from "./PixelGalaxy.svelte";
  import { fade } from "svelte/transition";
  import copy from "$data/doc.json";
  import { onMount } from "svelte";
  import { gridPixelSize } from "$stores/misc";

  export let step;

  let dpr = 1;
  $: $gridPixelSize = 15 * dpr;

  const { title, subtitle, bylines } = copy;

  $: titleVisible = step === undefined;
  $: gridVisible = step === undefined || (step >= 0 && step < 3);

  let ready = false;
  onMount(() => {
    dpr = window.devicePixelRatio;
    ready = true;
  });
</script>

{#if gridVisible && ready}
  <PixelGalaxy {step} size={$gridPixelSize} />
{/if}
{#if titleVisible}
  <div class="hero" transition:fade>
    <h1>{title.toUpperCase()}</h1>
    <h2>{subtitle}</h2>
    <div class="authors">
      <div>By <a href={bylines[0].url}>{bylines[0].author}</a></div>
      <div>
        with <a href={bylines[1].url}>{bylines[1].author}</a> and
        <a href={bylines[2].url}>{bylines[2].author}</a>
      </div>
    </div>
  </div>
{/if}

<style>
  .hero {
    height: 90vh;
    max-width: 800px;
    position: relative;
    pointer-events: none;
    margin-left: 110px;
    margin-right: 110px;
  }

  h1,
  h2,
  .authors {
    color: var(--color-body-light);
    font-family: var(--mono);
  }

  h1 {
    font-size: 135px;
    line-height: 125px;
    max-width: 400px;
  }

  h2 {
    font-size: 28px;
    line-height: 36px;
    font-weight: 400;
    max-width: 700px;
  }

  .authors {
    margin-top: 3rem;
    pointer-events: auto;
    line-height: 1.65;
  }

  :global(.authors a) {
    text-decoration: none;
    border-bottom: 1px solid var(--chart-text);
  }

  :global(.authors a:hover) {
    border-bottom: 2px solid var(--base-green-2);
  }

  @media (max-width: 700px) {
    h1 {
      font-size: 100px;
      line-height: 100px;
    }
    h2 {
      font-size: 30px;
      line-height: 32px;
    }
    .hero {
      margin-left: 80px;
      margin-right: 80px;
    }
    .authors {
      font-size: 14px;
    }
  }

  @media (max-width: 475px) {
    .hero {
      margin-left: 50px;
      margin-right: 50px;
    }

    h1 {
      font-size: 80px;
      line-height: 80px;
    }
    h2 {
      font-size: 20px;
      line-height: 22px;
    }
  }

  @media (max-width: 300px) {
    h1 {
      font-size: 40px;
      line-height: 40px;
    }
  }
</style>
