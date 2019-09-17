<script>
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    import Chat from './modal/Chat.svelte';
    
    export let ontickets;
    export let isMe;
    export let socket;

    const dispatch = createEventDispatcher();
    let windowSize = "30%";

    $: spartans = ontickets;
    let height = 0;
   
    onMount(() => {
        // content here
        height = (document.body.clientHeight - 126) + "px"
    });


    function onChat(index) {
        let spartan = ontickets[index];
        if(isMe.user_id != spartan.user_id) {
                ontickets[index].chat = true;
        }
        
    }

    function onClose() {
        dispatch('resize', {
			size: '98%'
		});
        windowSize = "2%";
    }
    function onResize() {
        dispatch('resize', {
			size: '70%'
		});
        windowSize = "30%";
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
      grid-column: 2;
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

  @media only screen and (max-width: 1800px) {
  #titlebar {
     grid-template-columns: 75% auto;
  }

   #grid2{
       margin-left: 25px;
   }
}
</style>
{#if windowSize == "2%"}
     <!-- content here -->
     <div style="float: right; width: {windowSize};background: #051740; border-top: 2px solid #CAB448; height:100vh;">
        <button on:click={onResize} class="button secondary">
            <span class="mif-arrow-left"></span>
        </button>
        <h2>Ticket Viewers</h2>
     </div>
{:else}
    <div style="float: right;width: {windowSize};height:100vh;background: #243C73;overflow:auto;">
    <div style="width: 100%;height: 40px; background: #051740; border-top: 2px solid #CAB448;">
        <header id="titlebar">
                <div id="titleGrid">

                     <h4>Ticket Viewers</h4>
                </div>
               
                <div id="grid2"  data-role="buttongroup"
                data-mode="multi">
                    <button  class="tool-button rounded">
                        <span class="mif-arrow-up-right"></span>
                    </button>
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
                <div class="card">
                    <div class="card-header">
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
</div>
{/if}
