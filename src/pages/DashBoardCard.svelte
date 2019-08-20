<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import Card from '../ui/Card.svelte';

    export let url;
    export let path;
    let Tickets = [];
    let ticketCount = 0;
    let mapAvailable = false;
     onMount(async () => {
        const res = await fetch(url + path);
        
        let hold = await res.json();
        Tickets =  (hold) ? hold['data'] : []; 
        console.log(Tickets);
        ticketCount = Tickets.length;
        
     });

   
</script>
<style>
   
	.gridDash {
        padding-left:10%;
		display: grid;
		grid-template-columns: 20% 20% 20% 20%;
        grid-gap: 2%;
	}

  
</style>
 <button out:fade style="position: fixed; bottom: 10px; right: 10px;" class="action-button rotate-minus bg-red fg-white">
    <span style="font-size: 18px; font-weight: bold;">{ticketCount}</span>
</button>
<div class="contanier-fluid gridDash">
    
    {#each Tickets as ticket, i}
        <Card cfirst_name={ticket.cfirst_name} x={ticket.longy} y={ticket.lat} created_date={ticket.created_date} clast_name={ticket.clast_name} />
    {/each}
</div>