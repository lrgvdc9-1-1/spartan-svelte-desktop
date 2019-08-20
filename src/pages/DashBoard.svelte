<script>
    import { onMount } from 'svelte';
    export let url;
    export let option;
    let openTickets = [];
    let iconURL = url + "users/getUserImage/?pic=";
    

    //Once the component is mount will fetch the pending tickets by user.localStorage.
    onMount(async () => {

		const res = await fetch(url + "addressticket/getAllPendingTicketsByOrga2/?id=6");
        
		let hold = await res.json();
        openTickets = (hold) ? hold['data'] : [];
        console.log(openTickets);
	});
    
</script>
<style>
    .listview {

        display: inline;
    }
</style>
<div class="container">

        <div class="window" style="float: left; width: 400px;">
            <div class="window-caption">
                <span class="icon mif-windows"></span>
                <span class="title">Open Ticket's</span>
                
            </div>
            <div class="window-content p-2" style="height: 300px; cursor: pointer;">
                <ul class="listview view-content">
                    {#each openTickets as ticket}
                     <!-- content here -->
                     <li >
                        
                        <div style="width: 100%" >
                            <div class="card">
                                <div class="card-header">
                                    <span class="icon">
                                    <img width="50" height="50" src="{iconURL + ticket.icon}" alt="" id="src">
                                    </span>
                                    {ticket.staff} | <b> {((ticket.created_date) ? ticket.created_date : '')}</b>
                                </div>
                                <div class="card-content p-2">
                                    Card with header and footer...
                                </div>
                                <div class="card-footer">
                                    <button class="flat-button mif-thumbs-up"></button>
                                    <button class="flat-button mif-tag"></button>
                                    <button class="flat-button mif-share"></button>
                                </div>
                            </div>
                        </div>
                        
                     </li>
                     <br>
                    {/each}
                </ul>
                
            </div>
        </div>

        <div class="window" style="float: right; width: 400px;">
            <div class="window-caption">
                <span class="icon mif-windows"></span>
                <span class="title">Working Ticket's</span>
               
            </div>
            <div class="window-content p-2">
                Window content
            </div>
        </div>
 

</div>

