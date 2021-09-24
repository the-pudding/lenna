<script>
  import baseColors from "../../properties/colors/base.json";
  import { getOrigins, getDestinations, getLabels } from "$components/helpers/screenshots.js";
  import viewport from "$stores/viewport";
  import { fade } from "svelte/transition";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import _ from "lodash";

  export let key;
  export let enter;
  export let exit;
  export let i = null;

  const labels = getLabels(key);
  const origins = getOrigins(key);
  const destinations = getDestinations(key);

  const delay = 500;
  const finalSize = 200;
  const size = tweened(0, { duration: 2000, easing: cubicOut, delay: i ? delay * i : delay });

  $: visible = enter;
  $: leaving = exit && $size > 10;

  // growing
  $: if (visible && $size === 0) {
    size.set(finalSize);
  }
  // shrinking
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

  // let origins;
  // let destinations;
  // if (i) {
  //   origins = [...new Array(5).keys()].map((d) => ({
  //     x: _.random(0, $viewport.width - finalSize),
  //     y: _.random(0, $viewport.height - finalSize)
  //   }));
  //   destinations = [...new Array(5).keys()].map((d) => ({
  //     x: _.random(0, $viewport.width - finalSize),
  //     y: _.random(0, $viewport.height - finalSize)
  //   }));
  // } else {
  //   origins = [
  //     { x: 300, y: 200 },
  //     { x: 534, y: 67 },
  //     { x: 199, y: 600 },
  //     { x: 111, y: 45 },
  //     { x: 56, y: 230 }
  //   ];
  //   destinations = [
  //     { x: 100, y: 100 },
  //     { x: 600, y: 50 },
  //     { x: 350, y: 350 },
  //     { x: 20, y: 600 },
  //     { x: 650, y: 650 }
  //   ];
  // }
</script>

<div class="images">
  {#each [...new Array(5).keys()] as i}
    <div
      class="img-group"
      style={`top: ${visible ? destinations[i].y : origins[i].y}px; left: ${
        visible ? destinations[i].x : origins[i].x
      }px; width: ${finalSize}px;`}
    >
      {#if visible}
        <div class="label" transition:fade={{ delay }}>{labels[i]}</div>
      {/if}
      <img
        src={`assets/img/${key}/pic${i + 1}.png`}
        alt={key}
        style={`height: ${$size}px; width: ${$size}px; opacity: ${
          visible || leaving ? 1 : 0
        }; border-color: ${colors[i]}`}
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
    opacity: 0;
    height: 0px;
    width: 0px;
    border: 7px solid;
  }
</style>
