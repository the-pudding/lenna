<script>
  import viewport from "$stores/viewport";
  import { onMount, tick } from "svelte";

  export let step;

  let visible = true;
  $: if (step !== undefined) visible = false;
  $: if (step === undefined) visible = true;

  let canvas;
  let ctx;
  let dpr = 1;
  let mousePosition;
  let currentPixel = 0;

  const mouseMove = (e) => {
    mousePosition = { x: e.clientX * dpr, y: e.clientY * dpr - 200 };
  };

  $: width = $viewport.width;
  $: height = $viewport.height;
  $: canvasWidth = width * dpr;
  $: canvasHeight = height * dpr;
  const size = 20;

  $: canvasWidth, canvasHeight, update();

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
    for (var i = 0; i < 300; i++) {
      coloredPixels.push({
        x: canvasWidth / 2,
        y: canvasHeight / 2,
        alpha: 0,
        color: colors[i % 5],
        vx: -1 + Math.random() * 2,
        vy: -1 + Math.random() * 2
      });
    }
  };

  const draw = () => {
    launchPixel();
    launchPixel();
    drawGrid();
    requestAnimationFrame(draw);
  };

  const launchPixel = () => {
    coloredPixels[currentPixel].x = mousePosition.x;
    coloredPixels[currentPixel].y = mousePosition.y;
    coloredPixels[currentPixel].alpha = 1;

    currentPixel++;
    if (currentPixel > 299) currentPixel = 0;
  };

  const drawGrid = () => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (var i = 0, l = pixels.length; i < l; i++) {
      pixels[i][4] = 0;
    }

    for (var i = 0, l = coloredPixels.length; i < l; i++) {
      var pix =
        Math.floor(coloredPixels[i].y / size) * (Math.floor(canvasWidth / size) + 1) +
        Math.floor(coloredPixels[i].x / size);
      if (pixels[pix]) {
        pixels[pix][4] = coloredPixels[i].color;
        pixels[pix][5] = coloredPixels[i].alpha;
      }

      if (coloredPixels[i].alpha > 0) coloredPixels[i].alpha -= 0.008;
      if (coloredPixels[i].alpha < 0) coloredPixels[i].alpha = 0;
      coloredPixels[i].x += coloredPixels[i].vx;
      coloredPixels[i].y += coloredPixels[i].vy;
    }

    for (var i = 0, l = pixels.length; i < l; i++) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#222";
      ctx.fillRect(pixels[i][0], pixels[i][1], pixels[i][2], pixels[i][3]);
      ctx.globalAlpha = pixels[i][5];
      ctx.fillStyle = pixels[i][4];
      ctx.fillRect(pixels[i][0], pixels[i][1], pixels[i][2], pixels[i][3]);
    }
  };

  const onClick = () => {
    draw();
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
<canvas
  bind:this={canvas}
  class:visible
  style="width: {width}px; height: {height}px;"
  width={canvasWidth}
  height={canvasHeight}
  on:mousemove={mouseMove}
/>

<style>
  canvas {
    background: #101010;
    display: none;
    position: fixed;
    top: 100px;
    left: 0;
  }
  .visible {
    display: block;
  }
  button {
    position: absolute;
    z-index: 1000;
    top: 20px;
  }
</style>
