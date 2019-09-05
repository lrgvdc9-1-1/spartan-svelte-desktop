<script>
    import { onMount, onDestroy } from 'svelte';
    import Chat from './modal/Chat.svelte';
    export let ontickets;

    $: spartans = ontickets;
    let height = 0;
   
    onMount(() => {
        // content here
        height = (document.body.clientHeight - 126) + "px"
    });


    function onChat(index) {
        console.log(index);
        console.log(ontickets[index]);
        ontickets[index].chat = true;
    }
</script>
<style>
    ul{
        list-style: none;
    }
    .name {
        color: #CAB448;
    }
</style>
<div style="float: right;width: 30%;height:100vh;background: #243C73;">
    <ul>
        {#each spartans as spartan, i}
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
                                <Chat person={spartan.FULL_NAME}/>
                        {/if}
                    </div>
                    <div class="card-footer">
                        <button on:click={()=> {onChat(i);}} class="button secondary">Chat</button>
                    </div>
                </div>

             </li>
        {/each}
    </ul>
</div>