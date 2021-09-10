<script>
  import viewport from "$stores/viewport";
  import { onMount, tick } from "svelte";
  import _ from "lodash";

  export let step;

  let visible = true;
  $: if (step !== undefined) visible = false;
  $: if (step === undefined) visible = true;

  let canvas;
  let ctx;
  let dpr = 1;
  let currentFrame = 0;
  $: width = $viewport.width;
  $: height = $viewport.height;
  $: canvasWidth = width * dpr;
  $: canvasHeight = height * dpr;

  let timer;

  // look & feel
  const colors = ["#540045", "#C60052", "#FF714B", "#EAFF87", "#ACFFE9"];
  const pixelSize = 50;
  const pixelsShowingFactor = 75;
  const frames = 100;
  const timeBetween = 2000;

  $: numPixels = Math.floor(canvasWidth / pixelSize) * Math.floor(canvasHeight / pixelSize);
  $: pixels = [...new Array(numPixels).keys()].map((i) => {
    const row = Math.floor((i * pixelSize) / canvasWidth);
    const col = Math.floor(((i * pixelSize) % canvasWidth) / pixelSize);
    return {
      i,
      x: col * pixelSize,
      y: row * pixelSize,
      color: colors[i % 5],
      opacity: { origin: 0, target: 0, value: 0 },
      animate: []
    };
  });

  const interpolate = (pixel, t) => {
    const { origin, target, ease } = pixel;
    const int = d3.interpolateNumber(origin, target);
    pixel.value = ease ? int(ease(t)) : int(t);
  };

  const render = () => {
    if (ctx) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      pixels.forEach(({ x, y, opacity, color }) => {
        ctx.globalAlpha = opacity.value;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, pixelSize, pixelSize);
      });
    }
  };

  const frameTick = () => {
    const t = currentFrame / frames;

    pixels
      .filter((d) => d.animate.length > 0)
      .forEach((pixel) => {
        pixel.animate.forEach((prop) => interpolate(pixel[prop], t));
      });

    render();

    currentFrame += 1;
    if (t < 1) {
      window.requestAnimationFrame(frameTick);
    } else {
      console.log("done");
      currentFrame = 0;
    }
  };

  const choose = () => {
    // fade out currently visible ones
    pixels
      .filter((d) => d.animate.length > 0)
      .forEach((pixel) => {
        pixel.opacity.origin = 0.35;
        pixel.opacity.target = 0;
        pixel.opacity.value = 0.35;
      });
    const chosen = _.sampleSize(pixels, numPixels / pixelsShowingFactor);

    // fade new ones in
    chosen.forEach((pixel) => {
      pixel.opacity.target = 1;
      pixel.animate = ["opacity"];
    });
  };

  const drawLoop = () => {
    choose();
    frameTick();
    timer = setTimeout(drawLoop, timeBetween);
  };

  onMount(async () => {
    dpr = window.devicePixelRatio;
    ctx = canvas.getContext("2d");
    await tick();
  });
</script>

<button on:click={drawLoop}>start</button>
<button on:click={() => clearTimeout(timer)}>stop</button>
{#if visible}
  <canvas
    bind:this={canvas}
    style="width: {width}px; height: {height}px;"
    width={canvasWidth}
    height={canvasHeight}
  />
{/if}

<style>
  button:first-of-type {
    position: absolute;
    z-index: 1000;
    top: 20px;
  }
  button:last-of-type {
    position: absolute;
    z-index: 1000;
    top: 20px;
    left: 80px;
  }
  canvas {
    background: #101010;
    position: fixed;
    top: 100px;
    left: 0;
  }
</style>
