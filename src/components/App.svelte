<script>
  import { onMount } from "svelte";
  import Hero from "./Hero.svelte";
  import Scrolly from "./helpers/Scrolly.svelte";
  import Screenshots from "./Screenshots.svelte";
  import Lenna from "./Lenna.svelte";
  import copy from "$data/doc.json";
  import loadPixels from "$utils/loadPixels.js";
  import _ from "lodash";

  let step;
  let pixels;
  const pixelSize = 20;
  const steps = copy.scrollProse.map((d) => d.value);

  $: console.log({ step });

  onMount(async () => {
    pixels = await loadPixels("assets/img/lenna-84.png");
  });
</script>

<div class="scroll-container">
  <div class="sticky">
    <Hero {step} {pixelSize} />
    <Screenshots {step} enter={0} type="internet" />
    {#each [...new Array(5).keys()] as i}
      <Screenshots {step} enter={1} type="internet" {i} />
    {/each}
    {#if pixels}
      <Lenna {step} {pixels} />
    {/if}
  </div>

  <Scrolly bind:value={step} styles={"display: flex; flex-direction: column; width: 100%;"}>
    {#each steps as text, i}
      <div class="step" class:active={step === i}>
        <p>{text}</p>
      </div>
    {/each}
  </Scrolly>
</div>

<style>
  .step {
    padding: 24px 40px 24px 40px;
    font-size: 18px;
    width: 20em;
    margin-right: 90px;
    margin-bottom: 60vh;
    color: var(--color-body);
    background: var(--scroll-step-background);
    align-self: flex-end;
    z-index: 1000;
    opacity: 0.4;
  }
  .active {
    opacity: 1;
  }
  .sticky {
    position: sticky;
    top: 0;
    width: 100%;
    height: 100vh;
    color: var(--color-body-light);
    font-family: var(--mono);
  }
  .scroll-container {
    width: 100%;
    position: relative;
  }
</style>
