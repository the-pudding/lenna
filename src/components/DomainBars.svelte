<script>
  import { fade } from "svelte/transition";
  import _ from "lodash";
  import { onMount } from "svelte";

  export let domains;
  export let xScale;
  export let yScale;
  export let barColors;
  export let step;

  let stackData;
  onMount(() => {
    stackData = d3
      .stack()
      .keys([".org", ".edu", ".com", "other"])(domains)
      .map((d) => (d.forEach((m) => (m.key = d.key)), d))
      .map((d) => d.filter((m) => !Number.isNaN(m[0]) && !Number.isNaN(m[1])));
  });

  $: dataToShow = filterData(stackData, step);

  const filterData = (stackData, step) => {
    if (!stackData) return null;
    if (step === 12) return [stackData[0]]; // only show .org
    if (step === 13) return stackData;
    return null;
  };
</script>

{#if dataToShow}
  {#each dataToShow as domain}
    {#each domain as minibar}
      <rect
        x={xScale(minibar.data.year)}
        y={yScale(minibar[1])}
        width={xScale.bandwidth()}
        height={yScale(minibar[0]) - yScale(minibar[1])}
        fill={barColors[minibar.key]}
        transition:fade
      />
    {/each}
  {/each}
{/if}

<style>
</style>
