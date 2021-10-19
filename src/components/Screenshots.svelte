<script>
  import { getOrigins, getDestinations, getLabels, colors } from "$utils/screenshots.js";
  import viewport from "$stores/viewport.js";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import _ from "lodash";

  export let key = "";
  export let visible = false;
  export let faded = false;
  export let showLabels;
  export let delay = 600;
  export let picNums = [1, 2, 3, 4, 5];

  const count = 5;
  const labels = getLabels(key);
  const duration = 2000;
  const size = tweened(0, { duration, easing: cubicOut, delay });
  const opacity = tweened(0, { duration, easing: cubicOut });

  $: origins = getOrigins($viewport.width, $viewport.height);
  $: destinations = getDestinations(key, $viewport.width, $viewport.height, finalSize);
  $: finalSize = $viewport.width > 700 ? 200 : 100;
  $: finalSize, visible && size.set(finalSize);

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
      }px; width: ${finalSize}px; transition: left ${duration}ms ${delay}ms, top ${duration}ms ${delay}ms`}
    >
      {#if showLabels}
        <div class="label" class:hidden={finalSize - $size > 10} class:faded>
          {labels[i]}
        </div>
      {/if}
      <img
        src={`assets/img/${key.includes("meme") ? "memes" : "screenshots"}/pic${picNums[i]}.jpg`}
        alt={key}
        style={`height: ${$size}px; width: ${$size}px; opacity: ${$opacity}`}
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
  }
  .label {
    font-size: 16px;
    line-height: 32px;
    opacity: 1;
    transition: opacity 0.5s;
  }
  img {
    height: 0px;
    width: 0px;
    border: 7px solid var(--base-green-2);
  }
  .hidden {
    opacity: 0;
  }
  .faded {
    opacity: 0.25;
  }
</style>
