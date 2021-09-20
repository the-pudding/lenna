<script>
  import { fly } from "svelte/transition";

  export let step;
  export let pixels;
</script>

<div class="images">
  {#each [1, 2, 3, 4] as i}
    <img
      src={`assets/img/screenshot${i}.png`}
      alt="lenna screenshot"
      in:fly={{ y: 200, duration: 2000, delay: i * 150 }}
      style={`transform: translate(${pixels[i - 1].x.value}px, ${
        pixels[i - 1].y.value
      }px); height: ${pixels[0].h.value}px; width: ${pixels[0].w.value}px; border: none; left: 0`}
    />
  {/each}
</div>

<style>
  .images {
    position: sticky;
    top: 0;
  }
  img {
    width: 40%;
    height: 40%;
    top: 200px;
    border: 2px solid black;
    position: absolute;
    transition: height 1s, width 1s, transform 1s 1s, left 1s 1s;
  }
  img:nth-child(1) {
    left: 10%;
    transform: rotate(3deg);
  }
  img:nth-child(2) {
    left: 30%;
    transform: rotate(-3deg);
  }
  img:nth-child(3) {
    left: 50%;
    transform: rotate(3deg);
  }
  img:nth-child(4) {
    left: 70%;
    transform: rotate(-3deg);
  }
</style>
