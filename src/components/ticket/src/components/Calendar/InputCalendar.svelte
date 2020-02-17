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

  let timeout;
  
  onMount(() => {
    inputMask = IMask(input, {mask: Date, pattern: 'Y-`m-`dd',  // Pattern mask with defined blocks, default is 'd{.}`m{.}`Y'
  // you can provide your own blocks definitions, default blocks for date mask are:
  // blocks: {
  //   d: {
  //     mask: IMask.MaskedRange,
  //     from: 1,
  //     to: 31,
  //     maxLength: 2,
  //   },
  //   m: {
  //     mask: IMask.MaskedRange,
  //     from: 1,
  //     to: 12,
  //     maxLength: 2,
  //   },
  //   Y: {
  //     mask: IMask.MaskedRange,
  //     from: 1900,
  //     to: 9999,
  //   }}
    });
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
     inputMask.value = e.detail.parse;
     display = e.detail.date;
     choosen = e.detail.date;
  }

  //Click input show or hide Calendar Picker..
  function handleClick(e) {
    show = !show;
  }

  
  function handleChoosen(e){

      //Clear the Timeout because we press button
      clearTimeout(timeout);
      inputMask.value = e.detail.parse;
      choosen = e.detail.date;
      display = e.detail.date;
      inputMask.updateValue();

  }

</script>
<input bind:this={input} on:picker={handlePicker} on:click|preventDefault={handleClick} class="{clazz}" data-title="{title}" data-section="{section}"  id="{id}" type="{type}" />
{#if show}
    <CalendarPicker  on:close="{(e)=>{show = e.detail}}" on:choosen={handleChoosen} footer={true} popup={true} {choosen} {display}  />
{/if}
