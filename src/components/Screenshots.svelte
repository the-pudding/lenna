<script>
  import {
    getOrigins,
    getDestinations,
    getLabels,
    colors
  } from "$components/helpers/screenshots.js";
  import viewport from "$stores/viewport.js";
  import { fade } from "svelte/transition";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import _ from "lodash";

  export let key;
  export let visible = false;
  export let count = 0;
  export let i = null;

  const labels = getLabels(key);
  $: origins = getOrigins(key, $viewport.width, $viewport.height, finalSize);
  $: destinations = getDestinations(key, $viewport.width, $viewport.height, finalSize);

  const delay = 600;
  const finalSize = 200;
  const size = tweened(0, { duration: 2000, easing: cubicOut, delay: i ? delay * i : delay });

  $: leaving = !visible && $size > 10;

  // growing
  $: if (visible && $size === 0) {
    size.set(finalSize);
  }
  // shrinking
  $: if (!visible) {
    size.set(0);
  }
</script>

<div class="images">
  {#each [...new Array(count).keys()] as i}
    <div
      class="img-group"
      style={`top: ${visible ? destinations[i].y : origins[i].y}px; left: ${
        visible ? destinations[i].x : origins[i].x
      }px; width: ${finalSize}px; transition-delay: ${delay}ms`}
    >
      {#if visible}
        <div class="label" transition:fade={{ delay }}>{labels[i]}</div>
      {/if}
      <img
        src={`assets/img/${key.includes("memes") ? "memes" : key}/pic${i + 1}.png`}
        alt={key}
        style={`height: ${$size}px; width: ${$size}px; opacity: ${
          visible || leaving ? 1 : 0
        }; border: 7px solid ${colors[i]}`}
        transition:fade
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
