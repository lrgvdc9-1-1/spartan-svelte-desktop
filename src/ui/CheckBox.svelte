<script>
    import { createEventDispatcher } from 'svelte';
    import { tick } from 'svelte';
    export let checkDefaultValue

    $:box = (checkDefaultValue) ? makeDecision() : '';
    
    const dispatch = createEventDispatcher();
    let CheckBox;

    async function makeDecision() {
        if(CheckBox) {
            await tick();
            CheckBox.checked = checkDefaultValue;
        }
    }

</script>

<div class="form-group">
        <label class="checkbox transition-on" for="checkbox-1560538972596983">
        <input type=checkbox bind:this={CheckBox}  >
        <span on:click={()=>{ CheckBox.checked = !CheckBox.checked; dispatch("checkmark", {value: CheckBox.checked})}} class="check"></span>
        <span class="caption">View Map</span>
        </label>
</div>