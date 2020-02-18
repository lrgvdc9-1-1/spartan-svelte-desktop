<script>
    import {MonthsAbbre} from '../../utils/Months';
    let appear = false;
    export function onShow() {
        appear = true;
    }
    export function onHide(){
        appear = false;
    }
    function onSelected(e){
        let target = e.target || e.srcElement;
        console.log(target.dataset);
    }
</script>
<style>
   .appear{
        left: 120px;
        display: block;
   }
   .disappear{
        display: none;
   }
</style>
<div class:appear={appear} class="calendar-months">
        <ul class="months-list">
            {#each MonthsAbbre as month, i}
                <li on:click={onSelected} data-index={i} data-month={month}>{month}</li>
            {/each}
        </ul>
</div>