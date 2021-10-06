<script>
  import { formatData, getYearRange } from "$utils/bubbleChart";
  export let step;

  $: visible = step > 9;

  $: yearRange = getYearRange(step);
  $: data = yearRange && yearRange.length ? formatData(yearRange[0], yearRange[1]) : [];
</script>
