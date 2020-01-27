<script>
    import {onMount, createEventDispatcher} from "svelte";
    import { fade } from 'svelte/transition';
    export let title;
    export let msg;
    export let clsBig = true;
    export let clsSmall = false;
    export let clsError = false;
    export let noyes = true;

    const dispatch = createEventDispatcher();
    


    function onClose() {
        dispatch('close', false);
    }
</script>
<style>
    .big {
        position: absolute !important;
        top: 50%;
        left: 50%;
        width: 400px;
        height: 200px;
        margin-top: -100px;
        margin-left: -200px;
        z-index: 3;
    }

    .small {
        position: absolute !important;
        top: 50%;
        margin-top: -58px;
        margin-left: 4px;
        z-index: 3;
    }

</style>
<div transition:fade class="window"  class:small={clsSmall} class:big={clsBig}>
    <div class="window-caption" class:bg-red={clsError}>
        <span class="icon mif-info"></span>
        <span class="title">{title}</span>
        <div class="buttons">
         
            <span on:click={onClose} class="btn-close"></span>
        </div>
    </div>
    <div class="window-content p-2">
        {msg}
        <br>

        {#if noyes}
            <button on:click={onClose} class="button">No</button>
            <button on:click="{()=> {dispatch('confirm', true)}}" class="button primary">Yes</button>
        {/if}
    
    </div>
</div>