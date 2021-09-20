<script>
  import Scrolly from "./helpers/Scrolly.svelte";
  import copy from "$data/doc.json";

  console.log(copy);

  const steps = copy.scrollProse.map((d) => d.value);
  export let value;
</script>

<div class="scroll-container">
  <div class="sticky" />

  <Scrolly bind:value>
    {#each steps as text, i}
      <div class="step" class:active={value === i}>
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
  }
  .sticky {
    position: sticky;
    top: 0px;
    width: 100%;
  }
  .scroll-container {
    width: 100%;
    height: 100%;
  }
</style>
