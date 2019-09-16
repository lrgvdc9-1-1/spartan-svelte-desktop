<script>
    export let message = "ONLINE";
    export let Audio;
    $: color = (message.includes("ONLINE")) ? "green" : "red";
</script>

<style>
    #bottom {
        position: absolute;
        padding: 4px;
        bottom: 0;
        height: 40px;
        width: 100%;
        background: #05173F;
        border-top: 2px solid #CAB448;
    }
</style>

<div id="bottom">
    <span class="mif-database"></span>
    <span style="color: {color}">SERVER STATUS: {message}</span>
</div>