<script>
    import { fade } from 'svelte/transition';
    import {onMount} from "svelte";
    import {Months, WeekDays, CalendarPage} from '../utils/Months.js';
    import Week from '../ui/Week.svelte';
    export let router;
    let element;
    let today = new Date();
    let moveUp = false;
    let choosen = null;
    let redrawing = false;
    let calendars = [];
    $: MonthTitle = Months[today.getMonth()] + " " + today.getFullYear();


    onMount(() => {


           redrawing = false;
        setTimeout(() => {
            console.log(today);
            today = new Date(today.getFullYear(), today.getMonth(), 1);
            calendars =  getDaysInMonth(today, new Date(today.getFullYear(), today.getMonth(), daysInMonth(today.getMonth(), today.getFullYear())));
            redrawing = true;
            console.log(calendars);
            console.log(`calendars size = ${calendars.length}`);
           
        }, 50);

    });


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


</script>
    <h2>HELLOW</h2>
    <div class="container" style="height:100vh;">
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
                <div class="month-container">
                    <div class="week">
                        
                            {#each WeekDays as day}
                                <div class="day">
                                    <button class="button week-day">{day}</button>
                                </div>
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
    </div>
    

   




<style>
    .wrapper {
        position: absolute;
        width: 800px;
        height: 700px;
        z-index: 3;
        color: red;  
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


    .control:hover {
        border-radius: 8px;
        color: white;
        background: #3d4548;
        opacity: 0.8;
    }


    .day {
        margin: 2px;
        color: #4a4a4a;
        font-weight: bold;
        text-align: center;
        font-size: 16px;
        flex: 1 0 auto;
        height: auto;
        display: flex;
        flex-basis: 0;

        text-align: center;
    }

    .week {  
        display:grid;
        
        
        grid-gap: 8px;
        
        grid-template-columns: repeat(7, 100px);
    }

    .week-day {

        width: 100%;
        background: transparent;
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