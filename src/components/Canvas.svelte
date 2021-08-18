<script>
	import { onMount } from 'svelte';
    import viewport from '$stores/viewport.js';
	import _ from 'lodash';

    export let pixels = [];
    
	let canvas;
	let ctx;
    let dpr = 1;
	let speed = 0.1;
	let acceleration = 0.002;
	const imageSize = Math.sqrt(pixels.length);

	$: console.log(pixels)

	$: unitSize = Math.floor(Math.min($viewport.width, $viewport.height) / imageSize);
  	$: canvasWidth = $viewport.width * dpr;
	$: canvasHeight = $viewport.height * dpr;
	

	const renderAll = () => {
        pixels.forEach(({x, y, rgb }) => {
            ctx.fillStyle = rgb;
            ctx.fillRect(x * unitSize, y * unitSize, unitSize, unitSize);
        })
	    render();
	};

	const updateList = _.times(30, _.random.bind(0, imageSize**2 - 1));
	const shouldUpdate = pixel => updateList.includes(pixel.i);

	const render = () => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // re-draw
		// fade out
		ctx.globalAlpha -= 0.02;
		pixels.filter(p => !shouldUpdate(p)).forEach((pixel) => {
			// pixel.a -= 0.1;
			// ctx.fillStyle = `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a})`
			ctx.fillStyle = pixel.rgb;
            ctx.fillRect(pixel.x * unitSize, pixel.y * unitSize, unitSize, unitSize);
        })

        // move
        pixels.filter(p => shouldUpdate(p)).forEach((pixel) => {
			pixel.y += speed;
			speed += acceleration;
          	ctx.fillRect(pixel.x * unitSize, pixel.y * unitSize, unitSize, unitSize);
        })

		window.requestAnimationFrame(render);
	};

	onMount(() => {
		ctx = canvas.getContext('2d');
		dpr = window.devicePixelRatio;
		renderAll();
	});
	
</script>

<canvas bind:this={canvas} style="width: {$viewport.width}px; height: {$viewport.height}px;" width={canvasWidth} height={canvasHeight}/>

<style>
	canvas {
		display: block;
		position: fixed;
		top: 0;
		left: 0;
	}
</style>