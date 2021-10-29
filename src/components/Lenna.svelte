<script>
  import _ from "lodash";
  import { onMount, tick } from "svelte";
  import viewport from "$stores/viewport";
  import { pixelSize } from "$stores/misc";

  export let step;
  export let pixels;

  $: visible = step === 3 || step === 4;

  let canvas;
  let ctx;
  let dpr = 1;

  $: yOffset = canvasHeight / 2 - (imageSizePixels * $pixelSize) / 2;
  $: xOffset = $viewport.width > 900 ? 200 * dpr : 80 * dpr;
  $: imageSizePixels = Math.sqrt(pixels.length);
  $: width = $viewport.width;
  $: height = $viewport.height;
  $: canvasWidth = width * dpr;
  $: canvasHeight = height * dpr;
  $: $pixelSize =
    $viewport.width > 900
      ? Math.floor((canvasWidth / imageSizePixels) * 0.4)
      : Math.floor((canvasWidth / imageSizePixels) * 0.66);

  $: canvasWidth, canvasHeight, face(); // redraw on resize
  $: if (visible && ready) face();

  const face = async () => {
    await tick();
    if (ready) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      pixels.forEach((d) => {
        const a = 1;
        const x = d.x * $pixelSize;
        const y = d.y * $pixelSize;
        const w = $pixelSize;
        const h = $pixelSize;
        const r = d.r;
        const g = d.g;
        const b = d.b;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b}, ${a})`;
        ctx.fillRect(x + xOffset, y + yOffset, w * dpr, h * dpr);
      });
    }
  };

  let ready = false;
  onMount(async () => {
    dpr = window.devicePixelRatio;
    ctx = canvas.getContext("2d");

    await tick();

    ready = true;
  });
</script>

<canvas
  bind:this={canvas}
  style="width: {width}px; height: {height}px;"
  width={canvasWidth}
  height={canvasHeight}
  class:visible
  class:delayed-fade={visible}
  class:get-out={step >= 5 || step === -1}
/>

<style>
  canvas {
    opacity: 0;
    transition: opacity 2s;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  }
  .visible {
    opacity: 1;
  }
  .delayed-fade {
    transition: opacity 2s 1.5s;
  }
  .get-out {
    display: none;
  }
</style>
