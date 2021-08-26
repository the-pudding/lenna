<script>
  import { onMount, tick } from "svelte";
  import viewport from "$stores/viewport.js";
  import data from "$data/data.csv";
  import _ from "lodash";
  import Stats from "stats.js";

  const stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

  export let pixels = [];

  let backgroundCanvas;
  let foregroundCanvas;
  let backgroundCtx;
  let foregroundCtx;
  let foregroundPixels = [];
  let backgroundPixels = [];
  let fadeOutBackground = false;

  let dpr = 1;
  const imageSizePixels = Math.sqrt(pixels.length);
  let frames = 0;
  let currentFrame = 0;

  $: width = $viewport.width;
  $: height = $viewport.height;
  $: canvasWidth = width * dpr;
  $: canvasHeight = height * dpr;
  $: pixelSize = Math.floor(Math.min(canvasWidth, canvasHeight) / imageSizePixels);
  $: xScale = d3
    .scaleBand()
    .domain(d3.range(...d3.extent(pixels, (d) => d.year)))
    .range([0, width])
    .padding(0.1);

  const render = (ctx, pixels) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    pixels.forEach(({ imageX, imageY, rgb, r, g, b, a, x, y, w, h }) => {
      ctx.fillStyle = rgb;
      ctx.fillRect(x.value, y.value, w.value, h.value);
    });
  };

  const interpolate = (pixel, t) => {
    const { origin, target, ease } = pixel;
    const int = d3.interpolateNumber(origin, target);
    pixel.value = ease ? int(ease(t)) : int(t);
  };

  const frameTick = (ctx, pixels) => {
    stats.begin();

    const t = currentFrame / frames;

    pixels
      .filter((d) => d.animate.length > 0)
      .forEach((pixel) => {
        pixel.animate.forEach((prop) => interpolate(pixel[prop], t));
      });

    render(ctx, pixels);

    stats.end();

    currentFrame += 1;
    if (t < 1) window.requestAnimationFrame(() => frameTick(ctx, pixels));
  };

  const scatter = (ctx, pixels) => {
    const buffer = 40;

    pixels.slice(0, 100).forEach((d, i) => {
      d.animate = ["x", "y"];

      const goLeft = Math.random() < 0.5;
      if (goLeft) {
        d.x.target = -buffer;
      } else {
        d.x.target = width + buffer;
      }
      d.y.target = d3.randomInt(0, height)();
      d.x.ease = d3.easeCubicOut;
      d.y.ease = d3.easeCubicOut;
    });

    frames = 200;
    frameTick(ctx, pixels);
  };

  /*const fadeAllButOne = () => {
    pixels.forEach((d, i) => {
      if (i === 10) {
        d.animate = ["x", "y", "w", "h"];
        d.x.target = xScale(d.year);
        d.w.target = pixelSize * 10;
        d.h.target = pixelSize * 10;
        d.y.target = height - d.h.target;
      } else {
        d.animate = ["a"];
        d.a.target = 0;
      }
    });

    pixels.sort((a, b) => a.animate - b.animate);

    currentFrame = 0;
    frames = 150;
    frameTick();
  };*/

  const face = (ctx, pixels) => {
    pixels.forEach((d, i) => {
      d.animate = ["x", "y", "w", "h", "r", "g", "b", "a"];
      d.animate.forEach((field) => {
        d[field].target = d[field].origin;
      });
    });
    frames = 1;
    frameTick(ctx, pixels);
  };

  onMount(async () => {
    document.body.appendChild(stats.dom);

    backgroundCtx = backgroundCanvas.getContext("2d");
    foregroundCtx = foregroundCanvas.getContext("2d");
    dpr = window.devicePixelRatio;

    await tick();

    // join
    pixels = pixels.map((d, i) => ({
      ...d,
      ...data[i]
    }));
    // clean

    pixels.forEach((d) => {
      d.imageX = d.x;
      d.imageY = d.y;
      d.year = +d.year || 1970; // some are ""

      // const regex = /rgb\((\d+),(\d+),(\d+)\)/g;
      // const match = [...d.rgb.matchAll(regex)][0];

      const init = { target: undefined, value: undefined };
      d.x = { origin: d.imageX * pixelSize, ...init };
      d.y = { origin: d.imageY * pixelSize, ...init };
      d.w = { origin: pixelSize, ...init };
      d.h = { origin: pixelSize, ...init };
      d.r = { origin: d.r, ...init };
      d.g = { origin: d.g, ...init };
      d.b = { origin: d.b, ...init };
      d.a = { origin: 1, ...init };
      d.animate = [];
    });

    foregroundPixels = pixels.slice(0, 100);
    backgroundPixels = pixels.slice(100);

    face(backgroundCtx, backgroundPixels);
    face(foregroundCtx, foregroundPixels);
  });
</script>

<canvas
  class="background"
  class:fade-out={fadeOutBackground}
  bind:this={backgroundCanvas}
  style="width: {width}px; height: {height}px;"
  width={canvasWidth}
  height={canvasHeight}
/>
<canvas
  class="foreground"
  bind:this={foregroundCanvas}
  style="width: {width}px; height: {height}px;"
  width={canvasWidth}
  height={canvasHeight}
/>

<button
  on:click={() => {
    scatter(foregroundCtx, foregroundPixels);
    fadeOutBackground = true;
  }}>Test</button
>

<style>
  button {
    position: absolute;
    z-index: 1000;
  }
  canvas {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
  }
  div {
    border: 1px solid gray;
    width: 100px;
  }
  .fade-out {
    opacity: 0;
    transition: opacity 3s ease-out;
  }
</style>
