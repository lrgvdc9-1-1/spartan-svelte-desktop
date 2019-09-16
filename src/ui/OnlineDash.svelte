<script>
    import { onMount, onDestroy } from 'svelte';
    import Chat from './modal/Chat.svelte';
    
    export let ontickets;
    export let isMe;
    export let socket;

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
</style>
<div style="float: right;width: 30%;height:100vh;background: #243C73;overflow:auto;">
    <div style="width: 100%;height: 40px; background: #051740; border: 2px solid #CAB448;">
        <div class="toolbar" style="float: right;" data-role="buttongroup"
        data-mode="multi">
            <button class="tool-button rounded">
                  <span class="mif-arrow-up-right"></span>
            </button>
            <button class="tool-button rounded" id="close-button">
                <span class="mif-exit"></span>
            </button>
        </div>
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