<script>
  // import Sandbox from "$components/Sandbox.svelte";
  import inView from "$actions/inView.js";
  import viewport from "$stores/viewport.js";
  import copy from "$data/doc.json";

  const steps = copy.steps.map((d, i) => ({ ...d, i, ratio: 0 }));
  let activeIndex = 0;
  let activeId = "";

  const setActiveStep = () => {
    let max = 0;
    let maxIndex = 0;
    steps.forEach(({ ratio, i }) => {
      if (ratio > max) {
        max = ratio;
        maxIndex = i;
      }
    });
    activeIndex = maxIndex;
    activeId = steps[activeIndex].id;
  };

  $: steps.map((d) => d.ratio).join(""), setActiveStep();
  $: console.log({ activeIndex, activeId });
</script>

<!-- <Sandbox /> -->

{#each steps as { id, text, i }}
  <div class="step" use:inView on:update={(e) => (steps[i].ratio = e.detail.ratio)}>
    <p>{text}</p>
  </div>
{/each}

<style>
  .step {
    height: 100vh;
    margin: 0;
    background: pink;
    font-size: 2em;
    max-width: 20em;
  }

  .step:last-of-type {
    background: lightsteelblue;
  }
</style>
