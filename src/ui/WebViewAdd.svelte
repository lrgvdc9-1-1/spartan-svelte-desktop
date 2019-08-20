<script>
     import {createEventDispatcher} from 'svelte';

     let htmlValue = ''; 
     let htmlTitle = '';
     const dispatch = createEventDispatcher();


</script>
<form>
    <div class="form-group">
        <label>Enter URL</label>
        <input bind:value={htmlValue} type="text" placeholder="Enter Web Page"/>
    </div>
     <div class="form-group">
        <label>Enter Title</label>
        <input bind:value={htmlTitle} type="text" placeholder="Enter Title Page"/>
    </div>

    <div class="form-group">
        <button  on:click|preventDefault={()=>{dispatch('add',{activate: false, src: htmlValue, caption: htmlTitle})}} class="button">Submit</button>
        
    </div>
</form>