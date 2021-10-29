<script>
  import { onMount, tick } from "svelte";
  import baseColors from "$data/variables.json";
  import { formatData, getYearRange } from "$utils/bubbleChart";
  import viewport from "$stores/viewport";

  export let step;

  $: mounted = false;
  $: visible = step >= 9;

  const colors = [
    baseColors.base["green-2"],
    baseColors.base["blue-2"],
    baseColors.base["orange-1"],
    baseColors.base["tan-3"]
  ];

  const margin = { left: 0, right: 0, top: 100, bottom: 100 };
  $: width = $viewport.width;
  $: height = $viewport.height;
  $: chartHeight = height - margin.top - margin.bottom;
  $: chartWidth = width - margin.left - margin.right;

  $: yearRange = getYearRange(step);
  $: data = yearRange && yearRange.length ? formatData(yearRange[0], yearRange[1]) : {};

  $: width, height, data, updateNodes();

  let pack;
  let nodes;
  let simulation;
  const updateNodes = async () => {
    await tick();

    if (mounted) {
      pack = () =>
        d3.pack().size([chartWidth, chartHeight]).padding(1)(
          d3.hierarchy(data).sum((d) => d.value)
        );
      nodes = pack().leaves();
      simulation = d3
        .forceSimulation(nodes)
        .force("x", d3.forceX(chartWidth / 2).strength(0.01))
        .force("y", d3.forceY(chartWidth / 2).strength(0.01))
        .force("cluster", forceCluster())
        .force("collide", forceCollide());
    }
  };

  onMount(async () => {
    mounted = true;
    await updateNodes();
  });

  function forceCollide() {
    const alpha = 0.4; // fixed for greater rigidity!
    const padding1 = 2; // separation between same-color nodes
    const padding2 = 6; // separation between different-color nodes
    let nodes;
    let maxRadius;

    function force() {
      const quadtree = d3.quadtree(
        nodes,
        (d) => d.x,
        (d) => d.y
      );
      for (const d of nodes) {
        const r = d.r + maxRadius;
        const nx1 = d.x - r,
          ny1 = d.y - r;
        const nx2 = d.x + r,
          ny2 = d.y + r;
        quadtree.visit((q, x1, y1, x2, y2) => {
          if (!q.length)
            do {
              if (q.data !== d) {
                const r =
                  d.r + q.data.r + (d.data.group === q.data.data.group ? padding1 : padding2);
                let x = d.x - q.data.x,
                  y = d.y - q.data.y,
                  l = Math.hypot(x, y);
                if (l < r) {
                  l = ((l - r) / l) * alpha;
                  (d.x -= x *= l), (d.y -= y *= l);
                  (q.data.x += x), (q.data.y += y);
                }
              }
            } while ((q = q.next));
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      }
    }

    force.initialize = (_) =>
      (maxRadius = d3.max((nodes = _), (d) => d.r) + Math.max(padding1, padding2));

    return force;
  }

  function centroid(nodes) {
    let x = 0;
    let y = 0;
    let z = 0;
    for (const d of nodes) {
      let k = d.r ** 2;
      x += d.x * k;
      y += d.y * k;
      z += k;
    }
    return { x: x / z, y: y / z };
  }

  function forceCluster() {
    const strength = 0.2;
    let nodes;

    function force(alpha) {
      const centroids = d3.rollup(nodes, centroid, (d) => d.data.group);
      const l = alpha * strength;
      for (const d of nodes) {
        const { x: cx, y: cy } = centroids.get(d.data.group);
        d.vx -= (d.x - cx) * l;
        d.vy -= (d.y - cy) * l;
      }
    }

    force.initialize = (_) => (nodes = _);

    return force;
  }
</script>

<svg {width} {height} class:visible>
  {#if nodes && nodes.length > 0}
    <g style={`transform: translate(${margin.left}px, ${margin.top}px)`}>
      {#each nodes as d}
        <rect x={d.x} y={d.y} height={d.r} width={d.r} fill={colors[d.data.group]} />
      {/each}
    </g>
  {/if}
</svg>

<style>
  .visible {
    display: block;
  }
  svg {
    display: none;
  }
  rect {
    stroke: none;
  }
</style>
