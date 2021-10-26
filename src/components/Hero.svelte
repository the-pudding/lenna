<script>
  import PixelGalaxy from "./PixelGalaxy.svelte";
  import { fade } from "svelte/transition";
  import copy from "$data/doc.json";
  import { onMount } from "svelte";

  export let step;

  let dpr = 1;
  $: pixelSize = 15 * dpr;

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
  <PixelGalaxy {step} size={pixelSize} />
{/if}
{#if titleVisible}
  <div class="hero" on:click={() => console.log("hero click")} transition:fade>
    <h1>{title.toUpperCase()}</h1>
    <h2>{subtitle.toUpperCase()}</h2>
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
    max-width: 800px;
    height: 90vh;
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
    font-size: 150px;
    line-height: 150px;
    max-width: 400px;
  }

  h2 {
    font-size: 40px;
    line-height: 45px;
  }

  .authors {
    margin-top: 60px;
    pointer-events: auto;
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
  }

  @media (max-width: 475px) {
    .hero {
      margin-left: 50px;
      margin-right: 50px;
    }
  }
</style>
