<script>
  import PixelGalaxy from "./PixelGalaxy.svelte";
  import { fade } from "svelte/transition";
  import copy from "$data/doc.json";

  export let step;
  export let pixelSize;

  const { title, subtitle, bylines } = copy;

  $: titleVisible = step === undefined;
  $: gridVisible = step === undefined || (step >= 0 && step < 3);
</script>

{#if gridVisible}
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
    height: 90vh;
    pointer-events: none;
  }

  h1,
  h2,
  .authors {
    color: var(--color-body-light);
    margin-left: 110px;
    font-family: var(--mono);
  }

  h1 {
    font-size: 150px;
    width: 400px;
    line-height: 150px;
  }

  h2 {
    font-size: 40px;
    line-height: 45px;
    width: 700px;
  }

  .authors {
    margin-top: 60px;
  }
</style>
