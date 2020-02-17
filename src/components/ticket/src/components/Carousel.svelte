<!-- Swiper -->
  <div bind:this={swiper} class="swiper-container">
    <div class="swiper-wrapper">
		<slot></slot>
    </div>
    <!-- Add Pagination -->
    
  </div>


  <script>
      import Swiper from "swiper";
      import Window from "../Window.svelte";
      import {onMount, createEventDispatcher} from "svelte";
      const dispatch = createEventDispatcher();
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
          }
          });
          
          //When the slide changes  emit event to main component..
          controller.on('slideChange', function () {
              //console.log(controller.activeIndex);
              dispatch('slide', controller.activeIndex)
          });
      });


      export function goTo(number) {
        controller.slideTo(number);
      }
      
  

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