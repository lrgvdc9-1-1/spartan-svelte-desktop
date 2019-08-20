<script>
   import { onMount, onDestroy, createEventDispatcher } from 'svelte';
   export let title;

   const dispatch = createEventDispatcher();
   let window;
   let header;


   let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
    onMount(async () => {
        start();
    })


  function start() {
    if (header) {
        /* if present, the header is where you move the DIV from:*/
        header.onmousedown = dragMouseDown;
    } 
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    window.style.top = (window.offsetTop - pos2) + "px";
    window.style.left = (window.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }


</script>

<style>
    .window {
        position: absolute;
        z-index: 3;
        border: 4px  solid #CAB448;
        padding: 5px;
        width: 95%;
        height: 80%;
        background: #f8f8f8;
        resize: both;
        overflow: auto;
        border-radius: 4px;
    }
   
    .window-content {
        overflow: hidden !important;
    }

    
    
</style>

<div  bind:this={window} class="window">
    <div bind:this={header} style="cursor: move;" class="window-caption">
        <span class="icon mif-windows"></span>
        <span class="title">{title}</span>
        <div class="buttons">
            <span class="btn-min"></span>
            <span class="btn-max"></span>
            <span on:click="{()=>{dispatch("close", false)}}" class="btn-close"></span>
        </div>
    </div>
    <div class="window-content">
        <slot></slot>
    </div>
</div>