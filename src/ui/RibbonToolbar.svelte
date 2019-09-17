<script>
    import { Router, Route, Link, navigateTo  } from '../lib/main';
    import { fade, fly } from 'svelte/transition';
    import DashBoard from '../pages/DashBoard.svelte';
    import DashBoardCard from '../pages/DashBoardCard.svelte';
    import Ticket from '../pages/Ticket.svelte';
    import ShortCuts from '../ui/ShortCuts.svelte';
  
    export let url;
    export let socket;
    export let spartans;
    export let isMe;
    export let Audio;

    let current = 'home'; //This handles the ribbon toolbar..
    let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform); //What type of platform we are in...
    let action = "";
    let display = "";
    let dashboardDropDown = {alltickets: false, mytickets: false, walkins: false }
    let dashboardOp = false;
    $: showOptionsDashBoard = (dashboardOp) ? '' : 'none';
</script>
<style>
    .liactive{
        border-color:#a4cef9;background-color:rgba(164,206,249,.2)
    }

    span img  {
        width: 80px !important;height:80px !important;
    }
    .squeeze {
        width: 92%;
        margin-top: 2px;
        height: 100vh;
        float:right;
    }
    section {
        
        width: 100%;
        height: 100%;
    }

</style>

<section>
    <ShortCuts></ShortCuts>
