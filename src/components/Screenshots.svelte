<script>
  import baseColors from "../../properties/colors/base.json";
  import { fade } from "svelte/transition";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  export let step;
  export let type;
  export let enter;
  export let pixels = [];

  $: console.log({ pixels });

  const delay = 500;

  $: visible = step === enter;

  const size = tweened(0, { duration: 1000, easing: cubicOut, delay });

  // when it comes into view
  $: if (visible && $size !== 200) {
    size.set(200);
  }
  // when it leaves view
  $: if (!visible) {
    size.set(0);
  }

  const colors = [
    baseColors.base["green-2"].value,
    baseColors.base["orange-1"].value,
    baseColors.base["red"].value,
    baseColors.base["blue-1"].value,
    baseColors.base["tan-1"].value
  ];
  const names =
    type === "internet"
      ? ["Grumpy cat", "These are all cakes", "Disaster girl", "Bernie's mittens", "Oregon Trail"]
      : ["Lenna 1", "Lenna 2", "Lenna 3", "Lenna 4", "Lenna 5"];
</script>

<div class="images">
  {#each [...new Array(5).keys()] as i}
    <div class="img-group">
      {#if visible}
        <div class="label" transition:fade={{ delay }}>{names[i]}</div>
      {/if}
      <img
        src={`assets/img/${type}-screenshots/pic${i + 1}.png`}
        alt={type === "internet" ? `${names[i]} meme` : "screenshot of lenna"}
        style={`height: ${$size}px; width: ${$size}px; border: ${
          visible ? `7px solid ${colors[i]}` : ""
        }`}
      />
    </div>
  {/each}
</div>

<style>
  .img-group {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .label {
    font-size: 16px;
    line-height: 32px;
  }
  img {
    height: 0px;
    width: 0px;
  }
  .img-group:nth-child(1) {
    left: 10%;
    top: 10%;
  }
  .img-group:nth-child(2) {
    left: 45%;
    top: 5%;
  }
  .img-group:nth-child(3) {
    left: 30%;
    top: 40%;
  }
  .img-group:nth-child(4) {
    left: 4%;
    top: 65%;
  }
  .img-group:nth-child(5) {
    left: 55%;
    top: 70%;
  }
</style>
