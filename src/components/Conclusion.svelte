<script>
  import copy from "$data/doc.json";
</script>

<div>
  {#each copy["post-prose"] as paragraph}
    <p>{@html paragraph.value}</p>
  {/each}
</div>

<style>
  p {
    color: var(--base-tan-4);
    max-width: 560px;
  }

  div {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 100px;
    margin-bottom: 100px;
  }
</style>
