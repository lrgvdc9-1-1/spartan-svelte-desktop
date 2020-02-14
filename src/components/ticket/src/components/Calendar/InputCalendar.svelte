<script>
  import CalendarPicker from "./CalendarPicker.svelte";
  import {onMount, onDestroy} from "svelte";
  import IMask from 'imask';
  export let clazz;
  export let title;
  export let section;
  export let id;
  export let type;

  let display;
  let choosen;
  let input;

  let show = false;
  let inputMask;
  
  onMount(() => {
    inputMask = IMask(input, {mask: Date, pattern: 'Y-`m-`d'});
  });

  onDestroy(() => {
  //Destroy the event listner..
  });

  export function setDate(picker){
  display = picker;
  };


  function handlePicker(e) {
  console.log(e);
  console.log("ON INPUT WHAT WHAT...");
  display = e.detail;
  choosen = e.detail;

  }

  function handleClick(e) {
  show = !show;
  }
  function handleBlur(){
  show = false;
  }

</script>
<input bind:this={input} on:blur={handleBlur} on:picker={handlePicker} on:click={handleClick} class="{clazz}" data-title="{title}" data-section="{section}"  id="{id}" type="{type}" />
{#if show}
    <CalendarPicker popup={true} {choosen} {display}  />
{/if}
