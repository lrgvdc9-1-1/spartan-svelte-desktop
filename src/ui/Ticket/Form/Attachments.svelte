<script>
    import {onMount, createEventDispatcher} from 'svelte';
    import Confirm from '../../modal/Confirm.svelte';
    
    export let ticketId;
    export let url;
    export let sql;

     const dispatch = createEventDispatcher();

    let attachments = [];
    let confirm = false;
    let select = null;
    let dragover = false;


    onMount(() => {

     
    });

    function onFetch() {
     
        sql.getAttachments([ticketId]).then((res) => {
               attachments= res.rows;
               dispatch('totalMSG', res.rowCount);
               dispatch('loading', false);
        }).catch((error) => {console.log(error)});
    }

    function format(file) {

        let handle = file.replace(".pdf", ".jpg").replace(".docx", ".jpg").replace(".doc", ".jpg");
        return `https://gis.lrgvdc911.org/php/spartan/api/v2/index.php/addressticket/displayPic/?path=${handle}`;
    }

    async function onOpen(file) {
          const response = await fetch(`https://gis.lrgvdc911.org/php/spartan/api/v2/index.php/addressticket/getFileBase64/?path=${file}`);
          const result = await response.json();
          await ipc.send('SvelteAlive', {"action" : "open","fname": file, "content" : result['content']});
          
          setTimeout(() => {
               dispatch('loading', false);
         
          }, 200);
         
    }

    async function onDelete() {
        dispatch('loading', true)
        confirm = false;
        let data = {"data" : select['file_name']};
        const response = await fetch(`https://gis.lrgvdc911.org/php/spartan/api/v2/index.php/addressticket/deleteAttachment`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(data)
        })


        dispatch('loading', false)
        onFetch();
        
    }

    async function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
         dispatch('loading', true);
         var data = new FormData();
         data.append('objectid', ticketId);
        dragover = false;

        //Loop through the files and upload them...
        for (let f of e.dataTransfer.files) {
            data.append('images[]', f, f.name);

       
        }


        const response = await fetch('https://gis.lrgvdc911.org/php/spartan/api/v2/index.php/addressticket/uploadAttachments/', 
        {
            method: 'POST',
            body: data
        });

        const json = await response.json();
        console.log(json);

        onFetch();
        

    }

    function handleError(e) {
        //Get the target to replace the image since it failed...
        let target = e.target;
        //Replace image..
        target.src = "./assets/NoImageAvailable.png";
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

     @keyframes shadow-pulse
    {
            0% {
                box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
            }
            100% {
                box-shadow: 0 0 0 35px rgba(0, 0, 0, 0);
            }
    }

    .isdragover {
        background: #05173F;
        color: white;
        border: 1px dashed;
         animation: shadow-pulse 1s infinite;
    }
</style>
<svelte:window  on:onTicketUpdate={onFetch}></svelte:window>

{#if attachments.length == 0}
         
        <div on:dragover|preventDefault|stopPropagation="{()=>{dragover = true}}" on:drop={handleDrop} on:dragleave="{()=>{dragover = false}}"
             class:isdragover={dragover}
             style="border: 1px dashed;line-height:100px; vertical-align:middle; width: 100%; height: 400px;text-align: center;">
                <h2>Drag and Drop File</h2>
        </div>
        
{/if}

{#if attachments.length > 0}
    <div on:dragover|preventDefault|stopPropagation="{()=>{dragover = true}}" on:drop={handleDrop} on:dragleave="{()=>{dragover = false}}" class:isdragover={dragover}  class="container gridDash">

    {#if confirm}
         <Confirm on:close="{()=> {confirm = false;}}" on:confirm={onDelete} title="Delete File" msg="Are you sure!!!" />
    {/if}

    
    {#each attachments as ticket, i}
        <div  class="info-panel rounded no-overflow shadow-3">
                        <div class:breakWord={ticket.file_name.length > 25} style="background: #243C73" class="info-panel-header fg-white">{ticket.file_name}</div>
                        <div class="info-panel-content">
                            <div  class="img-container">
                                <img alt="File" on:error={handleError} src="{format(ticket.file_name)}">
                                <div class="image-overlay op-amber"></div>
                            </div>
                           
                        </div>
                        <div class="info-panel-footer">
                             <button type="button" on:click="{(event)=> { dispatch('loading', true); onOpen(ticket.file_name)}}" 
                                class="button large outline success rounded">
                                   Open
                                </button>
                             <button on:click="{()=>{confirm= true;select = ticket;}}" class="button large outline alert rounded">Delete</button>
                        </div>
                    </div>
    {/each}

</div>
{/if}
