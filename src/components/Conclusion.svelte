<script>
  import copy from "$data/doc.json";
</script>

<div>
  {#each copy["post-prose"] as paragraph}
    <p>{@html paragraph.value}</p>
  {/each}
  <ul>
    {#each copy["post-prose-bullets"] as bullet}
      <li>{bullet.value}</li>
    {/each}
  </ul>
</div>

<style>
  p,
  ul {
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
