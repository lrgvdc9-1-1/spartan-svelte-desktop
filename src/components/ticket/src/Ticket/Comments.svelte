
<script>
    import {onMount, createEventDispatcher} from "svelte";
    import { fade } from 'svelte/transition';
    import Confirm from '../components/Modal/Confirm.svelte';
    import {FormatDate} from '../utils/Months.js';
    import Window from "../Window.svelte";

    const dispatch = createEventDispatcher();
  
    export let spartans;
    export let isMe;
    export let url;

    let messages = [];
    let shwInput = false;
    let eleInput;
    let clsConfirm = false;
    let txtarea;
    let ticketId;


 

    function getImg(msg){
        let spartan = spartans.filter(spartan => spartan['user_id'] == msg.user_id)[0];

        if(spartan && spartan['icon2']) {
            let icon = `${url}users/getUserImage/?pic=${spartan.icon2}`;
            return icon;
        }else {
            return "./assets/spartan_logo.webp";
        }
        
    }

    function handleDisplay() {

        shwInput = !shwInput; 

      

        if(shwInput) {
            setTimeout(() => {
                eleInput.focus(); //This makes awesome use of focus...
                eleInput.style.display = "";
            }, 200);
        }else {
            eleInput.style.display = "none";
        }
    }
    function clearMSG() {
        if(eleInput) {
            eleInput.value = "";
        }
    }

    function handleKeyInput(ele) {
       
        if(ele.keyCode == 13) {
            let msg = ele.target.value.toUpperCase();

            let object = {user_id: isMe.user_id, first_name: isMe.first_name, last_name: isMe.last_name, ticket_comments: msg, time_track: new Date()};
            console.log(object);

            //sql transaction..
            //Lets send it to the DATABASE TO SAVE....
            window.sql.query(window['api']['tickets']['insertComment'], [isMe.user_id, isMe.first_name, isMe.last_name,ticketId, msg]).then(res => {
                if(res.rows.length == 1) { //Get the id_com from the new save transaction from DB..
                    object.id_com =  res.rows[0].id_com;
                    messages = [object].concat(messages);

                    dispatch('totalMSG', messages.length);
                }
              
                 window.ipc.send("window-gis-events", {"event": "ticket-refresh-comments", "send": {"ticketId" : ticketId}});
            })
            //This is tips future me: user_id, first_name, last_name, ticket_number, ticket_comments, time_track, id_com, unshift
            
            //Reset the inserting comments..
            clearMSG();

           
            
        }
        


    }

    function handleDelete(feed) {

        messages = messages.filter(msg => msg.id_com != feed.id_com);
        dispatch('totalMSG', messages.length); //Tell outer component new change...
        window.sql.query(window['api']['tickets']['deleteComment'],[feed.id_com]);

        

    }
    function handleMSG(event) {
            let el = event.target;
            if(event.keyCode == 13) {
                let comID = el.dataset.id;
                let index = el.dataset.index;
                messages[index].edit = false;
                messages[index].ticket_comments = el.value.toUpperCase();
                
                window.sql.query(window['api']['tickets']['updateComment'] ,[el.value.toUpperCase(), comID]);
            }
            
    }
    function  handleEdit() {
            setTimeout(() => {
                txtarea.focus();
            }, 200);
    }

    export function onDownload(ticketID) {
        
        ticketId = ticketID;
        //Download the feed...
        window.sql.query(window['api']['tickets']['feed'], [ticketID]).then((res) => {
                console.log(res);
                messages = res.rows;
                dispatch('totalMSG', res.rowCount);
        });
    }


</script>
<style>
    ul{
        list-style: none;
    }

    .grid-container {
        display: grid;
        grid-template-columns: 90% 10%;
        
    }
    
    .grid-messages {
        display: grid;
        grid-template-columns: 90% 10%;
    }

    .grid-item {
        padding: 2px;
     
    }
   

    @keyframes shadow-pulse
    {
    0% {
        box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
    }
    100% {
        box-shadow: 0 0 0 35px rgba(0, 0, 0, 0);
    }
    }

    .highlight {
        color: #C3073F;
        animation: shadow-pulse 1s infinite;
    }

    #grid {
        display: grid;
        grid-template-columns: 100%;
    }
    #col {
        text-align: right;
    }
</style>
<Window title="Comments Feed">
    <div style="width: 100%;height: 90%;">
    <ul>

        {#each messages as feed, i (feed.id_com)}
            <li>
                <div class="grid-messages" class:highlight={feed.confirm}>
                    <div class="grid-item" id="accountInfo">
                        <img width="40" height="40" src="{getImg(feed)}" alt="Icon" />
                        <span>{feed.first_name + " " + feed.last_name}</span>
                    </div>
                    
                    <div class="grid-item" id="date">
                        <span class="mif-alarm"></span>
                        <span>{FormatDate(feed.time_track)}</span>
                        <br>
                        {#if feed.user_id == isMe.user_id}
                            <button on:click="{()=> { feed.edit = true; handleEdit()}}" class="action-button"><span class="mif-pencil"></span></button>

                            <button on:click="{()=> {feed.confirm = true}}" class="action-button rotate-minus bg-red fg-white">
                                <span class="icon">
                                    <span class="mif-bin"></span>
                                </span>
                            </button>
                        {/if}
                        {#if feed.confirm}
                            <!-- content here -->
                            <Confirm  title="Are you sure!!!" msg="Do you want to delete message?" 
                            clsSmall={true} clsBig={false} on:confirm={() => handleDelete(feed)} on:close="{(event) => {feed.confirm = event.detail;}}" />
                        {/if}
                    </div>
                    <div id="msg">
                        {#if feed.edit}
                            <textarea bind:this={txtarea} data-index="{i}" data-id="{feed.id_com}" on:keypress={handleMSG} rows="4" cols="50">{feed.ticket_comments}</textarea>
                        {:else}
                            {feed.ticket_comments}
                        {/if}
                    </div>
                </div>
                <hr>
            </li>
        {/each}
        

    </ul>

</div>


<div id="grid">

    <div id="col" >
        <div class:grid-container={shwInput} >
                {#if shwInput}
                <div transition:fade class="input">
                    <input bind:this={eleInput} on:keypress={handleKeyInput} placeholder="Enter Comment!!" type="text" data-role="input" data-role-input="true" class="">
                    <div class="button-group">
                        <button on:click={clearMSG} class="button input-clear-button" tabindex="-1" type="button">
                            <span class="default-icon-cross"></span>
                        </button>
                    </div>
                </div>
            {/if}
            <div style="text-align: right;">
                 <button on:click={handleDisplay} class="action-button rotate-minus bg-red fg-white">
                <span class="icon">
                    <span class="mif-bubble"></span>
                </span>
                </button>
            </div>
           
        </div>
    
    </div>

</div>


</Window>

