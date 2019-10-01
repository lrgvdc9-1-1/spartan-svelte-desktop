<script>
    import {onMount} from "svelte";
    import {Months, WeekDays, CalendarPage} from '../utils/Months.js';
    import Week from './Week.svelte';
    import { fade } from 'svelte/transition';

    export let eleId;
    
    let enable = false;
    let today = new Date();
    let choosen = null;
    let redrawing = false;
    let calendars = [];
    let element;
    let slotElement;

    let moveUp = false;
    
    

    $: formatDate = (choosen) ? format(): null;
    $: MonthTitle = Months[today.getMonth()] + " " + today.getFullYear();
   
   
    onMount(()=> {
        
        if(eleId) {
            slotElement = document.getElementById(eleId);
            setTimeout(() => {
                
                if(slotElement.value) {
                    let splits = slotElement.value.split("-");
                    console.log(splits);
                    choosen = (splits.length == 3)  ? new Date(parseInt(splits[0]), 
                    parseInt(splits[1]), parseInt(splits[2])) : null;
                    console.log(choosen);
                }
            }, 200);
        }
    });


    function format() {
        let month = (choosen.getMonth() + 1) ;
        let day = (choosen.getDate() < 10) ? "0" + choosen.getDate() : choosen.getDate();
        month = (month < 10) ? "0" + month : month;

        return choosen.getFullYear() + "-" + month + "-" + day;
    }



    function clickGoBackWards() {
        let month = today.getMonth() - 1; 
        let year = today.getFullYear();
        today = new Date(year, month, 1);
        
        calendars =  [[], [], [], [], [], []]; //reset..
        reDraw()
    }
    function clickGoFoward(){
        let month = today.getMonth() + 1;
        let year = today.getFullYear();
        today = new Date(year, month, 1);
        
        calendars =  [[], [], [], [], [], []]; //reset..
        reDraw()
    }


    function getDaysBackwards(date, month) {
        var today   = new Date(date);
        var number = date.getDay();
        var days = [];
        for(var x = 0; x < number; x++) {
            var cutDays = number - x;
            today.setDate(today.getDate() - cutDays);
            days.push(new CalendarPage(new Date(today), month));
            days[x].checkChoosen(choosen);
            today = new Date(date);            
        }
        
        return days;
    }

    function daysInMonth(iMonth, iYear) 
    { 
      return 32 - new Date(iYear, iMonth, 32).getDate();
    }

    function getDaysInMonth(today, lastDay) {
        var date = new Date(today);
        var month = date.getMonth();
        var lastDay = new Date(lastDay); 
        var calendars = [[], [], [], [], [], []];
        var row = 0;
        if(date.getDay() > 0) {
            calendars[0] = getDaysBackwards(date, month);
            
        }
        while (row < 6) {

            if(calendars[row].length < 7) {
                
                calendars[row].push(new CalendarPage(new Date(date), month));
                var col = calendars[row].length - 1;
                if(col > -1)
                {calendars[row][col].checkChoosen(choosen);}
                date.setDate(date.getDate() + 1);
             }

             if(calendars[row].length == 7) {
                 row++;
             }  
        }
        return calendars;
   }

   async function reDrawFromBeg() {
        moveUp = checkBottom();
        calendars = [[], [], [], [], [], []]; //reset..
        today = new Date(choosen.getFullYear(), choosen.getMonth(), 1);
        calendars = await getDaysInMonth(today, new Date(today.getFullYear(), today.getMonth(), daysInMonth(today.getMonth(), today.getFullYear())));       
   }

   async function reDraw() {
         moveUp = checkBottom();

        
        redrawing = false;
        setTimeout(() => {
            today = new Date(today.getFullYear(), today.getMonth(), 1);
            calendars =  getDaysInMonth(today, new Date(today.getFullYear(), today.getMonth(), daysInMonth(today.getMonth(), today.getFullYear())));
            redrawing = true;
           
        }, 50);

        
   }


   function handleChoosen(row, event) { 
        let date      = event.detail.getDate();
        choosen = new Date(date);
        //Reset all the calendar to false
         var rowsLength = calendars.length;
        //Loop through all calendars and reset..
        for(var x = 0; x < rowsLength; x++) {
            var length = calendars[x].length;
            for(var y = 0; y < length; y++){
                //Only if choosen is true..
                if(calendars[x][y].choosen){
                    calendars[x][y].choosen = false;
                }
            }
        }
        //Finally Select the new date to highlight in the calendar..
        calendars[row][event.detail.index].choosen = true;
   }

   function checkBottom() {

       if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
           return true;
       }

       return false;
    }

   


</script>


<div class="input">
    <slot sl={sl}></slot>                               
    <div class="button-group">
        {#if choosen}   
            <button class:btn={enable} on:click="{() => {enable = !enable;reDrawFromBeg();}}" 
            class="button primary  outline">{formatDate}</button>
        {:else }
            <button class:btn={enable} on:click="{() => {enable = !enable;reDraw();}}" 
            class="button primary  outline">Choose Date</button>
        {/if}                         
    </div>
                                
</div>


{#if enable}
    <div bind:this={element} class:wrapperUp={moveUp} transition:fade class="wrapper contents">

        <div class="cal">
             <div class="heading-section">
            <div class="control">
                <span on:click={clickGoBackWards} class="mif-chevron-thin-left"></span>
            </div>
            <div class="label">{MonthTitle}</div> 
            <div class="control">
                    <span on:click={clickGoFoward} class="mif-chevron-thin-right"></span>
            </div>
            </div>
            <div class="legend">
                <div class="week">
                    {#each WeekDays as day}
                        <div class="week-day">{day}</div>
                    {/each}
                </div>
            </div>
            {#if redrawing}
                 <div class="month-container">
                    {#each calendars as page, i}
                        <!-- content here -->
                        <Week on:selected="{(event)=> {handleChoosen(i, event)}}"  days={page} />
                    {/each}
                </div>
            {/if}
            
        </div>
       
        
    </div>
{/if}

<style>
    .wrapper {
        position: absolute;
        width: 450px;
        height: 450px;
        z-index: 3;
        border-radius: 10px;
        box-shadow:0px 10px 26px rgba(0,0,0,0.4);
        padding:15px;max-width:100%;margin:0 auto;
        background: white;
    }

    .wrapperUp {
        bottom: 70px;
    }

    .label {
        cursor: pointer;
    }
    .heading-section {
        font-size: 20px;
        padding: 24px 15px;
        display: flex;
        justify-content: space-between;
        color: #3d4548;
        font-weight: bold;
    }
    .control {
        opacity: 1;
        cursor: pointer;
    }

    .btn {
        background: #024ea4;
        color: #fff !important;
    }

    .week {  
        display:grid;
        
        grid-auto-flow: dense;
        grid-gap: 10px;
        grid-template-columns: repeat(7, 50px);
    }
   

    .legend {
        color: #4a4a4a;
    padding: 10px 0;
    margin-bottom: 5px;
    left: 12px;
    }

    .cal {
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        user-select: none;
        padding: 10px;
        padding-top: 0;
    }
    .month-container {
            width: 100%;
            display: -ms-grid;
            display: grid;
    }

    

</style>

