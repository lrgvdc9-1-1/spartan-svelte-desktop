<script>
    import {onMount, onDestroy} from "svelte";
    import { fade } from 'svelte/transition';
    export let elemString;
    let element;
    let show = false;

    onMount(() => {
        
        if(elemString) {
            
            element = document.getElementById(elemString);
            element.addEventListener("scroll", handleScrollElem);
        }

    });

    onDestroy(() => {
        if(element) element.removeEventListener("scroll", handleScrollElem);
    });

    function handleScrollElem() {
        //console.log(this.scrollTop);
        if(this.scrollTop == 0) {
            show = false;
        }else{
            show = true;
        }
    }

    function onScrollUp() {
        if(element) element.scrollTo(0, 0);
    }

</script>

<style>

    #con {
        position: relative;
        top: -53px;
        left: 94%;
        width: 10px;
    }
</style>

{#if show}
    <div id="con" transition:fade>
        <button on:click="{onScrollUp}" class="action-button">
            <span class="icon"><span class="mif-arrow-up"></span></span>
        </button>
    </div>
{/if}

