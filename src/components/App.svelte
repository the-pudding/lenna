<script>
  import Sandbox from "$components/Sandbox.svelte";
  import Firework from "$components/Firework.svelte";
  import Pixels from "$components/Pixels.svelte";
  import Scrolly from "./helpers/Scrolly.svelte";
  import inView from "$actions/inView.js";
  import copy from "$data/doc.json";

  let value;
  $: console.log({ value });

  const steps = copy.steps.map((d) => d.text);
</script>

<!-- <Sandbox step={activeId} /> -->

<!-- <Firework step={value} /> -->

<Pixels step={value} />

<div class="spacer" />

<Scrolly bind:value>
  {#each steps as text, i}
    <div class="step" class:active={value === i}>
      <p>{text}</p>
    </div>
  {/each}
</Scrolly>

<style>
  .step {
    height: 60vh;
    background: lightsteelblue;
    font-size: 2em;
    max-width: 20em;
    margin-bottom: 15em;
  }
  .active {
    background: gold !important;
  }
  .spacer {
    height: 100vh;
  }
</style>
