<script>
    import { fade,fly } from 'svelte/transition';
    import {createEventDispatcher} from "svelte";
    export let days;
    const dispatch = createEventDispatcher();
</script>
<style>
    .week {
      display: grid;
      grid-gap: 8px;
      grid-template-columns: repeat(7, 100px);
    }
    .day {
        margin: 2px;
        color: #4a4a4a;
        font-weight: bold;
        text-align: center;
        font-size: 16px;
        flex: 1 0 auto;
        height: auto;
        display: flex;
        flex-basis: 0;
        border: 1px solid;
    }

    .day-label {
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: 100%;
        position: relative;
        border-radius: 50%;
        margin: 10%;
        padding: 0;
        align-items: center;
        background: none;
        cursor: pointer;
        transition: all 100ms linear;
        font-weight: normal;
    }
    .outSideMonth {
        opacity: 0.35;
    }

    .isToday {
        opacity: 1;
        background: none;
        color:#f7901e;
    }

    

    .isToday:hover{
        background-color: #f7901e;
        
        color: #fff
    }
    
</style>
<div in:fly="{{x:-1*50, duration: 180, delay: 90}}" 
  out:fade class="week">
    {#each days as day, i}
         <div  class:outSideMonth={day.outside} class="day">
            <button on:click="{()=> {day.index = i; dispatch("selected",day)}}" class:primary={day.choosen} class:outline={day.choosen}  class:isToday={day.today} class="button  day-label">
                {day.getDay()}
            </button>
         </div>
    {/each}
</div>