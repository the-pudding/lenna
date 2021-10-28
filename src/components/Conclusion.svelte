<script>
  import copy from "$data/doc.json";
</script>

<div class="conclusion">
  {#each copy.postProse as paragraph}
    <p>{@html paragraph.value}</p>
  {/each}

  <h3>{copy.readingHeader}</h3>

  {#each copy.readingLists as list}
    <p class="list-header">{@html list.header}</p>
    <ul>
      {#each list.links as link}
      <li>{@html link.value}</li>
      {/each}
    </ul>
  {/each}

  <h3 id="methods">Methods & Notes</h3>
  {#each copy.methods as paragraph}
    <p class="methods">{@html paragraph.value}</p>
  {/each}
</div>


<style>
  .conclusion {
    max-width: 620px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  p,
  ul,
  h3 {
    color: var(--base-tan-4);
    width: 100%;
    font-size: 18px;
    line-height: 1.65;
    text-align: left;
  }

  .list-header {
    color: var(--chart-text);
    font-family: var(--mono);
    font-size: 16px;
  }

  h3 {
    width: 100%;
    text-align: left;
    font-family: var(--mono);
    text-transform: uppercase;
    font-size: 28px;
    border-top: 1px solid var(--base-purple-3);
    margin-top: 4rem;
  }

  ul {
    margin-bottom: 3rem;
    list-style: none;
  }

  li {
    font-size: 18px;
  }

  li::before {
    content: "";  
    background: var(--base-green-2); 
    display: inline-block; 
    width: 0.5rem; 
    height: 0.5rem;
    margin: 0 0.5rem 0.125rem -1rem; 
  }

  div {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 100px;
    margin-bottom: 100px;
  }

  .methods {
    font-size: 14px;
  }

  :global(.conclusion a) {
    text-decoration: none;
    border-bottom: 1px solid var(--chart-text);
  }

  :global(.conclusion a:hover) {
    border-bottom: 2px solid var(--base-green-2);
  }

  @media only screen and (max-width: 700px) {
    p, ul, li {
      font-size: 16px;
    }

    li::before {
      margin: 0 0.5rem 0.125rem 0rem; 
    }
  }
</style>
