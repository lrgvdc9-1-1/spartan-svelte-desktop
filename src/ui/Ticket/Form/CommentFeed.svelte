
<script>
    import {onMount, createEventDispatcher} from "svelte";
   
    const dispatch = createEventDispatcher();
    export let ticketId;
    export let sql;
    export let socket;

    let messages = [];

    onMount(async() => {
        console.log(ticketId)
        sql.getTicketComFeed([ticketId]).then((res) => {
                console.log(res);
                messages = res.rows;
                dispatch('totalMSG', res.rowCount);
        });
    });

    function formatDate(date) {
        let month = (date.getMonth() < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();

        return `${month} - ${day} - ${year}`;
    }


</script>
<style>
    ul{
        list-style: none;
    }

    .grid-container {
        display: grid;
        grid-template-columns: 80% 20%;
    }
    .grid-item {
        padding: 2px;
    }
</style>
<ul>

    {#each messages as feed}
         <li>
            <div class="grid-container">
                <div class="grid-item" id="accountInfo">
                    <img width="40" height="40" src="./assets/spartan_logo.webp" alt="Icon" />
                    <span>{feed.first_name + " " + feed.last_name}</span>
                </div>
                
                <div class="grid-item" id="date">
                    <span class="mif-alarm"></span>
                    <span>{formatDate(feed.time_track)}</span>
                </div>
                <div id="msg">{feed.ticket_comments}</div>
            </div>
            <hr>
         </li>
    {/each}
    

</ul>