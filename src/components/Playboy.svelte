<script>
  // not in use
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import viewport from "$stores/viewport";
  import { pixelSize } from "$stores/misc";

  export let step;
  export let playboyDestination;

  const opacity = tweened(0, { duration: 2000, easing: cubicOut });

  $: shrinking = step === 5;
  $: visible = step === 5;

  // $: if (visible && $opacity === 0) {
  //   opacity.set(1);
  // }
  // $: if (!visible && $opacity === 1) {
  //   opacity.set(0);
  // }
</script>

<div
  style={`transform: translate(${shrinking ? playboyDestination.x : $viewport.width * 0.3}px, ${
    shrinking ? playboyDestination.y - 14 : $viewport.height * 0.5
  }px); height: ${shrinking ? playboyDestination.h : $pixelSize}px; width: ${
    shrinking ? playboyDestination.w : $pixelSize
  }px`}
  class:hidden-delayed={shrinking}
  class:hidden-behind={step !== 5}
/>

<style>
  div {
    background: var(--base-tan-2);
    transition: opacity 2s, transform 2s;
  }

  .hidden-delayed {
    opacity: 0;
    transition: opacity 2s 2s, transform 2s;
    visibility: visible;
  }
  .hidden-behind {
    opacity: 1;
    visibility: hidden;
  }
</style>
