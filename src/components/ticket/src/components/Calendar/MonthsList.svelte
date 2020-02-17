<script>
    import {MonthsAbbre} from '../../utils/Months';
    let appear = false;
    export function onShow() {
        appear = true;
    }
    export function onHide(){
        appear = false;
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
            {#each MonthsAbbre as month}
                <li>{month}</li>
            {/each}
        </ul>
</div>