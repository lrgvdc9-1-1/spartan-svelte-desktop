<script>
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    import Chat from './modal/Chat.svelte';
    
    export let ontickets;
    export let isMe;
    export let socket;

    const dispatch = createEventDispatcher();
    let windowSize = "30%";
    let bckWindow = "#243C73";

    $: spartans = ontickets;
    let height = 0;
   
    onMount(() => {
        // content here
        height = (document.body.clientHeight - 126) + "px";
        socket.on('notify', (data) => {
            onUpdate(data);
           
        });
    });

    function onUpdate(user) {
        var lng = ontickets.length;
        let holdIndex;
            for(var index = 0; index < lng; index++) {
                if(ontickets[index].socket_id == isMe.socket_id) {
                    ontickets[index].chat = false;
                }
                if(ontickets[index].socket_id == user.aboutme){
                    holdIndex = index;
                    ontickets[index].splash = true;
                    ontickets[index].chat  = true;
                     let window = remote.getCurrentWindow();
                     window.flashFrame(true);
                    break;
                }
            }

            setTimeout(() => {
                ontickets[holdIndex].splash = false;
                holdIndex = 0;
            }, 1000);
    }


    function onChat(index) {
        let spartan = ontickets[index];
        if(isMe.user_id != spartan.user_id) {
                ontickets[index].chat = true;
                socket.emit("notify", {socketid: spartan.socket_id, aboutme: isMe.socket_id});
        }
        
    }

    function onClose() {
        dispatch('resize', {
			size: '96%'
		});
        windowSize = "4%";
        bckWindow = "#051740";
    }
    function onResize() {
        dispatch('resize', {
			size: '70%'
		});
        windowSize = "30%";
        bckWindow = "#243C73"
    }

    function onFullScreen() {
         dispatch('resize', {
			size: '100%'
        });
        windowSize = "0%";
    }
</script>
<style>
    ul{
        list-style: none;
    }
    .name {
        color: #CAB448;
    }
    .tool-button {
        background: #243C73 !important;
        color: white;
    }
    #close-button:hover {
    background: #E81123;
  }

  #titlebar  {
    display: grid;
    grid-template-columns: 85% auto;
  }

  #titleGrid {
      grid-column: 1;
    display: flex;
  }
  #grid2{
      grid-column: 10;
    display: flex;
    margin-top: 4px;
  }
  h4{
      margin: auto;
     
  }
  h2 {
      writing-mode: vertical-lr;
      width: 100%;
      height: auto;
      margin-right: 50px;
      transform: scale(-1);
      letter-spacing: 10px;
  }

  .blink {
  animation: blinker 1s linear infinite;
}

@keyframes blinker {  
  50% { background: red; }
}

  @media only screen and (max-width: 1800px) {
  #titlebar {
     grid-template-columns: 75% auto;
  }

   #grid2{
       margin-left: 25px;
   }
}
</style>

 <div id="wrapperRight" style="float: right; width: {windowSize};background: {bckWindow}; border-top: 2px solid #CAB448; height:100vh;">
    {#if windowSize == "4%"}
        <!-- content here -->
        
            <button on:click={onResize} class="button secondary">
                <span class="mif-arrow-left"></span>
            </button>
            <h2>Ticket Viewers</h2>
        
    {:else}
    <!-- <div  style="float: right;width: {windowSize};height:100vh;background: #243C73;overflow:auto;"> -->
            <div style="width: 100%;height: 40px; background: #051740; border-top: 2px solid #CAB448;">
                <header id="titlebar">
                        <div id="titleGrid">

                            <h4>Ticket Viewers</h4>
                        </div>
                    
                        <div id="grid2"  data-role="buttongroup"
                        data-mode="multi">
                            <!-- <button  class="tool-button rounded">
                                <span class="mif-arrow-up-right"></span>
                            </button> -->
                            <button on:click={onClose} class="tool-button rounded" id="close-button">
                                <span class="mif-exit"></span>
                            </button>
                        </div>
                </header>

            
            </div>
            <ul>
                {#each spartans as spartan, i}
                    <!-- content here -->

                    {#if isMe.UID != spartan.UID}
                        <!-- content here -->
                        <li>
                        <div class="card" class:blink={spartan.splash}>
                            <div class="card-header" class:blink={spartan.splash}>
                                <div class="avatar">
                                    <img alt="Logo" src="./assets/spartan_logo.webp">
                                </div>
                                <div class="name">{spartan.FULL_NAME}</div>
                            </div>
                            <div style="color:#CAB448; " class="card-content">
                
                                {#if !spartan.chat} 
                                <table class="table">
                                    <tr>
                                        <td>Form Tab</td>
                                        <td>{spartan.editing.section}</td>
                                    </tr>
                                    <tr>
                                        <td>Input Selected</td>
                                        <td>{spartan.editing.attribute}</td>
                                    </tr>
                                </table>
                                {:else if spartan.chat} 
                                        <Chat {socket} {isMe} person={spartan}/>
                                {/if}
                            </div>
                            <div class="card-footer">
                                <button on:click={()=> {onChat(i);}} class="button secondary">Chat</button>
                            </div>
                        </div>

                    </li>
                    {/if}
                    
                {/each}
            </ul>

{/if}
</div>



