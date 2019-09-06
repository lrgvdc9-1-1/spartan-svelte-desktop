<script>
    export let person;
    export let title = false;
    export let isMe;
    export let chats = [];
    export let socket;
    let message = "";

    function onClearMSG() {
        message = "";
    }
    function onSendMessage(event) {
        console.log(event.keyCode);
        if(message.length < 1) {
            return; //Kill Funciton
        }

        if(event.type == "click") { //
            chats = [...chats,{sender: message, incoming: ""}];
        }

        if(event.type == "keypress" && event.keyCode == 13) { //If press enter then do this
            chats = [...chats,{sender: message, incoming: ""}];
        }

        //Reset Message
        message = "";
        
    }
</script>

<style>
    #chat_con {
        width: 100%;
        height: 140px;
        overflow: auto;
    }
    .msgBubble {
        border-radius: 4px;
        text-align: center;
        padding: 4px;
        margin-bottom: 10px;
        background: #243C73;

    }
    .containerSender {
        display: flex;
        justify-content: flex-end;
        border-spacing: 10px;
    }
</style>

<div id="chat_con">
    {#if title} 
    <h3 style="text-align: center">{person}</h3>
    {/if}

    {#each chats as chat}
         <!-- content here -->
        {#if chat.incoming}
            <div  style="float: left;width: 100%;display: flex;">
             <img width="25" height="25" src="./assets/spartan_logo.webp" alt="Spartan">
             <div class="msgBubble" style="margin-left: 10px" >{chat.incoming}</div>
            </div>
        {:else if chat.sender}
           <div class="containerSender">
                <div class="msgBubble" style="margin-right: 10px;">{chat.sender}</div>
           </div>
           
        {/if}
          

    
    {/each}
   

</div>
 <div class="input">
    <input on:keypress={onSendMessage} bind:value={message} class="inTicket" data-title="Full Address" data-section="Location Validation" id="full_address" type="text">
    <div class="button-group">
        <button on:click={onClearMSG}  class="button input-search-button"><span class="mif-bin"></span></button>
        <button on:click={onSendMessage}  class="button input-search-button">
            <span class="mif-chat-bubble"></span>
        </button>
   </div>
</div>