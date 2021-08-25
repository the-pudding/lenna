<script>
  import { onMount } from "svelte";
  import viewport from "$stores/viewport.js";
  import data from "$data/data.csv";
  import _ from "lodash";
  import Stats from "stats.js";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  const stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

  export let pixels = [];

  let canvas;
  let ctx;
  let dpr = 1; // change with screen
  const imageSizePixels = Math.sqrt(pixels.length);
  let frames = 0;
  let currentFrame = 0;

  $: width = $viewport.width;
  $: height = $viewport.height;
  $: pixelSize = Math.floor(Math.min(width, height) / imageSizePixels);
  $: canvasWidth = width * dpr;
  $: canvasHeight = height * dpr;
  $: xScale = d3
    .scaleBand()
    .domain(d3.range(...d3.extent(pixels, (d) => d.year)))
    .range([0, width])
    .padding(0.1);

  const render = () => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    pixels.forEach(({ x, y, w, h, r, g, b, a }) => {
      ctx.fillStyle = `rgb(${r.value}, ${g.value}, ${b.value}, ${a.value})`;
      ctx.fillRect(x.value, y.value, w.value, h.value);
    });
  };

  const interpolate = (pixel, t) => {
    const { origin, target, ease } = pixel;
    const int = d3.interpolateNumber(origin, target);
    pixel.value = ease ? int(ease(t)) : int(t);
  };

  const tick = () => {
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
    if (t < 1) window.requestAnimationFrame(tick);
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
    tick();
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
    tick();
  };

  const face = () => {
    pixels.forEach((d, i) => {
      d.animate = ["x", "y", "w", "h", "r", "g", "b", "a"];
      d.animate.forEach((field) => {
        d[field].target = d[field].origin;
      });
    });
    frames = 1;
    tick();
  };

  onMount(() => {
    document.body.appendChild(stats.dom);

    ctx = canvas.getContext("2d");
    dpr = window.devicePixelRatio;

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

    face();
  });
</script>

<canvas
  bind:this={canvas}
  style="width: {width}px; height: {height}px;"
  width={canvasWidth}
  height={canvasHeight}
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
</style>
