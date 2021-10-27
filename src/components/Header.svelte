<script>
  import wordmark from "$svg/wordmark.svg";
</script>

<header>
  <div class="wordmark">
    <a href="https://pudding.cool" aria-label="The Pudding">{@html wordmark}</a>
  </div>
</header>

<style>
  header {
    position: relative;
    z-index: 1000;
  }

  .wordmark {
    max-width: 10em;
    margin: 0 auto;
    padding: 1em 0 0 0;
  }

  .wordmark a {
    border: none;
    color: var(--color-body);
  }

  .wordmark a:hover {
    background-color: transparent;
  }

  :global(.wordmark svg path) {
    fill: var(--color-body-light);
  }
</style>
