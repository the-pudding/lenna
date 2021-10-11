<script>
  import { onMount } from "svelte";
  import _ from "lodash";
  import viewport from "$stores/viewport";
  import { fade } from "svelte/transition";
  import DomainBars from "./DomainBars.svelte";
  import { barChartData, showUntilYear, domainData } from "$utils/barChart.js";

  export let step;
  export let playboyDestination;

  $: playboyDestination = { x: xScale ? xScale(1972) : 0, y: yScale ? yScale(0) : 0 };

  $: visible = step >= 6 && step < 12;
  $: showUntil = showUntilYear(step);

  const margin = { left: 50, right: 50, top: 100, bottom: 100 };
  $: width = $viewport.width;
  $: height = $viewport.height;

  const data = barChartData();

  let domains = null;
  $: if (step >= 9) domains = domainData();
  $: if (step < 9) domains = null;

  $: console.log({ data, domains });

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
      {#if domains}
        <DomainBars {domains} {xScale} {yScale} />
      {:else}
        {#each data.filter((d) => d.year <= showUntil) as d}
          <rect
            x={xScale(xAccessor(d))}
            y={yScale(yAccessor(d))}
            width={xScale.bandwidth()}
            height={height - yScale(yAccessor(d)) - margin.bottom}
            class:highlight={d.year === showUntil}
            transition:fade
          />
        {/each}
      {/if}
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
