<script>
  import Hero from "./Hero.svelte";
  import Scrolly from "./helpers/Scrolly.svelte";
  import Screenshots from "./Screenshots.svelte";
  import copy from "$data/doc.json";

  const { title, subtitle, bylines } = copy;
  let step;

  $: console.log({ step });

  const steps = copy.scrollProse.map((d) => d.value);
</script>

<Hero {title} {subtitle} {bylines} {step} />
<div class="scroll-container">
  <div class="sticky">
    <Screenshots {step} />
  </div>

  <Scrolly bind:value={step}>
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
  }
  .sticky {
    position: sticky;
    top: 0px;
    width: 100%;
    /* height: 100vh; */
    color: var(--color-body-light);
    font-family: var(--mono);
  }
  .scroll-container {
    width: 100%;
    position: relative;
  }
</style>
