<script>
  import viewport from "$stores/viewport";
  import { onMount, tick } from "svelte";
  import { fade } from "svelte/transition";

  export let step;

  let visible = true;
  $: if (step !== undefined) visible = false;
  $: if (step === undefined) visible = true;

  const size = 20;
  const pixelsToLaunch = 200;
  const pixelSpreadSpeed = 10;

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
    mousePosition = { x: e.clientX * dpr, y: e.clientY * dpr - 200 };
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
  let colors = ["#540045", "#C60052", "#FF714B", "#EAFF87", "#ACFFE9"];
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

  const draw = (centroid) => {
    //launchPixel();
    launchPixel(centroid);
    drawGrid();
    requestAnimationFrame(() => draw(centroid));
  };

  const launchPixel = (centroid) => {
    // coloredPixels[currentPixel].x = mousePosition.x;
    // coloredPixels[currentPixel].y = mousePosition.y;

    coloredPixels[currentPixel].x = centroid.x;
    coloredPixels[currentPixel].y = centroid.y;
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
      ctx.fillStyle = "#101010";
      ctx.fillRect(pixels[i][0], pixels[i][1], pixels[i][2], pixels[i][3]);
      ctx.globalAlpha = pixels[i][5];
      ctx.fillStyle = pixels[i][4];
      ctx.fillRect(pixels[i][0], pixels[i][1], pixels[i][2], pixels[i][3]);
    }
  };

  const onClick = () => {
    const centroids = [
      { x: canvasWidth * 0.25, y: canvasHeight * 0.25 },
      //{ x: canvasWidth * 0.75, y: canvasHeight * 0.25 },
      { x: canvasWidth * 0.75, y: canvasHeight * 0.75 }
      //{ x: canvasWidth * 0.25, y: canvasHeight * 0.75 }
    ];
    centroids.forEach((c) => {
      draw(c);
    });
  };

  onMount(() => {
    dpr = window.devicePixelRatio;
    ctx = canvas.getContext("2d");
    mousePosition = { x: $viewport.width / 2, y: $viewport.height / 2 };
    update();
    // draw();
  });
</script>

<button on:click={onClick}>start galaxy</button>
<h1>Lenna</h1>
{#if visible}
  <canvas
    bind:this={canvas}
    style="width: {width}px; height: {height}px;"
    width={canvasWidth}
    height={canvasHeight}
    on:mousemove={mouseMove}
    out:fade
  />
{/if}

<style>
  canvas {
    background: #101010;
    position: fixed;
    top: 100px;
    left: 0;
  }
  button {
    position: absolute;
    z-index: 1000;
    top: 20px;
  }
  h1 {
    position: absolute;
    z-index: 1000;
    color: white;
    left: 42.5%;
    font-size: 5em;
  }
</style>
