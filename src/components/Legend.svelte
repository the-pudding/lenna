<script>
  import _ from "lodash";

  export let barColors;
  export let x;
  export let y;
  export let step;

  $: itemsToShow = filterItems(step);

  const filterItems = (step) => {
    if (step === 11) return [".org"];
    if (step === 12) return _.keys(barColors);
    return null;
  };

  const size = 25;
</script>

{#if itemsToShow}
  <g transform={`translate(${x}, ${y})`}>
    {#each itemsToShow as legendItem, i}
      <rect height={size} width={size} fill={barColors[legendItem]} y={i * size * 1.5} />
      <text x={size * 1.5} y={i * size * 1.5 + 16}>{legendItem}</text>
    {/each}
  </g>
{/if}

<style>
  text {
    font-size: 14px;
  }
</style>