<div class="squeeze">

        <nav data-role="ribbonmenu" class="ribbon-menu" data-role-ribbonmenu="true">
            <ul class="tabs-holder">
                    <li class="static">
                        <a href="./index.html">ONLINE</a>
                    </li>
                    <li on:click="{() => current = 'home'}" 
                        class:active="{current === 'home'}">
                        <a>TICKET</a>
                    </li>
                    <li on:click="{() => current = 'sub'}" 
                        class:active="{current === 'sub'}">
                        <a>SUBDIVISION</a>
                    </li>
                    <li on:click="{() => current = 'nrf'}" 
                        class:active="{current === 'nrf'}" >
                        <a>NRF'S</a>
                    </li>
                    <li on:click="{() => current = 'gis'}" 
                        class:active="{current === 'gis'}">
                        <a>GIS</a>
                    </li>
                    <li on:click="{() => current = 'settings'}" 
                        class:active="{current === 'settings'}">
                        <a>SETTINGS</a>
                    </li>
            </ul>  
            <div class="content-holder">
                    <div class:active="{current === 'home'}" class="section" id="section-ticket">
                        <div class="group">

                            <div class="ribbon-split-button">
                                <button on:click="{() => {dashboardOp = false}}"  class="ribbon-main">
                                <Link href="#dashboard">
                                    <span >
                                        {#if iOS}
                                            <img loading="lazy" src="./assets/dashboard.png" alt="dashboard">
                                        {:else}
                                        <img loading="lazy"  src="./assets/dashboard.webp" alt="dashboard">
                                        {/if}
                                    </span>
                                </Link>
                            
                                </button>
                                <span  on:click="{()=> {dashboardOp = !dashboardOp; display = "NONE"}}" 
                                class="ribbon-split dropdown-toggle">More Options</span>
                                <ul style="display: {showOptionsDashBoard}" class="ribbon-dropdown" >
                                    <li on:click={()=>{dashboardDropDown.alltickets = true; dashboardOp = !dashboardOp; display = "NONE";
                                        dashboardDropDown.walkins = false; 
                                        dashboardDropDown.mytickets = false}} 
                                    class:liactive={dashboardDropDown.alltickets} class="checked-one">
                                        <Link href="#AllOpenTickets">
                                            ALL OPEN TICKETS
                                        </Link>
                                    </li>

                                    <li class="checked-one"><Link href="#AllOpenTickets">MY TICKETS</Link></li>
                                    <li class:liactive={dashboardDropDown.walkins} on:click="{()=> {dashboardOp = !dashboardOp; display = "NONE";
                                        dashboardDropDown.alltickets = false; 
                                        dashboardDropDown.walkins = true; dashboardDropDown.mytickets = false}}" class="checked-one">
                                        <Link href="#WalkIns">
                                            WALK INS
                                        </Link>
                                    </li>    
                                </ul>
                            </div>

                            <button class="ribbon-button">
                                    <span >
                                        {#if iOS}
                                            <img loading="lazy" src="./assets/calendar.png" alt="Calendar">
                                        {:else}
                                        <img loading="lazy" src="./assets/calendar.webp" alt="Calendar">
                                        {/if}
                                    </span>
                                <span class="caption">Calendar</span>
                            </button>
                            <button class="ribbon-button">

                                    
                                        <span  >
                                        {#if iOS}
                                            <img loading="lazy" src="./assets/cabinet.png" alt="Archive">
                                        {:else}
                                        <img loading="lazy" src="./assets/cabinet.webp" alt="Archive">
                                        {/if} 
                                        </span>
                                    
                                <span class="caption">Archive</span>
                            </button>
                            <button class="ribbon-button">
                                
                                <span class="caption">Charts</span>
                            </button>

                            <span class="title">Display</span>
                        </div>
                        <div class="group">
                            <button on:click={() => {display = "TICKET"}} class="ribbon-button">

                                <Link href="#newTicket" className="btn">
                                        {#if iOS}
                                            <span >
                                                <img loading="lazy" src="./assets/edit.png" alt="New Ticket">
                                            </span>
                                        {:else}
                                            <span >
                                                <img loading="lazy" src="./assets/edit.webp" alt="New Ticket">
                                            </span>
                                        {/if}
                                </Link>
                                    
                                <span class="caption">New</span>
                            </button>

                            <span class="title">Insert</span>
                        </div>
                        <div class="group">
                            <button class="ribbon-button">
                            <span>
                                {#if iOS}
                                    <img loading="lazy" src="./assets/filter.png" alt="Filter">
                                {:else}
                                    <img loading="lazy" src="./assets/filter.webp" alt="Filter">
                                {/if}
                            </span>
                            <span class="caption">Filter</span>
                            </button>

                            <span class="title">Records</span>
                        </div>

                        <div class="group">
                            <div class="input">
                                <input type="text"  >
                                <div class="button-group">
                                <button class="button">
                                    <img loading="lazy"  src="./assets/search-solid.svg" alt="Search" >
                                </button>
                                </div>
                                
                            </div>
                            <span class="title">
                                Quick Search
                            </span>
                        </div>
                        {#if display != "TICKET"}
                            <div class="group" ></div>
                        {/if}
                        {#if display === "TICKET"}
                            <div in:fly="{{ x: 200, duration: 2000 }}" out:fade class="group">
                                <button on:click="{() => {action = "SAVE";}}"  class="ribbon-button">
                                    <span>
                                        {#if iOS}
                                            <img loading="lazy" src="/assets/save.png" alt="Filter">
                                        {:else}
                                            <img loading="lazy" src="./assets/save.webp" alt="Filter">
                                        {/if}
                                    </span>
                                    <span class="caption">Save & Transfer</span>
                                </button>
                                <button on:click="{() => {action = "DELETE"}}" class="ribbon-button">
                                    <span>
                                        <img loading="lazy" src="./assets/garbage.webp" alt="Filter">
                                    </span>
                                    <span class="caption">Delete</span>
                                </button>
                                <button class="ribbon-button">
                                    <span>
                                        {#if iOS}
                                            <img loading="lazy" src="./assets/cabinet.png" alt="Filter">
                                        {:else}
                                            <img loading="lazy" src="./assets/cabinet.webp" alt="Filter">
                                        {/if}
                                    </span>
                                    <span class="caption">Archive</span>
                                </button>
                                <span class="title">
                                    Edits
                                </span>
                            </div>

                            <div in:fly="{{ x: 200, duration: 2000 }}" out:fade class="group">
                                <span class="title">Insert</span>
                            </div>
                    {/if}
                    </div>

                    <div class:active="{current === 'sub'}" class="section" id="section-subdivision">
                        <p class="p-4">Subdivision</p>
                    </div>

                    <div class:active="{current === 'nrf'}" class="section" id="section-nrf">
                        <p class="p-4">Section NRF</p>
                    </div>

                    <div class:active="{current === 'gis'}" class="section" id="section-gis">
                        <p class="p-4">Section GIS</p>
                    </div>
                    <div class:active="{current === 'settings'}" class="section" id="section-settings">
                        <p class="p-4">Section Settings</p>
                    </div>
            </div>                 
        </nav>


        <section style="width:100%; height: 500px;">
             <Router>
        
                <Route path="#dashboard" ><DashBoard {isMe} url={url} /></Route>
                <Route path="#WalkIns" ><DashBoardCard {isMe} url={url} path={"addressticket/getAllWalkIn/"} /></Route>
                <Route path="#AllOpenTickets" ><DashBoardCard {isMe} url={url} path={"addressticket/getAllPendingTicketsByOrga2/?id=6"} /></Route>
                <Route path="#newTicket"  ><Ticket on:toolbar={(event)=>{display = event.detail.text}} {socket} {isMe} {spartans} newTicket={true}  action={action} /></Route>
                <Route path="#viewTicket/:idTicket/:objectid" let:router><Ticket on:toolbar={(event)=>{display = event.detail.text}} {socket} {isMe} {spartans} {router} newTicket={false}  action={action} /></Route>
                <Route path="*" ><DashBoard {isMe} url={url} /></Route>
            </Router>
        
        </section>

       

</div>


</section>
