 <script>
    import {createEventDispatcher} from "svelte";
    let display = 'none'
    const dispatch = createEventDispatcher();
    export function onToggle() {
        display = (display == 'none') ? 'block' : 'none';
    }
    export function onClose() {
        display = 'none'
    }
    function onSpitOut(e) {
        dispatch("spit", e);
    }
    
 </script>
 
 <style>
 .arrow_box {
        position: absolute;
        box-shadow: 0 0 20px 0 rgba(0,0,0,.5);
        background: white;
        border: 4px solid #024775;
        z-index:2;
    }
   
    
 </style>



<div class="arrow_box" style="display: {display}; left:85%; top:80px">
         <ul class="v-menu">
            <li on:click|preventDefault="{() => onSpitOut('REFRESH')}">
                <a href="/#"><span class="mif-download icon"></span> Refresh Archive</a></li>
            <li class="menu-title">Search</li>
            <li on:click|preventDefault="{() => onSpitOut('CALENDAR')}"><a href="/#" ><span class="mif-calendar icon"></span> Calendar</a></li>
            <li on:click|preventDefault="{() => onSpitOut('ORGA')}"><a href="/#"><span class="mif-library icon"></span> Organization</a></li>
        </ul>
</div>