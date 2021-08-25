<script>
  import { onMount, tick } from "svelte";
  import viewport from "$stores/viewport.js";
  import data from "$data/data.csv";
  import _ from "lodash";
  import Stats from "stats.js";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  const stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

  export let pixels = [];

  let offscreenCanvas;
  let canvas;
  let ctx;
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

  const render = () => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    pixels.forEach(({ imageX, imageY, r, g, b, a, x, y, w, h }) => {
      // ctx.fillStyle = `rgb(${r.value}, ${g.value}, ${b.value}, ${a.value})`;
      // ctx.fillRect(x.value, y.value, w.value, h.value);
      ctx.drawImage(offscreenCanvas, imageX, imageY, 1, 1, x.value, y.value, w.value, h.value);
    });
  };

  const interpolate = (pixel, t) => {
    const { origin, target, ease } = pixel;
    const int = d3.interpolateNumber(origin, target);
    pixel.value = ease ? int(ease(t)) : int(t);
  };

  const frameTick = () => {
    stats.begin();

    const t = currentFrame / frames;

    pixels
      .filter((d) => d.animate.length > 0)
      .forEach((pixel) => {
        pixel.animate.forEach((prop) => interpolate(pixel[prop], t));
      });

    render();

    stats.end();

    currentFrame += 1;
    if (t < 1) window.requestAnimationFrame(frameTick);
  };

  const scatter = () => {
    const buffer = 40;

    pixels.forEach((d, i) => {
      if (i === 10) {
        d.animate = ["x", "y", "w", "h"];
        d.x.target = xScale(d.year);
        d.w.target = pixelSize * 10;
        d.h.target = pixelSize * 10;
        d.y.target = height - d.h.target;
        d.x.ease = d3.easeCubicOut;
        d.y.ease = d3.easeCubicOut;
        d.w.ease = d3.easeCubicOut;
        d.h.ease = d3.easeCubicOut;
      } else {
        d.animate = ["x", "y", "a"];

        const goLeft = Math.random() < 0.5;
        if (goLeft) {
          d.x.target = -buffer;
        } else {
          d.x.target = width + buffer;
        }
        d.y.target = d3.randomInt(0, height)();
        d.a.target = 0;
        d.x.ease = d3.easeCubicOut;
        d.y.ease = d3.easeCubicOut;
        d.a.ease = d3.easeCubicOut;
      }
    });

    frames = 200;
    frameTick();
  };

  const fadeAllButOne = () => {
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
  };

  const face = () => {
    pixels.forEach((d, i) => {
      d.animate = ["x", "y", "w", "h", "r", "g", "b", "a"];
      d.animate.forEach((field) => {
        d[field].target = d[field].origin;
      });
    });
    frames = 1;
    frameTick();
  };

  onMount(async () => {
    document.body.appendChild(stats.dom);

    ctx = canvas.getContext("2d");
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

      const regex = /rgb\((\d+),(\d+),(\d+)\)/g;
      const match = [...d.rgb.matchAll(regex)][0];

      const init = { target: undefined, value: undefined };
      d.x = { origin: d.imageX * pixelSize, ...init };
      d.y = { origin: d.imageY * pixelSize, ...init };
      d.w = { origin: pixelSize, ...init };
      d.h = { origin: pixelSize, ...init };
      d.r = { origin: +match[1], ...init };
      d.g = { origin: +match[2], ...init };
      d.b = { origin: +match[3], ...init };
      d.a = { origin: 1, ...init };
      d.animate = [];
    });

    const offscreenCtx = offscreenCanvas.getContext("2d");
    pixels.forEach(({ imageX, imageY, rgb }) => {
      offscreenCtx.fillStyle = rgb;
      offscreenCtx.fillRect(imageX, imageY, 1, 1);
    });

    face();
  });
</script>

<canvas
  bind:this={canvas}
  style="width: {width}px; height: {height}px;"
  width={canvasWidth}
  height={canvasHeight}
/>
<canvas
  bind:this={offscreenCanvas}
  class="offscreen"
  width={imageSizePixels}
  height={imageSizePixels}
  style="width: {imageSizePixels}; height: {imageSizePixels}px;"
/>

<button on:click={scatter}>Test</button>

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
  .offscreen {
    top: 0;
    left: 500px;
    z-index: 1000000;
  }
</style>
