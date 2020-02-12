<script>
    import {onMount} from "svelte";
    import Window from "../Window.svelte";
    import Ticket from "../utils/Ticket";

    let ticket;
    onMount(() => {
        
        ticket = new Ticket();
        ticket.ELEMENTS = "pTicket";

    })

     export function onDownload(objectid) {
         if(window.client_status) { //If local network send sql query..
           
            window.sql.query(ticket.getSQL(), [objectid]).then((res) => {
               
               ticket.DATA = (res.rows.length == 1) ? res.rows[0] : null
               if(ticket.RECORDS){ticket.processData()}
            })
        }
    }

     export function setUsers(users) {
       ticket.SPARTANS = users;
     }
     
</script>


<Window title="PREMISES DATA">
        <div class="form-group">
            <label>Owner First Name</label>
            <input class="pTicket" data-title="Owner First Name" data-section="Premises Data" id="pfirst_name"  type="text" />
            <span id="pfirst_name_span"></span>
        </div>
        <div class="form-group">
            <label>Owner Last Name</label>
            <input class="pTicket" data-title="Owner Last Name" data-section="Premises Data" id="plast_name" type="text" />
            <span id="plast_name_span"></span>
        </div>
        <div class="form-group">
            <label >Subdivision</label>
            <input class="pTicket" data-title="Subdivision" data-section="Premises Data" id="subdivision"  type="text" />
            <span id="subdivision_span"></span>
        </div>
        <div class="form-group">
            <label>Block Number</label>
            <input class="pTicket" data-title="Block Number" data-section="Premises Data" id="block_num" type="text" />
            <span id="block_num_span"></span>
        </div>
        <div class="form-group">
            <label>Lot Number</label>
            <input class="pTicket" data-title="Lot Number" data-section="Premises Data" id="lot_num" type="text" />
            <span id="lot_num_span"></span>
        </div>
        <div class="form-group">
            <label>Tax Account</label>
            <input class="pTicket" data-title="Tax Account" data-section="Premises Data" id="tax_account_num" type="text" />
            <span id="tax_account_num_span"></span>
        </div>
        <div class="form-group">
            <label>Property Id</label>
            <input class="pTicket" data-title="Property Id" data-section="Premises Data" id="property_id" type="text" />
            <span id="property_id_span"></span>
        </div>
        <div class="form-group">
            <label>Street</label>
            <input class="pTicket" data-title="Street" data-section="Premises Data" id="street" type="text" />
            <span id="street_span"></span>
        </div>
        <div class="form-group">
            <label>Intersection</label>
            <input class="pTicket" data-title="Intersection" data-section="Premises Data" id="intersection" type="text" />
            <span id="intersection_span"></span>
        </div>
        <div class="form-group">
            <label>Building Description</label>
            <span id="building_description_span"></span>
            <textarea class="pTicket" data-title="Building Description" data-section="Premises Data" id="building_description" ></textarea>
            
        </div>
</Window>