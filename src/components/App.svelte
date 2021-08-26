<script>
  import { onMount } from "svelte";
  import Footer from "$components/Footer.svelte";
  import loadPixels from "$utils/loadPixels.js";
  import Canvas from "./Canvas.svelte";
  import Screenshots from "./Screenshots.svelte";
  import _ from "lodash";

  // 1: screenshots enter
  // 2: screenshots form lenna image
  // 3: lenna scatters, single pixel falls
  let step = 0;

  $: console.log({ step });

  let pixels;

  onMount(async () => {
    pixels = await loadPixels("assets/img/lenna-84.png");
  });
</script>

<button on:click={() => (step = 1)}>screenshots enter</button>
<button on:click={() => (step = 2)}>form lenna</button>
<button on:click={() => (step = 3)}>screenshots enter</button>

<Screenshots
  {step}
  pixels={pixels ? _.sampleSize(pixels, 4).map(({ x, y, w, h }) => ({ x, y, w, h })) : []}
/>

{#if pixels}
  <Canvas bind:pixels {step} />
{/if}
