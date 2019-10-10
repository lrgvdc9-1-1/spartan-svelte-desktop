<script>
    import {FormatDate} from '../../../utils/Months.js';
    import {createEventDispatcher} from "svelte";

    export let elePropId;
    export let ticketNum;
    export let taxAccount;
    export let phoneNumOne;
    export let phoneNumTwo;
    export let sql;
    
    const dispatch = createEventDispatcher();
    
    let connections = [];

    $: total = (connections) ? dispatch('totalMSG', connections.length) : 0;

    export function onLookUp() {
        //Reset the connections since we going to look up at everything..
        connections = [];
        if(elePropId.value) {
          
            sql.getTicketConnPropertyId([ticketNum, elePropId.value]).then((res) => {
                   
                    if(res.rows.length > 0) {
                        connections = res.rows.concat(connections);
                       
                    }
            }).catch((error) => {
                
            })
        }

        if(phoneNumOne.value) {
            let split = phoneNumOne.value.replace(/[()]/g, '').split('-');
            split[0] = split[0].replace(' ', '%');
            let tele = `%${split[0]}%${split[1]}%`;

            if(tele.length < 5) {return;} //Cancel the query..
             sql.getRelTelePhone([ticketNum, tele]).then((res) => {
                     if(res.rows.length > 0) {
                        connections = res.rows.concat(connections);
                       
                    }
            });
           
            
        }

        if(phoneNumTwo.value) {
            phoneNumTwo.value = phoneNumTwo.value.replace(/[()]/g, '');
            console.log(phoneNumTwo.value);
        }
    }

 

</script>


<svelte:window on:queryForm={onLookUp}></svelte:window>
<button on:click={onLookUp} class="button primary large">Refresh Connections</button>
<table class="table">
    <thead>
    <tr>
        <th>#</th>
        <th>Created Date</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Full Address</th>
        <th>Property Id</th>
        <th>Subdivision</th>
        <th>Relation</th>
    </tr>
    </thead>
    <tbody>
        {#each connections as con}
             <tr>
                <td>
                   <span>{con.objectid}</span> 
                </td>
                <td>{FormatDate(con.created_date)}</td>
                <td>{con.cfirst_name}</td>
                <td>{con.clast_name}</td>
                <td>{con.full_address}</td>
                <td>{con.property_id}</td>
                <td>{con.subdivision}</td>
                <td>{con.relation}</td>
              </tr>
        {/each}
        
    </tbody>
</table>

<style>

    span {
        color: cornflowerblue;
        
    }
    span:hover {
        cursor: pointer;
    }
</style>