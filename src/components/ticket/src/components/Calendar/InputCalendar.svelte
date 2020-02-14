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

  //Once the input has been performed from Spartan Ticket
  //Controller it will Emit Custom handler..
  function handlePicker(e) {
     display = e.detail;
     choosen = e.detail;
  }

  //Click input show or hide Calendar Picker..
  function handleClick(e) {
    show = !show;
  }

  //Lose focus on input close Calendar Picker..
  function handleBlur(){
   show = false;
  }

  function handleChoosen(e){
      input.value = e.detail;
  }

</script>
<input bind:this={input} on:blur={handleBlur} on:picker={handlePicker} on:click={handleClick} class="{clazz}" data-title="{title}" data-section="{section}"  id="{id}" type="{type}" />
{#if show}
    <CalendarPicker on:choosen={handleChoosen} popup={true} {choosen} {display}  />
{/if}
