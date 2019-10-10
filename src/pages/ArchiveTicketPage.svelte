<script>
    import {onMount} from "svelte";
    import {FormatDate} from '../utils/Months';
    import SQL from '../utils/sql';
    import Loading from '../ui/Loading.svelte';
    export let isMe;
    
    export let url;
    export let Audio;
    export let spartans;

    let archives = [];
    let sql = new SQL(pool, api, client_status)
    let start = 0;
    let end   = 200;
    let loading = true;
    $: viewing =archives.slice(start, end);
    onMount(() => {
       
        sql.getTicketStatus(['00']).then((res) => {
            console.log(res)
            archives = res.rows;
            loading = false;
        }).catch((error) => {
            loading = false;
            console.log(error);
        })

    });


</script>
<style>
    .grid-container {
        display: grid;
        grid-template-columns: 80% 20%;
        border-bottom: 1px solid;
    }
   
    span:hover {
        cursor: pointer;
    }

    .footer {
        position: absolute;
        width: 100%;
        left:0;
        bottom: 0;
        background: gray;
    }

    .row-grid {
        display: grid;
        grid-template-columns: 50% 50%;
    }
</style>
{#if loading}
     <Loading />
{/if}

<div class="container" style="background: white;color: #CAB448;">
   <div class="grid-container">
             <h3>Total Ticket Archived: {archives.length}</h3>
             <h3 style="float: right;">Display: {start + 1} of {end}</h3>
       </div>
    <div id="body" style="background: white;border-radius: 8px; overflow: auto;height: 700px;">
 
       
    <table class="table">
        <thead>
            <tr>
                <th>#</th>
                <th>Created Date</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Full Address</th>
                <th>Property Id</th>
                <th>Subdivision</th>

                <th><button class="button"><span class="mif-cog"></span></button></th>
            </tr>
            
        </thead>
        <tbody>
         {#each viewing as ticket}
               <tr>
                    <td>
                     <span>{((ticket.objectid) ? ticket.objectid : ticket.id_ticket)}</span> 
                    </td>
                    <td>{FormatDate(ticket.created_date)}</td>
                    <td>
                        {ticket.cfirst_name}
                    </td>
                    <td>
                        {ticket.clast_name}
                    </td>
                    <td>
                        {ticket.full_address}
                    </td>
                    <td>
                        {ticket.property_id}
                    </td>
                     <td>
                        {ticket.subdivision}
                    </td>
                   
              </tr>
         {/each}
        </tbody>

    </table>    
    </div>
    
    <div class="footer">
        <div class="row-grid">
            <div>
                <button class="button">
                   <span class="mif-previous"></span>
                </button>
            </div>
            <div style="position: relative; right:0;">
                <button class="button">
                   <span class="mif-next"></span>
                </button>
                
            </div>
        </div>
    </div>
</div>

