<script>
  import { onMount, tick } from "svelte";
  import viewport from "$stores/viewport";

  export let step;
  export let pixels;

  $: visible = step === 3;
  let leaving = false;

  let canvas;
  let ctx;
  let dpr = 1;
  let frames = 0;
  let currentFrame = 0;
  $: offset = 200 * dpr;

  $: imageSizePixels = Math.sqrt(pixels.length);
  $: width = $viewport.width;
  $: height = $viewport.height;
  $: canvasWidth = width * dpr;
  $: canvasHeight = height * dpr;
  $: pixelSize = Math.floor((canvasWidth / imageSizePixels) * 0.33);

  $: console.log({ dpr, canvasWidth, width, imageSizePixels, pixelSize });

  $: canvasWidth, canvasHeight, face(); // redraw on resize
  $: if (visible) fadeIn(); // fade whenever it enters
  $: if (step === 4) {
    leaving = true;
    fadeOut();
  }

  const render = () => {
    if (ctx) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      pixels.forEach(({ r, g, b, a, x, y, w, h }) => {
        ctx.fillStyle = `rgb(${r.value}, ${g.value}, ${b.value}, ${a.value})`;
        ctx.fillRect(x.value + offset, y.value + offset, w.value * dpr, h.value * dpr);
      });
    }
  };

  const interpolate = (pixel, t) => {
    const { origin, target, ease } = pixel;
    const int = d3.interpolateNumber(origin, target);
    pixel.value = ease ? int(ease(t)) : int(t);
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
    if (t < 1) window.requestAnimationFrame(frameTick);
    if (t === 1) leaving = false;
  };

  const fadeIn = () => {
    if (ready) {
      pixels.forEach((d) => {
        d.animate = ["x", "y", "w", "h", "r", "g", "b", "a"];
        d.a = { origin: 0, target: 1, value: undefined };
        d.animate
          .filter((field) => field !== "a")
          .forEach((field) => {
            d[field].target = d[field].origin;
          });
      });
      frames = 60;
      currentFrame = 0;
      frameTick();
    }
  };

  const fadeOut = () => {
    if (ready) {
      pixels.forEach((d) => {
        d.animate = ["x", "y", "w", "h", "r", "g", "b", "a"];
        d.a = { origin: d.a.value, target: 0, value: undefined };
        d.animate
          .filter((field) => field !== "a")
          .forEach((field) => {
            d[field].target = d[field].origin;
          });
      });
      frames = 60;
      currentFrame = 0;
      frameTick();
    }
  };

  const face = () => {
    if (ready) {
      pixels.forEach((d) => {
        d.animate = ["x", "y", "w", "h", "r", "g", "b", "a"];
        d.a = { origin: 1, target: 1, value: undefined };
        d.animate
          .filter((field) => field !== "a")
          .forEach((field) => {
            d[field].target = d[field].origin;
          });
      });
      frames = 1;
      currentFrame = 0;
      frameTick();
    }
  };

  let ready = false;
  onMount(async () => {
    dpr = window.devicePixelRatio;
    ctx = canvas.getContext("2d");

    await tick();

    pixels.forEach((d) => {
      d.imageX = d.x;
      d.imageY = d.y;

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

    ready = true;
    fadeIn();
  });
</script>

<canvas
  bind:this={canvas}
  style="width: {width}px; height: {height}px;"
  width={canvasWidth}
  height={canvasHeight}
  class:visible={visible || leaving}
/>

<style>
  canvas {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
  }
  .visible {
    display: block;
  }
</style>
