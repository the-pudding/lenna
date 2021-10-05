<script>
  import { getOrigins, getDestinations, getLabels, colors } from "$utils/screenshots.js";
  import viewport from "$stores/viewport.js";
  import { fade } from "svelte/transition";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import _ from "lodash";

  export let key;
  export let visible = false;
  export let faded = false;
  export let count = 0;
  export let pixels;

  const labels = getLabels(key);
  $: origins = getOrigins(pixels);
  $: destinations = getDestinations(key, $viewport.width, $viewport.height, finalSize);

  const delay = 600;
  const finalSize = 200;
  const size = tweened(0, { duration: 2000, easing: cubicOut });
  const opacity = tweened(0, { duration: 2000, easing: cubicOut });

  // $: leaving = !visible && $size > 2;

  $: if (visible && $size === 0) {
    size.set(finalSize);
  }
  $: if (!visible) {
    size.set(0);
    opacity.set(0);
  }
  $: if (faded && visible) {
    opacity.set(0.25);
  }
  $: if (visible && !faded) {
    opacity.set(1);
  }
</script>

<div class="images">
  {#each [...new Array(count).keys()] as i}
    <div
      class="img-group"
      style={`top: ${visible ? destinations[i].y : origins[i].y}px; left: ${
        visible ? destinations[i].x : origins[i].x
      }px; width: ${finalSize}px;`}
    >
      <div class="label" style={`opacity: ${$opacity}`}>{labels[i]}</div>
      <img
        src={`assets/img/${key.includes("memes") ? "memes" : key}/pic${i + 1}.png`}
        alt={key}
        style={`height: ${$size}px; width: ${$size}px; opacity: ${$opacity}; border: 7px solid ${colors[i]}`}
      />
    </div>
  {/each}
</div>

<style>
  .images {
    display: flex;
    flex-direction: column;
  }
  .img-group {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: left 2s, top 2s;
  }
  .label {
    font-size: 16px;
    line-height: 32px;
  }
  img {
    height: 0px;
    width: 0px;
  }
</style>
