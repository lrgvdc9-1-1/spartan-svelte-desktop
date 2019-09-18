<script>
    import { onMount, onDestroy } from 'svelte';

    export let person;
    export let title = false;
    export let isMe;
    export let chats = [];
    export let socket;
    let message = "";
    let incoming = "";

    onMount(async () => {
        // content here
        socket.on("typing", (userName) => {
            incoming = `${userName} is typing`
        });

        socket.on("private", (msg) => {
             if(msg.length > 0) {
                chats = [...chats,{sender: "", incoming: msg}];
             }
            
             incoming = "";
        });
    });

    onDestroy(async () => {
        // content here
        socket.off("typing");
        socket.off("private");
        person.chat = false;   
        

    });

    function onClearMSG() {
        message = "";
    }
    function onSendMessage(event) {
        console.log(event.keyCode);
         socket.emit("typing", {userName: isMe.FULL_NAME, socketid: person.socket_id})
        if(message.length < 1) {
            
            return; //Kill Funciton
        }

        if(event.type == "click") { //
            chats = [...chats,{sender: message, incoming: ""}];
            socket.emit('private', {msg: message, socketid: person.socket_id})
             //Reset Message
            message = "";
            return;
        }

        if(event.type == "keypress" && event.keyCode == 13) { //If press enter then do this
            chats = [...chats,{sender: message, incoming: ""}];
            socket.emit('private', {msg: message, socketid: person.socket_id})
             //Reset Message
            message = "";
            return;
        }       

       
    }

   
</script>

<style>
    #chat_con {
        width: 100%;
        height: 140px;
        overflow: auto;
        margin-bottom: 5px;
    }


    .message {
      
        
      
        background: #243C73;
        color: white;
        width: 50%;
        padding: 18px 10px;
        line-height: 26px;
        font-size: 16px;
        border-radius: 7px;
        margin-bottom: 30px;
        position: relative;
    }
    
  

      .message::after {
          bottom: 100%;
          left: 7%;
          border: solid transparent;
          content: " ";
          height: 0;
            width: 0;
            position: absolute;
            pointer-events: none;
            border-bottom-color: #243C73;
            border-width: 10px;
            
      }
      
      .message-data {
      margin-bottom: 15px;
    }
  
  
    .other-message {
      background: #243C73;
      
      
    }
    
    .other-message::after {
        border-bottom-color: #243C73;
        left: 93%;
         margin-left: -18px;
      }

      .my-message::after {
          margin-left: -3px;
      }
 
    
    
  

    ul {
    	list-style-type:none;
    }

     .align-right {
    	text-align: right;
      margin-left: 36.5%;
    }
    .float-right{
    	float: right;
    }
    .clearfix:after {
     
      display: block;
      font-size: 0;
      content: " ";
      clear: both;
      height: 0;
  }

  .blink_me {
  animation: blinker 1s linear infinite;
}

@keyframes blinker {  
  50% { background: red; }
}
</style>

<div id="chat_con" >
    {#if title} 
    <h3 style="text-align: center">{person.FULL_NAME}</h3>
    {/if}
    <ul>
        {#each chats as chat}
         <!-- content here -->
        {#if chat.incoming}
            <!-- <li>
               
                 <div class="message-data">
                    <span class="message-data-name"><img width="25" height="25" src="./assets/spartan_logo.webp" alt="Spartan">{person.FULL_NAME}</span>
                    <span class="message-data-time">10:12 AM, Today</span>
                </div>
                
                <div class="msgBubble" style="margin-left: 10px" >{chat.incoming}</div>
                
            </li> -->
            <li >
                <div class="message-data">
                        <span class="message-data-name"><i class="fa fa-circle online"></i>{person.FULL_NAME}</span>
                        <span class="message-data-time">10:12 AM, Today</span>
                        </div>
                        <div class="message my-message">
                            {chat.incoming}
                        </div>
    
            </li>
           
        {:else if chat.sender}
        
           <li class="clearfix">
                <div class="message-data align-right">
                        <span class="message-data-time" >10:10 AM, Today</span> &nbsp; &nbsp;
                        <span class="message-data-name" >{isMe.FULL_NAME}</span> <i class="fa fa-circle me"></i>
                        
                </div>
       
                <div class="message other-message float-right">
                    {chat.sender}
                </div>
    
            </li>
               

           
        {/if}
          

    
    {/each}
    </ul>
    
   

</div>
 <div class="input">
    <input on:focus={onSendMessage} on:keypress={onSendMessage} bind:value={message} class="inTicket" data-title="Full Address" data-section="Location Validation" id="full_address" type="text">
    <div class="button-group">
        <button on:click={onClearMSG}  class="button input-search-button"><span class="mif-bin"></span></button>
        <button on:click={onSendMessage}  class="button input-search-button">
            <span class="mif-chat-bubble"></span>
        </button>
   </div>
</div>
<span id="incoming">{incoming}</span>