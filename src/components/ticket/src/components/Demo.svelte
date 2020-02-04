<!-- Swiper -->
  <div bind:this={swiper} class="swiper-container">
    <div class="swiper-wrapper">
		<div class="swiper-slide"><Window /></div>
		<div class="swiper-slide"><Window /></div>
		<div class="swiper-slide"><Window /></div>
		<div class="swiper-slide"><Window /></div>
		<div class="swiper-slide"><Window /></div>
		<div class="swiper-slide"><Window /></div>
		<div class="swiper-slide"><Window /></div>
		<div class="swiper-slide"><Window /></div>
		<div class="swiper-slide"><Window /></div>
		<div class="swiper-slide"><Window /></div>
    </div>
    <!-- Add Pagination -->
    <div class="swiper-pagination"></div>
  </div>


  <script>
	import Swiper from "swiper";
	import Window from "../Window.svelte";
	import {onMount} from "svelte";

	let swiper;
	let controller;
	onMount(() => {
		controller = new Swiper(swiper, {
			effect: 'cube',
			grabCursor: true,
			cubeEffect: {
				shadow: true,
				slideShadows: true,
				shadowOffset: 20,
				shadowScale: 0.94,
			},
			pagination: {
				el: '.swiper-pagination',
			},
			});
	});
  </script>

  <style>
	 .swiper-container {
      width: 100%;
      height: 100vh;
    }
    .swiper-slide {
      text-align: center;
      font-size: 18px;
     

      /* Center slide text vertically */
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
    }
  </style>