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
<div style="float: right;width: 10%;height:100vh;background: #243C73;">
    <ul>
        {#each items as item}
             <!-- content here -->
             <li>item</li>
        {/each}
    </ul>
</div>