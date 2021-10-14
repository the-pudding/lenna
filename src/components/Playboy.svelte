<script>
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  export let step;
  export let playboyDestination;

  const opacity = tweened(0, { duration: 2000, easing: cubicOut });

  $: visible = step === 4;
  $: shrinking = step === 5;

  $: if (visible && $opacity === 0) {
    opacity.set(1);
  }
  $: if (!visible && $opacity === 1) {
    opacity.set(0);
  }
</script>

<img
  src={`assets/img/playboy.png`}
  alt="playboy"
  class:big={visible && !shrinking}
  style={`opacity: ${$opacity}; transform: translate(${shrinking ? playboyDestination.x : 200}px, ${
    shrinking ? playboyDestination.y - 14 : 200
  }px)`}
/>

<style>
  img {
    position: absolute;
    border: 7px solid var(--base-green-2);
    height: 0px;
    transition: height 2s, width 2s, transform 2s;
  }
  .big {
    height: 375px;
  }
</style>
