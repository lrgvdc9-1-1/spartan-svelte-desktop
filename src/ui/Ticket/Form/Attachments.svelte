<script>
    import {onMount, createEventDispatcher} from 'svelte';
    
    
    export let ticketId;
    export let url;
    export let sql;

     const dispatch = createEventDispatcher();

    let attachments = [];


    onMount(() => {
       
    });

    function onFetch() {
       console.log(ticketId);
        sql.getAttachments([ticketId]).then((res) => {
               attachments= res.rows;
               dispatch('totalMSG', res.rowCount);
        }).catch((error) => {console.log(error)});
    }

    function format(file) {


        return `https://gis.lrgvdc911.org/php/spartan/api/v2/index.php/addressticket/displayPic/?path=${file.replace("pdf", "jpg")}`;
    }

    async function onOpen(file) {
          const response = await fetch(`https://gis.lrgvdc911.org/php/spartan/api/v2/index.php/addressticket/getFileBase64/?path=${file}`);
          const result = await response.json();
          await ipc.send('SvelteAlive', {"action" : "open","fname": file, "content" : result['content']});   
    }

</script>
<style>
    .gridDash {
        padding-left:10%;
		display: grid;
		 grid-template-columns: repeat(7, 30%);
        grid-gap: 2%;
	}

    .breakWord {
        overflow-wrap: break-word;
        word-wrap: break-word;
        white-space: normal;
    }

    .img-container:hover {
        cursor: pointer;
    }
</style>
<svelte:window on:onTicketUpdate={onFetch}></svelte:window>

<h3>Attachments</h3>
<div class="container gridDash">
    {#each attachments as ticket, i}
        <div class="info-panel rounded no-overflow shadow-3">
                        <div class:breakWord={ticket.file_name.length > 25} style="background: #243C73" class="info-panel-header fg-white">{ticket.file_name}</div>
                        <div class="info-panel-content">
                            <div  class="img-container">
                                <img alt="File" src="{format(ticket.file_name)}">
                                <div class="image-overlay op-amber"></div>
                            </div>
                           
                        </div>
                        <div class="info-panel-footer">
                             <button type="button" on:click="{(event)=> {console.log(event); onOpen(ticket.file_name)}}" class="button large outline success rounded">Open</button>
                             <button class="button large outline alert rounded">Delete</button>
                        </div>
                    </div>
    {/each}

</div>