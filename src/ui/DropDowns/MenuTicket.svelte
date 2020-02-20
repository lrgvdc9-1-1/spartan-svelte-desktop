<script>
    import {onMount, onDestroy, createEventDispatcher} from "svelte";
    import { get } from 'svelte/store';
    import { navigateTo  } from '../../lib/main';
    import {ticketStateWin} from "../../stores/SpartanData.js";
    
    export let x;
    export let y;
    export let ticket;
    export let isMe;

    let unsubscribe;

    let spartans;
    const dispatch = createEventDispatcher();

    onMount(() => {
      
          unsubscribe = ticketStateWin.subscribe(window => {
		     if(window.open) {
                 sendInformation();
             }
        });  
    });


    onDestroy(()=>{
       unsubscribe()
   
   })

    function popUpTicket() {
    
       if(window['ipc']) {
            window['ipc'].send("window-action", {"create": true, "name" : "TICKET", "preyes": true}); 
           let isOpen = get(ticketStateWin);
        
           if(isOpen.open) {
                 window['ipc'].send("window-action", {"name": "TICKET","event": "open-ticket", "send" : ticket}); 
                 dispatch('close',false);
           }
       }
     
      
    }

    function goToTicket() {
        dispatch('close', false);
        navigateTo(`#viewTicket/${ticket.id_ticket}/${ticket.objectid}`)
    }

     function sendInformation() {
      
        // WINDOW ACTION TO SEND TICKET INFORMATION TO THE WINDOW 
        window['ipc'].send("window-action", {
            "name": "TICKET","event": "open-ticket", "send" : ticket
        });
   }

</script>
<style>
    #pop{
        position:absolute;
        z-index: 3;

    }
    li{
        cursor: pointer;
    }
</style>
<ul id="pop" class="h-menu">
    <li on:click={popUpTicket}>
        <span class="mif-arrow-up-right icon"></span>
        Pop Up Ticket
    </li>

    <li on:click={goToTicket}><span class="mif-stack icon"></span>Go To Ticket</li>
</ul>