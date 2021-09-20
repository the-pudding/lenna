<script>
  import ScrollController from "./ScrollController.svelte";
  import Hero from "./Hero.svelte";
  import copy from "$data/doc.json";

  const { title, subtitle, bylines } = copy;
  let step;

  $: console.log({ step });
</script>

<Hero {title} {subtitle} {bylines} {step} />

<ScrollController bind:value={step} />
