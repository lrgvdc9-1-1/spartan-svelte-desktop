<script>
    export let person;
</script>

<style>
    #chat_con {
        width: auto;
        height: 140px;
        overflow: auto;
    }
    .msgBubble {
        border-radius: 4px;
        text-align: center;
        padding: 3px;
        background: #243C73;

    }

</style>

<div id="chat_con">
    <h3 style="text-align: center">{person}</h3>
    <div  style="float: left;width: 100%;display: flex;">
        <img width="25" height="25" src="./assets/spartan_logo.webp" alt="Spartan">
        <div class="msgBubble" style="margin-left: 10px" >HELLO WUEY</div>
    </div>

    <div class="msgBubble" style="float: right; margin-right: 10px;">Message</div>

</div>