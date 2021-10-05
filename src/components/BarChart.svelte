<script>
  import { onMount } from "svelte";
  import _ from "lodash";
  import viewport from "$stores/viewport";
  import { barChartData } from "$utils/data.js";

  export let step;
  $: visible = step >= 5 && step < 8;

  const margin = { left: 50, right: 50, top: 100, bottom: 100 };
  $: width = $viewport.width;
  $: height = $viewport.height;

  const data = barChartData();

  let xScale;
  let yScale;
  let drawXAxis;
  let drawYAxis;
  const xAccessor = (d) => d.year;
  const yAccessor = (d) => d.value;

  const drawAxes = () => {
    if (xScale && yScale) {
      drawXAxis = (g) => g.call(d3.axisBottom(xScale));
      drawYAxis = (g) =>
        g.call(d3.axisLeft(yScale).tickSize(-1 * (width - margin.left - margin.right)));
      d3.select("#x-axis").call(drawXAxis);
      d3.select("#y-axis").call(drawYAxis);
    }
  };

  const updateScales = () => {
    if (xScale && yScale) {
      xScale.range([margin.left, width - margin.right]);
      yScale.range([height - margin.bottom, margin.top]);

      xScale = xScale;
      yScale = yScale;
    }
  };

  $: width, height, updateScales();
  $: width, height, drawAxes();

  onMount(() => {
    xScale = d3
      .scaleBand()
      .domain(
        d3.range(
          d3.min(data, (d) => d.year),
          d3.max(data, (d) => d.year) + 1
        )
      )
      .range([margin.left, width - margin.right])
      .paddingInner(0.1);

    yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([height - margin.bottom, margin.top]);

    drawAxes();
  });
</script>

<svg {width} {height} class:visible>
  <g>
    <g id="x-axis" transform={`translate(0, ${height - margin.bottom})`} />
    <g id="y-axis" transform={`translate(${margin.left}, 0)`} />
    {#if xScale && yScale}
      {#each data as d}
        <rect
          x={xScale(xAccessor(d))}
          y={yScale(yAccessor(d))}
          width={xScale.bandwidth()}
          height={height - yScale(yAccessor(d)) - margin.bottom}
        />
      {/each}
    {/if}
  </g>
</svg>

<style>
  .visible {
    display: block;
  }
  svg {
    display: none;
  }
  rect {
    fill: var(--base-purple-3);
  }
  :global(text) {
    font-family: var(--mono);
    font-size: 12px;
    fill: var(--chart-text);
  }
  :global(line) {
    color: var(--base-purple-2);
  }
  :global(path) {
    display: none;
  }
  :global(#x-axis .tick:nth-child(odd)) {
    display: none;
  }
  .highlight {
    stroke: var(--base-green-2);
    stroke-width: 3px;
  }
</style>
