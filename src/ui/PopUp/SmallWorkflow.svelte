<script>
    import {onMount} from "svelte";
    export let spartans;
    export let idTicket = [];
    export let sql;
    let users = [];

    onMount(() => {
        sql.getTicketWorkflow(idTicket).then((res) =>{
            console.log(res);
            console.log("WORKFLOW");
        });
    });

</script>
<ul>
    {#each users as user}
         <li>user</li>
    {/each}
</ul>