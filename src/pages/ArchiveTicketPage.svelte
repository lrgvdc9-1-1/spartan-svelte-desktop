<script>
    import {onMount} from "svelte";
    import {  navigateTo  } from '../lib/main';
    import {FormatDate} from '../utils/Months';
    import SQL from '../utils/sql';
    import Loading from '../ui/Loading.svelte';
    import SearchInput from "../ui/Archive/SearchInput.svelte";
    export let isMe;
    
    export let url;
    export let Audio;
    export let spartans;

    let archives = [];
    let sql = new SQL(pool, api, client_status)
    let start = 0;
    let end   = 200;
    let loading = true;
    let arrBDis = "none";
    let slice = true;
  
    $: viewing = (slice) ? archives.slice(start, end) : archives;
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

    function redirectTicket(ticket) {
        navigateTo(`#viewTicket/${ticket['id_ticket']}/${ticket['objectid']}`)
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
            arrBDis = (arrBDis == "none") ? "block" : "none";
        }

    }

    function onReset(){
        start = 0;
        end = 200;
        arrBDis =  "none";
        slice = true;
   
    }


    async function onSearch(e) {
        slice = false;
        loading = true;
        var value = e.detail.toUpperCase();
        viewing = archives.filter((ticket) => ticket['cfirst_name'] == value || ticket['clast_name'] == value);
        loading = false;       
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

    .arrow_box {
        position: absolute;
        box-shadow: 0 0 20px 0 rgba(0,0,0,.5);
        background: white;
        border: 4px solid #024775;
        z-index:2;
    }
    .arrow_box:after, .arrow_box:before {
        bottom: 100%;
        left: 80%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }

    .arrow_box:after {
        border-color: rgba(136, 183, 213, 0);
        border-bottom-color: white;
        border-width: 20px;
        margin-left: -20px;
    }
    .arrow_box:before {
        border-color: rgba(194, 225, 245, 0);
        border-bottom-color: #024775;
        border-width: 26px;
        margin-left: -26px;
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
    <div id="body" style="background: white;border-radius: 8px; overflow: auto; overflow-x: hidden;height: 58vh;">
    <div class="arrow_box" style="display: {arrBDis}; left:87%; top:80px">
         <ul class="v-menu">
            <li on:click|preventDefault="{onReset}"><a href="/#"><span class="mif-home icon"></span> Refresh Archive</a></li>
            <li class="menu-title">Search</li>
            <li><a ><span class="mif-calendar icon"></span> Calendar</a></li>
            <li><a ><span class="mif-library icon"></span> Organization</a></li>
            
        </ul>
    </div>
       
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

                <th><button on:click="{onDisplayMenu}" class="button"><span class="mif-cog"></span></button>
                     

                </th>
            </tr>
            
        </thead>
        <tbody>
         {#each viewing as ticket, i}
               <tr>
                    <td>
                     <span on:click="{() => {redirectTicket(ticket)}}">{((ticket.objectid) ? ticket.objectid : ticket.id_ticket)}</span> 
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

