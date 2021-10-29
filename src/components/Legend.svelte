<script>
  import _ from "lodash";

  export let barColors;
  export let x;
  export let y;
  export let hovered;

  const size = 25;
  $: itemsToShow = _.keys(barColors);

  const mouseEnter = (e) => {
    hovered = e.target.id;
  };
  const mouseLeave = () => {
    hovered = null;
  };
</script>

{#if itemsToShow}
  <g transform={`translate(${x}, ${y})`}>
    {#each itemsToShow as legendItem, i}
      <g class="legend-item" id={legendItem} on:mouseenter={mouseEnter} on:mouseleave={mouseLeave}>
        <rect
          height={size}
          width={size}
          fill={barColors[legendItem]}
          y={i * size * 1.5}
          class:outline={hovered === legendItem}
        />
        <text x={size * 1.5} y={i * size * 1.5 + 16}>{legendItem}</text>
      </g>
    {/each}
  </g>
{/if}

<style>
  text {
    font-size: 14px;
  }
  .legend-item {
    pointer-events: bounding-box;
    cursor: default;
  }

  .outline {
    stroke-width: 2px;
    stroke: #282828;
  }
</style>
