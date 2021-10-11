<script>
  import _ from "lodash";

  export let barColors;
  export let x;
  export let y;

  const size = 20;
</script>

<g transform={`translate(${x}, ${y})`}>
  {#each _.keys(barColors) as legendItem, i}
    <rect height={size} width={size} fill={barColors[legendItem]} y={i * size * 1.5} />
    <text x={size * 1.5} y={i * size * 1.5 + 13}>{legendItem}</text>
  {/each}
</g>
