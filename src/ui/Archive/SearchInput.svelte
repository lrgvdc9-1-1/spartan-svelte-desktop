 <script>
    import {createEventDispatcher} from "svelte";
    export let title;
    let inValue;

    const dispatch = createEventDispatcher();

    function clearInput() {
        inValue = "";
    }

    function onEnter() 
    {
        dispatch('search',inValue);
    }
    function onKeyDown(e) {
        
        if(e.keyCode == 13){
            onEnter();
        }
    }
 </script>
 <div class="input">
    <input type="text" on:keydown={onKeyDown} bind:value={inValue} placeholder="{title}" data-role="input" data-search-button="true" data-role-input="true" class="">
    <div class="button-group">
        <button on:click="{clearInput}" class="button input-clear-button" tabindex="-1" type="button">
        <span class="default-icon-cross"></span>
        </button>
        <button on:click="{onEnter}" class="button input-search-button" tabindex="-1" type="submit">
        <span class="default-icon-search"></span>
        </button>
    </div>
</div>
             