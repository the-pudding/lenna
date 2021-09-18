<script>
  export let title;
  export let subtitle;
  export let bylines;
</script>

<div class="hero">
  <h1>{title.toUpperCase()}</h1>
  <h2>{subtitle.toUpperCase()}</h2>
  <div class="authors">
    <div>By <a href={bylines[0].url}>{bylines[0].author}</a></div>
    <div>
      with <a href={bylines[1].url}>{bylines[1].author}</a> and
      <a href={bylines[2].url}>{bylines[2].author}</a>
    </div>
  </div>
</div>

<style>
  .hero {
    height: 90vh;
  }

  h1,
  h2,
  .authors {
    color: var(--color-light);
    margin-left: 110px;
    font-family: var(--mono);
  }

  h1 {
    font-size: 150px;
    width: 400px;
    line-height: 150px;
  }

  h2 {
    font-size: 40px;
    line-height: 45px;
    width: 700px;
  }

  .authors {
    margin-top: 60px;
  }
</style>
