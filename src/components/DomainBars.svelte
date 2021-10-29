<script>
  import Legend from "./Legend.svelte";
  import { fade } from "svelte/transition";
  import _ from "lodash";
  import { onMount } from "svelte";

  export let domains;
  export let xScale;
  export let yScale;
  export let barColors;

  let stackData;
  onMount(() => {
    stackData = d3
      .stack()
      .keys([".org", ".edu", ".com", "other"])(domains)
      .map((d) => (d.forEach((m) => (m.key = d.key)), d))
      .map((d) => d.filter((m) => !Number.isNaN(m[0]) && !Number.isNaN(m[1])));

    // add hover listeners to text spans
    d3.selectAll(".step .org-span")
      .attr("id", ".org")
      .on("mouseenter", mouseEnter)
      .on("mouseleave", mouseLeave);
    d3.selectAll(".step .edu-span")
      .attr("id", ".edu")
      .on("mouseenter", mouseEnter)
      .on("mouseleave", mouseLeave);
    d3.selectAll(".step .com-span")
      .attr("id", ".com")
      .on("mouseenter", mouseEnter)
      .on("mouseleave", mouseLeave);
    d3.selectAll(".step .other-span")
      .attr("id", "other")
      .on("mouseenter", mouseEnter)
      .on("mouseleave", mouseLeave);
  });

  let hovered = null;
  const mouseEnter = (e) => {
    hovered = e.target.id;
  };
  const mouseLeave = () => {
    hovered = null;
  };
</script>

{#if stackData}
  {#each stackData as domain}
    {#each domain as minibar}
      <rect
        x={xScale(minibar.data.year)}
        y={yScale(minibar[1])}
        width={xScale.bandwidth()}
        height={yScale(minibar[0]) - yScale(minibar[1])}
        fill={barColors[minibar.key]}
        transition:fade
        on:mouseenter={mouseEnter}
        on:mouseleave={mouseLeave}
        class:faded={hovered && hovered !== minibar.key}
        id={minibar.key}
      />
    {/each}
  {/each}
{/if}
<Legend {barColors} x={xScale(1975)} y={yScale(250)} bind:hovered />

<style>
  .faded {
    opacity: 0.3;
  }
  rect {
    opacity: 1;
  }
</style>
