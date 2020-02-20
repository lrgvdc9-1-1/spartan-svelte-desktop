 <script>
    import {onMount, onDestroy, createEventDispatcher} from "svelte";
    import { get } from 'svelte/store';
    import {  navigateTo  } from '../../lib/main';
    import {ticketStateWin} from "../../stores/SpartanData.js";

    let display = 'none'
    const dispatch = createEventDispatcher();
    let ticket = null;
    let lbl;
    let hidden = false;
    let didOpen = false;
    let unsubscribe; 
   
    export function onToggle() {
        display = (display == 'none') ? 'block' : 'none';
    }

    export function getDisplay() {
        return display;
    }

    export function getTicket() {
        
        return ticket;
    }

    export function setTicket(tick) {
        ticket = tick;
        lbl = (ticket['objectid'] ? ticket['objectid'] : ticket['id_ticket']);
    }


    onMount(() => {
        
        unsubscribe = ticketStateWin.subscribe(window => {
		        if(window.open){
                   sendInformation();
                }
	    });

    });

    onDestroy(()=>{
      
       unsubscribe()
      
   })

    function redirectTo() {
        if(ticket) navigateTo(`#viewTicket/${ticket['id_ticket']}/${ticket['objectid']}`)
      
    }

    export function noHidden() {
        hidden = false;
        display = 'none';
    }

    function onClose() {
        display = 'none';
    }

    function onDeterClose() {
        console.log(this);
    }

    function onDrag(intent = true) {

        hidden = true;
       setTimeout(() => {
           display = 'none';
           hidden = false;
       }, 1700);
       if(intent) {
           dispatch("clearSelect");
       }

    }

    function sendInfo() {
        if(ticket) {
            onDrag(false); 
            window['ipc'].send("window-action", {"create": true, "name" : "TICKET", "preyes": true}); 
            let isOpen = get(ticketStateWin);
            if(isOpen.open) {
                window['ipc'].send("window-action", {"name": "TICKET","event": "open-ticket", "send" : ticket});
              
            }
        }
   }

   function sendInformation() {
      
        // WINDOW ACTION TO SEND TICKET INFORMATION TO THE WINDOW 
        window['ipc'].send("window-action", {
            "name": "TICKET","event": "open-ticket", "send" : ticket
        });
   }

   
    
 </script>
 
 <style>
 .arrow_box {
        position: absolute;
        box-shadow: 0 0 20px 0 rgba(0,0,0,.5);
        background: white;
        border: 4px solid #024775;
        z-index:2;
        transition:
        opacity 0.1s 0.3s,
        transform 0.1s 0.3s;
    }
    .hidden {
        opacity: 0;
        /* Move over to the right */
        transform: translateX(500px);
    }

   
    
   
    
 </style>



<div draggable="true" on:dragstart|preventDefault={onDrag} class:hidden={hidden} class="arrow_box" style="display: {display}; left: 50%;top: 50%;margin-top: -60px;">
         <ul class="v-menu">
            <li on:click|preventDefault={onDeterClose} class="menu-title">General - {lbl} 
                <!-- <button on:click={onClose} style="position:relative; z-index:2; left: 25px;bottom:14px;"  class="button alert cycle mini">
                <span on:click={onClose} class="mif-cross"></span></button> -->
            </li>
            <li on:click|preventDefault={sendInfo}><a href="/#" ><span class="mif-arrow-up-right icon"></span>Pop Up Ticket</a></li>
            <li on:click|preventDefault={redirectTo}><a href="/#"><span class="mif-stack icon"></span> Go To Ticket</a></li>
        </ul>
</div>