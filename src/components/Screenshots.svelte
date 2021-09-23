<script>
  import baseColors from "../../properties/colors/base.json";
  import viewport from "$stores/viewport";
  import { fade } from "svelte/transition";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import _ from "lodash";

  export let step;
  export let type;
  export let enter;
  export let i = null;

  const delay = 500;
  const finalSize = 200;
  const size = tweened(0, { duration: 2000, easing: cubicOut, delay });

  //$: pixelOrigins = pixels ? _.sampleSize(pixels, 5).map(({ x, y }) => ({ x, y })) : null;
  $: visible = step >= enter;

  // when it comes into view
  $: if (visible && $size !== finalSize) {
    size.set(finalSize);
  }
  // when it leaves view
  $: if (!visible) {
    size.set(0);
  }

  const colors = [
    baseColors.base["green-2"].value,
    baseColors.base["orange-1"].value,
    baseColors.base["red"].value,
    baseColors.base["blue-1"].value,
    baseColors.base["tan-1"].value
  ];
  const names =
    type === "internet"
      ? ["Grumpy cat", "These are all cakes", "Disaster girl", "Bernie's mittens", "Oregon Trail"]
      : ["Lenna 1", "Lenna 2", "Lenna 3", "Lenna 4", "Lenna 5"];

  let origins;
  let destinations;
  if (i) {
    origins = [...new Array(5).keys()].map((d) => ({
      x: _.random(0, $viewport.width - finalSize),
      y: _.random(0, $viewport.height - finalSize)
    }));
    destinations = [...new Array(5).keys()].map((d) => ({
      x: _.random(0, $viewport.width - finalSize),
      y: _.random(0, $viewport.height - finalSize)
    }));
  } else {
    origins = [
      { x: 300, y: 200 },
      { x: 534, y: 67 },
      { x: 199, y: 600 },
      { x: 111, y: 45 },
      { x: 56, y: 230 }
    ];
    destinations = [
      { x: 100, y: 100 },
      { x: 600, y: 50 },
      { x: 350, y: 350 },
      { x: 20, y: 600 },
      { x: 650, y: 650 }
    ];
  }
</script>

<!-- {#if pixelOrigins} -->
<div class="images">
  {#each [...new Array(5).keys()] as i}
    <div
      class="img-group"
      style={`top: ${visible ? destinations[i].y : origins[i].y}px; left: ${
        visible ? destinations[i].x : origins[i].x
      }px; width: ${finalSize}px`}
    >
      {#if visible}
        <div class="label" transition:fade={{ delay }}>{names[i]}</div>
      {/if}
      <img
        src={`assets/img/${type}-screenshots/pic${i + 1}.png`}
        alt={type === "internet" ? `${names[i]} meme` : "screenshot of lenna"}
        style={`height: ${$size}px; width: ${$size}px; border: ${
          $size > 8 ? `7px solid ${colors[i]}` : ""
        }`}
      />
    </div>
  {/each}
</div>

<!-- {/if} -->
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
