
<script>  
    export let src;
    let iframe;
</script>
<style>
 
</style>

<iframe bind:this={iframe} id="iframe-view" title="Web" height="100%" width="100%" {src} name="help"></iframe>