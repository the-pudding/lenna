<script>
  import { onMount } from "svelte";
  import _ from "lodash";
  import viewport from "$stores/viewport";
  import { fade } from "svelte/transition";
  import DomainBars from "./DomainBars.svelte";
  import { barChartData, showUntilYear, domainData, barColors } from "$utils/barChart.js";

  export let step;
  export let playboyDestination;

  $: playboyDestination = {
    x: xScale ? xScale(1972) : 0,
    y: yScale ? yScale(0) + 15 : 0,
    w: xScale ? xScale.bandwidth() : 0,
    h: yScale ? height - yScale(3) - margin.bottom : 0
  };

  $: visible = step >= 5 || step === -1;
  $: [showUntil, previousShowUntil] = showUntilYear(step, showUntil);

  const margin = { left: 50, right: 50, top: 100, bottom: 100 };
  $: width = $viewport.width;
  $: height = $viewport.height;
  $: screenType = width ? getScreen(width) : "desktop";

  const getScreen = (w) => {
    if (w <= 480) return "mobile-small";
    else if (w <= 680) return "mobile-large";
    else if (w < 980) return "desktop-small";
    else return "desktop-large";
  };

  const data = barChartData();
  $: domains = domainData(step);

  let xScale;
  let yScale;
  let drawXAxis;
  let drawYAxis;
  const xAccessor = (d) => d.year;
  const yAccessor = (d) => d.value;

  $: showUntil, width, updateTicks();

  const updateTicks = () => {
    if (xScale && yScale) {
      // highlight label
      d3.selectAll("#x-axis .tick text")
        .filter((d) => d === showUntil)
        .attr("class", "highlight-label");

      // hide x-axis labels based on screen size
      let n = 0;
      if (screenType === "desktop-large") n = 2;
      else if (screenType === "desktop-small") n = 5;
      else if (screenType === "mobile-large") n = 5;
      else if (screenType === "mobile-small") n = 8;

      d3.selectAll("#x-axis .tick text")
        .filter((d) => (d - 1972) % n !== 0 && d !== showUntil)
        .attr("class", "hide");

      d3.selectAll("#x-axis .tick text")
        .filter((d) => d !== showUntil && (d - 1972) % n === 0)
        .attr("class", "");

      // prevent overlap
      //if (showUntil % 2 === 1) {
      d3.selectAll("#x-axis .tick text")
        .filter((d) =>
          screenType === "mobile-large" ||
          screenType === "mobile-small" ||
          screenType === "desktop-small"
            ? Math.abs(d - showUntil) <= 6 && Math.abs(d - showUntil) !== 0
            : Math.abs(d - showUntil) === 1
        )
        .attr("class", "hide");
      //}
    }
  };

  const drawAxes = () => {
    if (xScale && yScale) {
      drawXAxis = (g) => g.call(d3.axisBottom(xScale));
      drawYAxis = (g) =>
        g.call(d3.axisLeft(yScale).tickSize(-1 * (width - margin.left - margin.right)));
      d3.select("#x-axis").call(drawXAxis);
      d3.select("#y-axis").call(drawYAxis);

      d3.selectAll("#y-axis .tick:last-child text")
        .attr("x", "115")
        .text((d) => `${d} found instances`);
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
    updateTicks();
  });

  const getDelay = (i, previousShowUntil) => {
    const index = data.findIndex((d) => d.year === previousShowUntil);
    return (i - index) * 80;
  };
</script>

<svg {width} {height} class:visible class="bar-chart">
  <g>
    <g id="x-axis" transform={`translate(0, ${height - margin.bottom})`} />
    <g id="y-axis" transform={`translate(${margin.left - 5}, 0)`} />
    {#if xScale && yScale}
      {#each data.filter((d) => d.year <= showUntil) as d, i}
        <rect
          x={xScale(xAccessor(d))}
          y={yScale(yAccessor(d))}
          width={xScale.bandwidth()}
          height={height - yScale(yAccessor(d)) - margin.bottom}
          class:highlight={d.year === showUntil}
          class:hide={domains}
          in:fade={{ delay: getDelay(i, previousShowUntil) }}
          out:fade
        />
      {/each}

      {#if domains}
        <DomainBars {domains} {xScale} {yScale} {barColors} />
      {/if}
    {/if}
  </g>
</svg>

<style>
  svg {
    display: none;
  }
  .visible {
    display: block;
  }
  rect {
    fill: var(--base-purple-3);
  }
  :global(.bar-chart text) {
    font-family: var(--mono);
    font-size: 12px;
    fill: var(--chart-text);
  }
  :global(.bar-chart line) {
    color: var(--base-purple-2);
  }
  :global(.bar-chart path) {
    display: none;
  }
  :global(#x-axis .tick line) {
    display: none;
  }
  .highlight {
    stroke: var(--base-green-2);
    stroke-width: 3px;
  }
  :global(.highlight-label) {
    display: block !important;
    fill: var(--base-tan-3) !important;
    font-weight: bold;
    font-size: 18px !important;
  }
  :global(.hide) {
    display: none;
  }
</style>
