<script>
  import { getOrigins, getDestinations, getLabels, colors } from "$utils/screenshots.js";
  import viewport from "$stores/viewport.js";
  import { pixelSize } from "$stores/misc";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import _ from "lodash";

  export let key = "";
  export let visible = false;
  export let faded = false;
  export let delay = 600;
  export let picNums = [1, 2, 3, 4, 5];

  const count = 5;
  const labels = getLabels(key);
  const duration = 2000;
  const size = tweened(0, { duration, easing: cubicOut, delay });
  const opacity = tweened(0, { duration, easing: cubicOut });

  $: origins = getOrigins($viewport.width, $viewport.height);
  $: destinations = getDestinations(key, $viewport.width, $viewport.height, finalSize);
  $: finalSize = $viewport.width > 700 ? 200 : 120;
  $: finalSize, visible && size.set(finalSize);

  $: console.log($pixelSize);

  // $: if (visible && $size === 0) {
  //   size.set(finalSize);
  // }
  // $: if (!visible) {
  //   size.set(0);
  //   opacity.set(0);
  // }
  // $: if (faded && visible) {
  //   opacity.set(0.25);
  // }
  // $: if (visible && !faded) {
  //   opacity.set(1);
  // }

  const getColor = (i) => {
    if (key.includes("meme")) return colors[i];
    if (visible) return "var(--base-green-2)";

    if (i % 2 === 1) return "var(--base-purple-3)";
    return "var(--base-tan-1)";
  };
</script>

<div class="images">
  {#each [...new Array(count).keys()] as i}
    <div
      class="img-group"
      style={`top: ${visible ? destinations[i].y : origins[i].y}px; left: ${
        visible ? destinations[i].x : origins[i].x
      }px; width: ${finalSize}px; transition: left ${duration}ms ${delay}ms, top ${duration}ms ${delay}ms`}
    >
      <img
        src={`assets/img/${key.includes("meme") ? "memes" : "screenshots"}/pic${picNums[i]}.jpg`}
        alt={key}
        style={`--border: ${Math.ceil($pixelSize / (visible ? 0.8 : 2))}px; color: ${getColor(i)}`}
        class:big={visible}
        class:opaque={visible && !faded}
        class:faded={faded && visible}
        class:hidden={!visible}
        class:delayed-opacity={key === "lennas" && !visible}
        class:delayed-growth={visible}
      />
    </div>
  {/each}
</div>

<style>
  .images {
    display: flex;
    flex-direction: column;
    pointer-events: none;
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
    --dur: 1.5s;
    --del: 1.5s;
    height: 0px;
    width: 0px;
    background-color: currentColor;
    border-color: currentColor;
    border-width: var(--border);
    border-style: solid;
    transition: all var(--dur);
  }
  img.opaque {
    opacity: 1;
  }
  img.delayed-opacity {
    transition: width var(--dur), height var(--dur), border-color var(--dur),
      border-width var(--dur), opacity var(--dur) var(--del);
  }
  img.delayed-growth {
    transition: width var(--dur) var(--del), height var(--dur) var(--del), opacity var(--dur),
      border-color var(--dur);
  }
  img.hidden {
    opacity: 0;
  }
  img.faded {
    opacity: 0.2;
  }
  img.big {
    width: 200px;
    height: 200px;
  }

  /* .hidden {
    opacity: 0;
  }
  .faded {
    opacity: 0.2;
  } */
</style>
