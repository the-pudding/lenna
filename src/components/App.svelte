<script>
  import { onMount, setContext } from "svelte";
  import Hero from "./Hero.svelte";
  import Scrolly from "./helpers/Scrolly.svelte";
  import Screenshots from "./Screenshots.svelte";
  import Lenna from "./Lenna.svelte";
  import Playboy from "./Playboy.svelte";
  import BarChart from "./BarChart.svelte";
  import Conclusion from "./Conclusion.svelte";
  import Footer from "./Footer.svelte";
  import copy from "$data/doc.json";
  import loadPixels from "$utils/loadPixels.js";
  import _ from "lodash";

  let step;
  let pixels;
  let playboyDestination;
  const steps = copy.scrollProse;

  $: console.log({ step });
  $: console.log(copy);

  onMount(async () => {
    pixels = await loadPixels("assets/img/lenna-84.png");
  });
</script>

<div class="scroll-container">
  <div class="sticky">
    <Hero {step} />
    <Screenshots
      visible={step >= 0 && step < 3}
      faded={step >= 1 && step < 3}
      showLabels={step >= 0 && step < 3}
      key="memes-0"
    />
    {#each [...new Array(4).keys()] as i}
      <Screenshots
        visible={step >= 1 && step < 3}
        faded={step >= 2 && step < 3}
        showLabels={false}
        delay={200 * i}
        picNums={[1 + i * 5, 2 + i * 5, 3 + i * 5, 4 + i * 5, 5 + i * 5]}
        key={`memes-${i + 1}`}
      />
    {/each}

    <Screenshots
      visible={step >= 2 && step < 3}
      faded={step >= 3 && step < 3}
      showLabels={true}
      key="lennas"
    />

    {#if pixels}
      <Lenna {pixels} {step} />
    {/if}

    <!-- <Playboy {step} {playboyDestination} /> -->

    <BarChart {step} bind:playboyDestination />
  </div>

  <Scrolly bind:value={step} styles={"display: flex; flex-direction: column; width: 100%;"}>
    {#each steps as { text, image }, i}
      <div class="step" class:active={step === i}>
        {#if image}
          <img src={`assets/img/story/${image}.jpg`} alt={image} />
        {/if}
        <p>{@html text}</p>
      </div>
    {/each}
  </Scrolly>
</div>

<Conclusion {step} />
<Footer />

<style>
  .step {
    font-size: 18px;
    width: 20em;
    margin-right: 120px;
    margin-bottom: 60vh;
    color: var(--color-body);
    background: var(--scroll-step-background);
    align-self: flex-end;
    z-index: 1000;
    opacity: 0.4;
  }
  .step p {
    line-height: 1.65;
    padding: 0.75rem 1.75rem;
  }

  :global(.step a) {
    text-decoration: none;
    border-bottom: 1px solid var(--base-purple-3);
  }

  :global(.step a:hover) {
    border-bottom: 2px solid var(--base-green-2);
  }

  :global(.step span) {
    font-weight: 700;
    outline: 2px solid var(--base-green-2);
    padding: 0.125rem 0.25rem;
  }

  :global(.step .bolded) {
    font-weight: 700;
    outline: none;
  }

  :global(.step .org-span) {
    background: var(--base-blue-2);
    outline: none;
    cursor: default;
  }

  :global(.step .edu-span) {
    background: var(--base-orange-1);
    outline: none;
    cursor: default;
  }

  :global(.step .com-span) {
    background: var(--base-orange-2);
    outline: none;
    cursor: default;
  }

  :global(.step .other-span) {
    background: var(--base-tan-1);
    outline: none;
    cursor: default;
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
