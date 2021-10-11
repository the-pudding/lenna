<script>
  import baseColors from "../../properties/colors/base.json";
  import { fade } from "svelte/transition";
  import _ from "lodash";
  import { onMount } from "svelte";

  export let domains;
  export let xScale;
  export let yScale;

  const colors = {
    ".org": baseColors.base["green-2"].value,
    ".edu": baseColors.base["blue-2"].value,
    ".com": baseColors.base["orange-1"].value,
    other: baseColors.base["tan-3"].value
  };

  let stackData;
  $: console.log({ stackData });
  onMount(() => {
    stackData = d3
      .stack()
      .keys([".edu", ".com", ".org", "other"])(domains)
      .map((d) => (d.forEach((m) => (m.key = d.key)), d))
      .map((d) => d.filter((m) => !Number.isNaN(m[0]) && !Number.isNaN(m[1])));
  });
</script>

{#if stackData}
  {#each stackData as domain}
    {#each domain as minibar}
      <rect
        x={xScale(minibar.data.year)}
        y={yScale(minibar[1])}
        width={xScale.bandwidth()}
        height={yScale(minibar[0]) - yScale(minibar[1])}
        fill={colors[minibar.key]}
        transition:fade
      />
    {/each}
  {/each}
{/if}

<style>
</style>
