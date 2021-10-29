<script>
  export let title = "Can Data Die? Tracking the Lenna Image";
  export let description =
    "Why one of the Internet’s oldest images lives on without its subject’s consent";
  export let url = "https://pudding.cool/2021/10/lenna";
</script>

<svelte:head>
  <title>{title}</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="description" content={description} />
  <meta name="author" content="The Pudding" />
  <meta name="news_keywords" content="" />

  <meta property="og:title" content={title} />
  <meta property="og:site_name" content="The Pudding" />
  <meta property="og:url" content={url} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="en_US" />

  <meta property="og:image" content="{url}/assets/img/social/social-facebook.jpg" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="600" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="https://pudding.cool" />
  <meta name="twitter:creator" content="@puddingviz" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image:src" content="{url}/assets/img/social/social-twitter.jpg" />

  <meta name="robots" content="max-image-preview:large" />

  <link rel="canonical" href="{url}/" />
</svelte:head>
