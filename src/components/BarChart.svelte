<script>
  import _ from "lodash";
  import viewport from "$stores/viewport";

  export let step;

  const margin = { left: 10, right: 10, top: 10, bottom: 10 };
  $: width = $viewport.width - margin.left - margin.right;
  $: height = $viewport.height - margin.top - margin.bottom;

  const fakeData = _.times(20, (i) => ({ year: 1800 + i * 10, value: _.random(100) }));
  console.log(fakeData);

  const xScale = d3.scaleBand();
</script>

<svg {width} {height}>
  <g transform={`translate(${margin.left}, ${margin.top})`} />
</svg>
