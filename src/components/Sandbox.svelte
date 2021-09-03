<script>
  import { onMount } from "svelte";
  import loadPixels from "$utils/loadPixels.js";
  import Canvas from "./Canvas.svelte";
  import Screenshots from "./Screenshots.svelte";
  import _ from "lodash";

  // 1: screenshots enter
  // 2: screenshots form lenna image
  // 3: lenna scatters, single pixel falls
  export let step;

  $: console.log({ step });

  let pixels;

  onMount(async () => {
    pixels = await loadPixels("assets/img/lenna-84.png");
  });
</script>

<div>
  <Screenshots
    {step}
    pixels={pixels ? _.sampleSize(pixels, 4).map(({ x, y, w, h }) => ({ x, y, w, h })) : []}
  />

  {#if pixels}
    <Canvas bind:pixels {step} />
  {/if}
</div>

<style>
  div {
    position: sticky;
    top: 0;
    height: 100vh;
  }
</style>
