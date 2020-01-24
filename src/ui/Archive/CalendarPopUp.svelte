 <script>
    import {createEventDispatcher} from "svelte";
    import CalendarPicker from "../Calendar/CalendarPicker.svelte";
    let display = 'none'
    const dispatch = createEventDispatcher();
    let ticket = null;
    let lbl;
    let hidden = false;
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



    function onSpitOut(e) {
        dispatch("spit", e);
    }

    export function noHidden() {
        hidden = false;
        display = 'none';
    }

    function onClose() {
        display = 'none';
    }


    function onDrag(e) {
        e.preventDefault();
        hidden = true;
       setTimeout(() => {
           display = 'none';
           hidden = false;
       }, 1700);
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

    .button:hover {
        background-color: #016e9c !important;
    }

   
    
   
    
 </style>



<div draggable="true" on:dragstart={onDrag} class:hidden={hidden} class="arrow_box" style="display: {display}; left: 50%;top: 50%;margin-top: -240px;width:800px;margin-left:-400px;">

        <div class="window">
            <div class="window-caption">
                <span class="icon mif-calendar"></span>
                <span class="title">Filter By Calendar</span>
                 <div on:click={onDrag} class="buttons">
                    <span class="btn-close"></span>
                </div>
            </div>
            <div class="window-content p-2">
                <div style="display: flex; justify-content: space-between">
                    <CalendarPicker />
                    <CalendarPicker />
                </div>
         
                <button style="background-color: #004d6f;color: white;" class="button large w-100">Submit</button>
            </div>
        </div>
</div>