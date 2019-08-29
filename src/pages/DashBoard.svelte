<script>
    import { onMount, onDestroy } from 'svelte';
    import { Router, Route, Link, navigateTo  } from '../lib/main';
    import SQL from '../utils/sql.js';

    export let url;
    export let option;
    let available = false;

    console.log(client);
    let sql = new SQL(client, api, client_status);

    let openTickets = [];

    let iconURL = url + "users/getUserImage/?pic=";
    

    //Once the component is mount will fetch the pending tickets by user.localStorage.
    onMount(async () => {
        
        //If sql available then get organization tickets
        if(sql.isLocalAvailable()) {
           sql.getOrganizationTickets(6).then(res => {
            
              
               openTickets = res.rows;
               setTimeout(() => {
                   available = true;
               }, 300);
           });
        }else {
            const res = await sql.getOrganizationTickets(6, url);
            let hold = await res.json();
            openTickets = (hold) ? hold['data'] : [];
            setTimeout(() => {
                   available = true;
               }, 300);
        }
	});
    
    onDestroy(async () => {
        //End of component life. 
        console.log("component desroyed...");
        openTickets = [];
    });

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
</style>

{#if available}
     <!-- content here -->
     <div class="container">

        <div class="window" style="float: left; width: 400px;">
            <div class="window-caption">
                <span class="icon mif-windows"></span>
                <span class="title">Open Ticket's</span>
                
            </div>
            <div class="window-content p-2" style="height: 300px;">
                <ul class="listview view-content">
                    {#each openTickets as ticket}
                     <!-- content here -->
                     <li >
                        
                        <div style="width: 100%" >
                            <div class="card">
                                <div class="card-header">
                                    <span class="icon">
                                    <img width="50" height="50" src="{getIMAGE(ticket.icon)}" alt="" id="src">
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
{/if}


