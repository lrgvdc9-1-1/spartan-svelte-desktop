<script>
    import { onMount, onDestroy } from 'svelte';
    export let items;
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
</style>
<div style="float: right;width: 15%;height:100vh;background: #243C73;">
    <ul>
        {#each items as item}
             <!-- content here -->
             <li>
                <div class="card">
                    <div class="card-header">
                        <div class="avatar">
                            <img src="http://lorempixel.com/68/68/people/">
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