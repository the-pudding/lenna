<script>
  import { onMount } from "svelte";
  import _ from "lodash";
  import viewport from "$stores/viewport";

  export let step;

  const margin = { left: 50, right: 50, top: 10, bottom: 100 };
  $: width = $viewport.width;
  $: height = $viewport.height;

  const fakeData = _.times(20, (i) => ({ year: 1800 + i * 10, value: _.random(100) }));

  let xScale;
  let yScale;
  let drawXAxis;
  let drawYAxis;
  const xAccessor = (d) => d.year;
  const yAccessor = (d) => d.value;

  const drawAxes = () => {
    if (xScale && yScale) {
      drawXAxis = (g) => g.call(d3.axisBottom(xScale));
      drawYAxis = (g) => g.call(d3.axisLeft(yScale));
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
          d3.min(fakeData, (d) => d.year),
          d3.max(fakeData, (d) => d.year) + 10,
          10
        )
      )
      .range([margin.left, width - margin.right])
      .paddingInner(0.1);

    yScale = d3
      .scaleLinear()
      .domain([0, d3.max(fakeData, (d) => d.value)])
      .range([height - margin.bottom, margin.top]);

    drawAxes();
  });
</script>

<svg {width} {height}>
  <g transform={`translate(${margin.left}, ${margin.top})`}>
    <g id="x-axis" transform={`translate(0, ${height - margin.bottom})`} />
    <g id="y-axis" transform={`translate(${margin.left}, 0)`} />
    {#if xScale && yScale}
      {#each fakeData as d}
        <rect
          x={xScale(xAccessor(d))}
          y={height - margin.bottom - yScale(yAccessor(d))}
          width={xScale.bandwidth()}
          height={yScale(yAccessor(d))}
        />
      {/each}
    {/if}
  </g>
</svg>

<style>
  rect {
    fill: var(--base-purple-3);
  }
  :global(text) {
    font-family: var(--mono);
    font-size: 12px;
    fill: var(--chart-text);
  }
  :global(line) {
    display: none;
  }
  :global(path) {
    display: none;
  }
</style>
