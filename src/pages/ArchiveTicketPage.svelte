<script>
    import {onMount} from "svelte";
    import {  navigateTo  } from '../lib/main';
    import {FormatDate} from '../utils/Months';
    import SQL from '../utils/sql';
    import Loading from '../ui/Loading.svelte';
    import SearchInput from "../ui/Archive/SearchInput.svelte";
    import ArrowTicket from "../ui/Archive/ArrowTicket.svelte";
    import ArrowSearch from "../ui/Archive/ArrowSearch.svelte";
    import CalendarPopUp from '../ui/Archive/CalendarPopUp.svelte';
    import ArrowUp from "../ui/Buttons/ArrowUp.svelte";
    export let isMe;
    
    export let url;
    export let Audio;
    export let spartans;

    let archives = [];
    let sql = new SQL(pool, api, client_status)
    let start = 0;
    let end   = 200;
    let loading = true;
    let arrs;
    let arrt;
    let calendar;

    $: viewing = archives.slice(start, end);

    onMount(() => {
        getAllArchives();    

    });

    function getAllArchives(){
        start = 0;
        end = 200;
        if(isMe['org_name'].includes('LRGVDC')) {
            sql.getTicketStatus(['00']).then((res) => {
                archives = res.rows;
                loading = false;
            }).catch((error) => {
                loading = false;
            })
        }
    }

    function ticketOptions(ticket) {
       // navigateTo(`#viewTicket/${ticket['id_ticket']}/${ticket['objectid']}`)
       arrt.noHidden();
       let data = arrt.getTicket();
       if(data) {
           if(data['id_ticket'] == ticket['id_ticket'] && data['objectid'] == ticket['objectid']){
               arrt.onToggle();
           }else if(arrt.getDisplay() == "none"){
               arrt.onToggle();
           }

       }else {
           arrt.onToggle();
       }
       arrt.setTicket(ticket)
    }


    function onFoward() {

        if((start + 200) < archives.length) {
            start += 200;
            end += 200;
        }
    }

    function onBackwards() {
        if((start - 200) > 0) {
            start -= 200;
            end -= 200;
        }else{
            start = 0;
            end = 200;
        }

        
    }

    function onDisplayMenu(e) {
        
        if(archives.length > 0) {
            arrs.onToggle();
        }

    }

    function onReset(){
        start = 0;
        end = 200;
        arrBDis =  "none";
   
    }


    async function onSearch(e) {
        loading = true;
        var value = e.detail.toUpperCase();
        viewing = archives.filter((ticket) => ticket['cfirst_name'] == value || ticket['clast_name'] == value);
        loading = false;       
    }

    function onHandle(e) {
        arrs.onClose();
        switch (e.detail) {
            case "REFRESH":
                archives = [];
                loading = true;
                
                getAllArchives();
                break;
            case "CALENDAR":
                calendar.onToggle();
                break;
            case "ORGA":
                break;
            default:
                break;
        }
    }

</script>
<style>
    .grid-container {
        display: grid;
        grid-template-columns: 30% 40% 30%;
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

    .row-hover:hover {
        cursor: pointer;
    }

    td:first-child:hover {
        color:  brown;
        text-decoration: underline;
    }
    #cog:hover {
        background: #adacacbe !important;
    }
   
</style>
{#if loading}
     <Loading />
{/if}

<div class="container" style="background: white;color: gray;height: 70vh;">
   
   <div class="grid-container">
             <h3>Total Rango Archived: {archives.length}</h3>
             <div style="margin:auto;">
                <SearchInput on:search="{onSearch}" title="Search Archive Tickets" />
             </div>
             <h3 style="text-align: right;">
             Showing {start + 1} of {end}
            </h3>
       </div>
    <ArrowTicket bind:this={arrt} />
    <CalendarPopUp bind:this={calendar} />
    <div id="body"  style="background: white;border-radius: 8px; overflow: auto; overflow-x: hidden;height: 58vh;">
        
        <ArrowSearch on:spit={onHandle} bind:this={arrs} />
       
            <table class="table compact row-hover striped">
            
                <thead>
                    <tr>
                        <th>Ticket #</th>
                        <th style="width: 125px;">Created Date</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Full Address</th>
                        <th>Property Id</th>
                        <th>Subdivision</th>

                        <th><button id="cog" on:click="{onDisplayMenu}" class="button"><span class="mif-cog"></span></button>
                            

                        </th>
                    </tr>
                    
                </thead>
                <tbody>
                {#each viewing as ticket, i}
                    <tr>
                            <td>
                            <span on:click="{() => {ticketOptions(ticket)}}">{((ticket.objectid) ? ticket.objectid : ticket.id_ticket)}</span> 
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
    <ArrowUp elemString="body" />
    <div class="footer">
        <div class="row-grid">
            <div>
                <button on:click="{onBackwards}" class="button">
                   <span class="mif-previous"></span>
                </button>
            </div>
            <div style="text-align: right; right:0;">
                <button on:click="{onFoward}" class="button">
                   <span class="mif-next"></span>
                </button>
                
            </div>
        </div>
    </div>
</div>

