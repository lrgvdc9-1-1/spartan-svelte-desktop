<script>
    import { onMount, onDestroy } from 'svelte';
    import { Router, Route, Link, navigateTo  } from '../lib/main';
    import SQL from '../utils/sql.js';

    export let url;
    export let option;
    export let isMe;
    let available = false;
    let searchOn = false;

    let sql = new SQL(pool, api, client_status);

    let openTickets = [];
    let mineTickets  = [];
    let searchTck = [];
    let iconURL = url + "users/getUserImage/?pic=";

    $: opTickets = searchTck;

    //Once the component is mount will fetch the pending tickets by user.localStorage.
    onMount( () => {
        
        //If sql available then get organization tickets
        getData();
	});
    
    onDestroy(async () => {
        //End of component life. 
        console.log("component desroyed...");
        openTickets = [];
    });

    async function getData()  {
         if(sql.isLocalAvailable()) {
            
           sql.getOrganizationTickets(isMe.ORGANIZATION).then(res => {
               console.log(res);
               searchTck = openTickets = res.rows;
               setTimeout(() => {
                   available = true;
               }, 300);
           });


           sql.getMyTickets(isMe.UID).then(res => {
               console.log(res);
               mineTickets = res.rows;

           })



        }else {
            const res = await sql.getOrganizationTickets(isMe.ORGANIZATION, url);
            let hold = await res.json();
            openTickets = (hold) ? hold['data'] : [];
            setTimeout(() => {
                   available = true;
               }, 300);
        }
    }


    function getDateFormat(date) {
        let dateFormat = "";
        if(date instanceof String) {
            dateFormat = (date) ? date : "";
        }else if(date instanceof Date){
            dateFormat = date.getFullYear() + "-" + ((date.getMonth() + 1 < 10) ? "0" + (date.getMonth() + 1) : (date.getMonth()+ 1)) + "-" + ((date.getDate()	< 10) ? "0" + date.getDate() : date.getDate());
        }

        return dateFormat;
        
    }

    function getIMAGE(image){
        
        return (image) ? iconURL + image : "./assets/spartan_logo.webp"; 
    }

    function searchTickets(event) {

        //Grab the value from the input. the input is return from the event..
        let search_value = event.target.value.toUpperCase();
        searchTck = openTickets.filter(el => el['init'].includes(search_value) || el['staff'].includes(search_value) || el['objectid'].includes(search_value) ||el['cfirst_name'].includes(search_value) || el['clast_name'].includes(search_value) )
        
    }

    function inFocus()  {

        setTimeout(() => { document.getElementById("inTXT").focus() }, 250)
    }

    function viewProfile(e) {

        let element = e.target;
        let data = element.dataset;
        ipc.send('show-profile', {"me": isMe, "userid" : data['id'], "myself" : false});
        // let edit = (isMe.work_center == "ADMIN") ? "edit" : "view";
        // let win = window.open(`${dirname}/components/Profile/index.html#${data['id']}#${edit}#${isMe.work_center}`, 'profile');
   
        // var timer = setInterval(function() { 
        //     if(win.closed) {
        //         clearInterval(timer);
        //         alert('closed');
        //     }
        // }, 500);
    }

    function onZoomLocation(obj) {
        console.log("ZOOMING ON LOL");
        window.ipc.send("show-gis-window");
        window.ipc.send("window-gis-events", {
            "event" : "zoom-to-ticket", "send" : {obj}})
        
    }

</script>
<style>
    .listview {

        display: inline;
    }
    .flat-button {
        cursor: pointer;
    }
    .icon {
        cursor: pointer;
    }
    .bck {
        background: #CAB448;
    }
</style>

{#if available}
     <!-- content here -->
     <div class="container">
        <div class="window" style="float: left; width: 400px;">
            <div class="window-caption">
                <span class="icon mif-windows"></span>
                <span class="title">Open Ticket's</span>
                 <div class:input={searchOn}>
                                {#if searchOn}
                                     <!-- content here -->
                                     <input id="inTXT"  on:keyup={searchTickets} type="text" placeholder="Search Tickets"  >
                                {/if}
                                
                                <div class="button-group">
                                <button class:bck={!searchOn} on:click={()=>{ searchOn = !searchOn; (searchOn) ? inFocus() : getData();}} class="button">
                                    {#if searchOn}
                                         <!-- content here -->
                                          <span style="color: red;" class="mif-cancel"></span>
                                         
                                    {:else}
                                         <!-- else content here -->
                                        <img loading="lazy"  src="./assets/search-solid.svg" alt="Search" >
                                    {/if}
                                   
                                    
                                </button>
                                </div>
                                
                            </div>
            </div>
            <div class="window-content p-2" style="height: 340px;">
                <ul class="listview view-content">
                    {#each opTickets as ticket}
                     <!-- content here -->
                     <li >
                        
                        <div style="width: 100%" >
                            <div class="card">
                                <div class="card-header">
                                    <span class="icon">
                                    <img loading="lazy" on:click={viewProfile} data-id={ticket.started_ticket} width="50" height="50" src="{getIMAGE(ticket.icon)}" alt="" id="src">
                                    </span>
                                    {ticket.staff} | <b> {getDateFormat(ticket.created_date)}</b>
                                </div>
                                <div class="card-content p-2">
                                    <table class="table">
                                        <tr>
                                            <td>Ticket Id</td>
                                            <td>{ticket.objectid}</td>
                                        </tr>
                                        <tr>
                                            <td>Customer Name</td>
                                            <td>{ticket.cfirst_name} {ticket.clast_name}</td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="card-footer">
                                    <button on:click={() => { navigateTo(`#viewTicket/${ticket.id_ticket}/${ticket.objectid}`)}} class="flat-button mif-note-add" ></button>
                                    <button on:click={()=> {onZoomLocation(ticket)}} class="flat-button mif-location"></button>
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

                <ul class="listview view-content">
                    {#each mineTickets as ticket}
                         <li >
                        
                        <div style="width: 100%" >
                            <div class="card">
                                <div class="card-header">
                                    <span class="icon">
                                    <img loading="lazy" on:click={viewProfile} data-id={ticket.started_ticket} width="50" height="50" src="{getIMAGE(ticket.icon)}" alt="" id="src">
                                    </span>
                                    {ticket.staff} | <b> {getDateFormat(ticket.created_date)}</b>
                                </div>
                                <div class="card-content p-2">
                                    <table class="table">
                                        <tr>
                                            <td>Ticket Id</td>
                                            <td>{ticket.objectid}</td>
                                        </tr>
                                        <tr>
                                            <td>Customer Name</td>
                                            <td>{ticket.cfirst_name} {ticket.clast_name}</td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="card-footer">
                                    <button on:click={() => { navigateTo(`#viewTicket/${ticket.id_ticket}/${ticket.objectid}`)}} class="flat-button mif-note-add" ></button>
                                    <button on:click={()=> {onZoomLocation(ticket)}} class="flat-button mif-location"></button>
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
    </div>
{/if}


