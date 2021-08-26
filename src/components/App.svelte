<script>
  import { onMount } from "svelte";
  import Footer from "$components/Footer.svelte";
  import loadPixels from "$utils/loadPixels.js";
  import Canvas from "./Canvas.svelte";
  import Screenshots from "./Screenshots.svelte";

  // let pixels;

  // onMount(async () => {
  //   pixels = await loadPixels("assets/img/lenna-84.png");
  // });
</script>

<Screenshots />

<!-- {#if pixels}
  <Canvas {pixels} />
{/if} -->
