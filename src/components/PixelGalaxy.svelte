<script>
  import viewport from "$stores/viewport";
  import { onMount, tick } from "svelte";
  import baseColors from "../../properties/colors/base.json";
  import { fade } from "svelte/transition";

  const size = 20;
  const pixelsToLaunch = 100;
  const pixelSpreadSpeed = 2;

  let canvas;
  let ctx;
  let dpr = 1;
  let mousePosition;
  let currentPixel = 0;
  $: width = $viewport.width;
  $: height = $viewport.height;
  $: canvasWidth = width * dpr;
  $: canvasHeight = height * dpr;

  $: canvasWidth, canvasHeight, update();

  const mouseMove = (e) => {
    mousePosition = { x: e.clientX * dpr, y: e.clientY * dpr };
  };
  const randBetween = (min, max) => Math.random() * (max - min) + min;

  const update = async () => {
    if (ctx) {
      initPixels();
      initColoredPixels();
      await tick();
    }
  };

  let pixels = [];
  const initPixels = () => {
    pixels = [];
    for (var y = 0; y < canvasHeight / size; y++) {
      for (var x = 0; x < canvasWidth / size; x++) {
        pixels.push([x * size, y * size, size - 2, size - 2, "#222", 1]);
      }
    }
  };

  let coloredPixels = [];
  let colors = [
    baseColors.base["red"].value,
    baseColors.base["green-1"].value,
    baseColors.base["blue-1"].value,
    baseColors.base["tan-1"].value,
    baseColors.base["orange-1"].value
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

  const draw = () => {
    launchPixel();
    drawGrid();
    requestAnimationFrame(draw);
  };

  const launchPixel = () => {
    coloredPixels[currentPixel].x = mousePosition.x;
    coloredPixels[currentPixel].y = mousePosition.y;
    coloredPixels[currentPixel].alpha = 1;

    currentPixel++;
    if (currentPixel > pixelsToLaunch - 1) currentPixel = 0;
  };

  // 0, 1 - x, y
  // 2, 3 - w, h
  // 4 - color
  // 5 - alpha
  const drawGrid = () => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (var i = 0, l = pixels.length; i < l; i++) {
      pixels[i][4] = 0;
    }

    for (var i = 0, l = coloredPixels.length; i < l; i++) {
      var pixelIndex =
        Math.floor(coloredPixels[i].y / size) * (Math.floor(canvasWidth / size) + 1) +
        Math.floor(coloredPixels[i].x / size);
      if (pixels[pixelIndex]) {
        pixels[pixelIndex][4] = coloredPixels[i].color;
        pixels[pixelIndex][5] = coloredPixels[i].alpha;
      }

      if (coloredPixels[i].alpha > 0) coloredPixels[i].alpha -= 0.008;
      if (coloredPixels[i].alpha < 0) coloredPixels[i].alpha = 0;
      coloredPixels[i].x += coloredPixels[i].vx;
      coloredPixels[i].y += coloredPixels[i].vy;
    }

    for (var i = 0, l = pixels.length; i < l; i++) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = baseColors.base["purple-1"].value;
      ctx.fillRect(pixels[i][0], pixels[i][1], pixels[i][2], pixels[i][3]);
      ctx.globalAlpha = pixels[i][5];
      ctx.fillStyle = pixels[i][4];
      ctx.fillRect(pixels[i][0], pixels[i][1], pixels[i][2], pixels[i][3]);
    }
  };

  onMount(() => {
    dpr = window.devicePixelRatio;
    ctx = canvas.getContext("2d");
    mousePosition = { x: $viewport.width, y: 0 };
    update();
    draw();
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
