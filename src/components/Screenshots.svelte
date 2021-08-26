<script>
  import { fly } from "svelte/transition";

  let visible = false;
  const onClick = () => {
    visible = true;
  };
</script>

<button on:click={onClick}>start</button>
{#if visible}
  {#each [1, 2, 3, 4] as i}
    <img
      src={`assets/img/screenshot${i}.png`}
      alt="screenshot of lenna"
      in:fly={{ y: 200, duration: 2000, delay: i * 150 }}
    />
  {/each}
{/if}

<style>
  img {
    width: 40%;
    top: 20%;
    border: 2px solid blueviolet;
    position: absolute;
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
