<script>
    import {onMount} from "svelte";
    export let days;

    onMount(() => {
        console.log(days);
    });
</script>


<div class="days-row">
    {#each days as day}
         <div class:today={day.today} class:outside={day.outside} class="day">{day.getDay()}</div>
    {/each}
</div>