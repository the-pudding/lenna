<script>
  import _ from "lodash";
  import { onMount, tick } from "svelte";
  import viewport from "$stores/viewport";

  export let step;
  export let pixels;
  $: pixelsCopy = _.cloneDeep(pixels);

  $: visible = step === 3;
  let leaving = false;

  let canvas;
  let ctx;
  let dpr = 1;
  let frames = 0;
  let currentFrame = 0;

  $: yOffset = canvasHeight / 2 - (imageSizePixels * pixelSize) / 2;
  $: xOffset = $viewport.width > 900 ? 200 * dpr : 80 * dpr;
  $: imageSizePixels = Math.sqrt(pixelsCopy.length);
  $: width = $viewport.width;
  $: height = $viewport.height;
  $: canvasWidth = width * dpr;
  $: canvasHeight = height * dpr;
  $: pixelSize =
    $viewport.width > 900
      ? Math.floor((canvasWidth / imageSizePixels) * 0.4)
      : Math.floor((canvasWidth / imageSizePixels) * 0.66);

  $: canvasWidth, canvasHeight, face(); // redraw on resize
  $: if (visible) fadeIn(); // fade whenever it enters
  $: if (step === 4) {
    leaving = true;
    fadeOut();
  }

  const render = () => {
    if (ready) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      pixelsCopy.forEach(({ r, g, b, a, x, y, w, h }) => {
        ctx.fillStyle = `rgb(${r.value}, ${g.value}, ${b.value}, ${a.value})`;
        ctx.fillRect(x.value + xOffset, y.value + yOffset, w.value * dpr, h.value * dpr);
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

    pixelsCopy
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
      pixelsCopy.forEach((d) => {
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
      pixelsCopy.forEach((d) => {
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
      pixelsCopy.forEach((d) => {
        d.a = { origin: 1, target: 1, value: undefined };
        d.x = { origin: d.imageX * pixelSize, target: d.imageX * pixelSize, value: undefined };
        d.y = { origin: d.imageY * pixelSize, target: d.imageY * pixelSize, value: undefined };
        d.w = { origin: pixelSize, target: pixelSize, value: undefined };
        d.h = { origin: pixelSize, target: pixelSize, value: undefined };
        d.r = { origin: d.r.origin, target: d.r.origin, value: undefined };
        d.g = { origin: d.g.origin, target: d.g.origin, value: undefined };
        d.b = { origin: d.b.origin, target: d.b.origin, value: undefined };
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

    pixelsCopy.forEach((d) => {
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
