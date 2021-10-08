<script>
  import baseColors from "../../properties/colors/base.json";
  import { fade } from "svelte/transition";
  import _ from "lodash";

  export let domains;
  export let xScale;
  export let yScale;
  export let margin;
  export let height;

  const colors = {
    ".org": baseColors.base["green-2"].value,
    ".edu": baseColors.base["blue-2"].value,
    ".com": baseColors.base["orange-1"].value,
    other: baseColors.base["tan-3"].value
  };

  const myActualY = (bar, domain) => {
    let countsUnderMe = _.keys(bar)
      .filter((d) => d !== "year")
      .filter((d) => bar[d] < bar[domain])
      .map((d) => bar[d]);

    // const countsEqualToMe = _.keys(bar)
    //   .filter((d) => d !== "year")
    //   .filter((d) => d !== domain && bar[d] === bar[domain]);

    // if (countsEqualToMe.length) countsUnderMe.push(bar[domain]);

    const heightUnderMe = _.sum(countsUnderMe.map((d) => height - yScale(d) - margin.bottom));

    return yScale(bar[domain]) - heightUnderMe;
  };
</script>

{#each domains as bar}
  {#each _.sortBy( _.keys(bar).filter((d) => d !== "year"), (d) => bar[d] ) as domain}
    <rect
      x={xScale(bar.year)}
      y={myActualY(bar, domain)}
      width={xScale.bandwidth()}
      height={height - yScale(bar[domain]) - margin.bottom}
      fill={colors[domain]}
      transition:fade
    />
  {/each}
{/each}

<style>
</style>
