<script>
  export let pixelSize;
  export let step;

  // todo: fade in, not visible all the time

  $: visible = step >= 4;
</script>

<img src={`assets/img/playboy.png`} alt="playboy" class:visible />

<style>
  img {
    position: absolute;
    top: 200px;
    left: 200px;
    border: 7px solid var(--base-green-2);
    height: 0px;
    transition: height 2s, width 2s;
  }
  .visible {
    display: block;
    height: 375px;
  }
</style>
