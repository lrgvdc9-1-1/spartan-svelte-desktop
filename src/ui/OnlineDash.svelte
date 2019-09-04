<script>
    import { onMount, onDestroy } from 'svelte';
    export let onticket;
    let height = 0;
   
    onMount(() => {
        // content here
        height = (document.body.clientHeight - 126) + "px"
    });
</script>
<style>
    ul{
        list-style: none;
    }
    .name {
        color: #CAB448;
    }
</style>
<div style="float: right;width: 15%;height:100vh;background: #243C73;">
    <ul>
        {#each onticket as spartan}
             <!-- content here -->
             <li>
                <div class="card">
                    <div class="card-header">
                        <div class="avatar">
                            <img alt="Logo" src="./assets/spartan_logo.webp">
                        </div>
                        <div class="name">Employee</div>
                    </div>
                    <div class="card-content">
                        <p>Content</p>
                    </div>
                </div>

             </li>
        {/each}
    </ul>
</div>