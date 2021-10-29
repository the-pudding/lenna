<script>
  import viewport from "$stores/viewport";
  import { onMount, tick, afterUpdate } from "svelte";
  import baseColors from "$data/variables.json";
  import { fade } from "svelte/transition";

  export let step;
  export let size;

  const pixelsToLaunch = 75;
  const pixelSpreadSpeed = 3;
  const fadeSpeed = 0.01;

  let canvas;
  let ctx;
  let dpr = 1;
  let mousePosition;
  let currentPixel = 0;
  let playing = false;

  $: animate = step === undefined;
  $: width = $viewport.width;
  $: height = $viewport.height;
  $: canvasWidth = width * dpr;
  $: canvasHeight = height * dpr;
  $: pixelGap = dpr;

  $: canvasWidth, canvasHeight, setPixels();

  const setPixels = async () => {
    if (ctx) {
      initPixels();
      initColoredPixels();
      await tick();
    }
  };
  const mouseMove = (e) => {
    mousePosition = { x: e.clientX * dpr, y: e.clientY * dpr };
  };
  const randBetween = (min, max) => Math.random() * (max - min) + min;

  let pixels = [];
  const initPixels = () => {
    pixels = [];
    for (var y = 0; y < canvasHeight / size; y++) {
      for (var x = 0; x < canvasWidth / size; x++) {
        pixels.push([x * size, y * size, size - pixelGap, size - pixelGap, "#222", 1]);
      }
    }
  };

  let coloredPixels = [];
  let colors = [
    baseColors.base["red"],
    baseColors.base["green-1"],
    baseColors.base["blue-1"],
    baseColors.base["tan-1"],
    baseColors.base["orange-1"]
  ];
  const initColoredPixels = () => {
    coloredPixels = [];
    for (var i = 0; i < pixelsToLaunch; i++) {
      coloredPixels.push({
        x: canvasWidth / 2,
        y: canvasHeight / 2,
        alpha: 0,
        color: colors[i % 5],
        vx: randBetween(-pixelSpreadSpeed, pixelSpreadSpeed),
        vy: randBetween(-pixelSpreadSpeed, pixelSpreadSpeed)
      });
    }
  };

  const drawLoop = () => {
    playing = true;
    launchPixel();
    render();
    if (animate) requestAnimationFrame(drawLoop);
    else {
      playing = false;
      resetGrid();
    }
  };

  const resetGrid = async () => {
    await setPixels();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (var i = 0, l = pixels.length; i < l; i++) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = baseColors.base["purple-1"];
      ctx.fillRect(pixels[i][0], pixels[i][1], pixels[i][2], pixels[i][3]);
    }
  };

  const launchPixel = () => {
    coloredPixels[currentPixel].x = mousePosition.x;
    coloredPixels[currentPixel].y = mousePosition.y;
    coloredPixels[currentPixel].alpha = 1;

    currentPixel++;
    if (currentPixel > pixelsToLaunch - 1) currentPixel = 0;
  };

  const render = () => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // reset all color
    for (var i = 0, l = pixels.length; i < l; i++) {
      pixels[i][4] = 0;
    }

    // set a color/alpha on a certain # of pixels
    for (var i = 0, l = coloredPixels.length; i < l; i++) {
      // find pixel index that corresponds with mousePosition
      var pixelIndex =
        Math.floor(coloredPixels[i].y / size) * (Math.floor(canvasWidth / size) + 1) +
        Math.floor(coloredPixels[i].x / size);

      // set its color and alpha 0 -> 1
      if (pixels[pixelIndex]) {
        pixels[pixelIndex][4] = coloredPixels[i].color;
        pixels[pixelIndex][5] = coloredPixels[i].alpha;
      }

      // slowly fade it out
      if (coloredPixels[i].alpha > 0) coloredPixels[i].alpha -= fadeSpeed;
      if (coloredPixels[i].alpha < 0) coloredPixels[i].alpha = 0;
      // move the x/y slightly, so next time we'll get a new pixelIndex
      coloredPixels[i].x += coloredPixels[i].vx;
      coloredPixels[i].y += coloredPixels[i].vy;
    }

    for (var i = 0, l = pixels.length; i < l; i++) {
      // draw a purple background pixel
      ctx.globalAlpha = 1;
      ctx.fillStyle = baseColors.base["purple-1"];
      ctx.fillRect(pixels[i][0], pixels[i][1], pixels[i][2], pixels[i][3]);

      // draw a colored pixel
      if (pixels[i][5] > 0) {
        ctx.globalAlpha = pixels[i][5];
        ctx.fillStyle = pixels[i][4];
        ctx.fillRect(pixels[i][0], pixels[i][1], pixels[i][2], pixels[i][3]);
      }
    }
  };

  onMount(() => {
    dpr = window.devicePixelRatio;
    ctx = canvas.getContext("2d");
    mousePosition = { x: $viewport.width - 100, y: 100 };
    setPixels();
  });

  afterUpdate(async () => {
    if (animate && !playing) {
      drawLoop();
    } else {
      await resetGrid();
    }
  });
</script>

<div class="overlay" style="width: {width}px; height: {height}px;" on:mousemove={mouseMove} />
<canvas
  bind:this={canvas}
  style="width: {width}px; height: {height}px;"
  width={canvasWidth}
  height={canvasHeight}
  transition:fade
/>

<style>
  canvas {
    position: fixed;
    background: var(--base-purple-0);
    top: 0;
    left: 0;
    pointer-events: auto;
    z-index: -1;
  }
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
  }
</style>
