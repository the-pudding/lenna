<script>
  import ScrollController from "./ScrollController.svelte";
  import Hero from "./Hero.svelte";
  import copy from "$data/doc.json";

  const { title, subtitle, bylines } = copy;
  let value;

  $: console.log({ value });
</script>

<Hero {title} {subtitle} {bylines} {value} />

<ScrollController bind:value />
