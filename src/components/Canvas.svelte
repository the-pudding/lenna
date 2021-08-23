<script>
  import { onMount } from "svelte";
  import viewport from "$stores/viewport.js";
  import data from "$data/data.csv";
  import _ from "lodash";
  import Stats from "stats.js";

  const stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

  export let pixels = [];

  pixels = pixels
    .map((d, i) => ({
      ...d,
      ...data[i]
    }))
    .map((d) => ({
      ...d,
      year: +d.year
    }));

  let canvas;
  let ctx;
  let dpr = 2; // change with screen
  const imageSize = Math.sqrt(pixels.length);

  $: width = $viewport.width * 0.5;
  $: height = $viewport.height * 0.5;
  $: pixelSize = Math.floor(Math.min(width, height) / imageSize);
  $: canvasWidth = width * dpr;
  $: canvasHeight = height * dpr;

  const frames = 200;
  let currentFrame = 0;

  // bar chart
  const range = (start, end) => {
    if (start === end) return [start];
    return [start, ...range(start + 1, end)];
  };
  const pixelsWithValidYear = pixels.filter((d) => Number.isInteger(d.year) && d.year !== 0);
  const maxYear = Math.max(...pixelsWithValidYear.map((d) => d.year));
  const minYear = Math.min(...pixelsWithValidYear.map((d) => d.year));
  const yearRange = range(minYear, maxYear);

  $: xScale = d3
    .scaleBand()
    .domain(yearRange)
    .range([0, width / 4])
    .padding(0.1);

  // $: xScale = d3
  //   .scaleLinear()
  //   .domain(d3.extent(data.map((d) => d.year).filter((d) => d !== "")))
  //   .range([0, width]);
  // const yScale = d3.scaleLinear().domain();

  const render = () => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    pixels.forEach(({ x, y, rgb }) => {
      ctx.fillStyle = rgb;
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    });
  };

  const tick = () => {
    stats.begin();

    render();
    const t = currentFrame / frames;
    pixels
      .filter((d) => d.animate)
      .forEach((pixel) => {
        pixel.y = pixel.originY * (1 - t) + pixel.targetY * t;
        pixel.x = pixel.originX * (1 - t) + pixel.targetX * t;

        if (t >= 1) {
          console.log("done");
          pixel.animate = false;
        }
      });

    stats.end();

    currentFrame += 1;
    if (t < 1) window.requestAnimationFrame(tick);
  };

  const onClick = () => {
    // update pixel target destinations
    pixels.forEach((d) => {
      d.animate = true;
      d.targetX = xScale(d.year);
      d.targetY = 130;
      d.originX = d.x;
      d.originY = d.y;
    });
    // start animation
    currentFrame = 0;
    tick();
  };

  onMount(() => {
    document.body.appendChild(stats.dom);

    ctx = canvas.getContext("2d");
    dpr = window.devicePixelRatio;
    render();
  });
</script>

<canvas
  bind:this={canvas}
  style="width: {width}px; height: {height}px;"
  width={canvasWidth}
  height={canvasHeight}
/>

<button on:click={onClick}>Test</button>

<style>
  canvas {
    display: block;
    position: fixed;
    top: 200px;
    left: 0;
  }
  div {
    border: 1px solid gray;
    width: 100px;
  }
</style>
