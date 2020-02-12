<script>
    import {onMount} from "svelte";
    import Window from "../Window.svelte";
    import Ticket from "../utils/Ticket";
    let ticket;
     onMount(() => {
        
        ticket = new Ticket();
        ticket.ELEMENTS = "dbTicket";

    })

    export function onDownload(objectid) {
         if(window.client_status) { //If local network send sql query..
           
            window.sql.query(ticket.getSQL(), [objectid]).then((res) => {
               // console.log(res);
               ticket.DATA = (res.rows.length == 1) ? res.rows[0] : null
               if(ticket.RECORDS){ticket.processData()}
            })
        }
    }

    export function setUsers(users) {
       ticket.SPARTANS = users;
    }

</script>

<Window title="DB Process">
    <div class="form-group">
        <label>Range From</label>
        <input class="dbTicket" data-title="Range From" data-section="Database" id="range_low" type="number" />
        <span id="range_low_span"></span>
    </div>
    <div class="form-group">
        <label>Range To</label>
        <input class="dbTicket" data-title="Range To" data-section="Database" id="range_high" type="number"  />
        <span id="range_high_span"></span>
    </div>
    <div class="form-group">
        <label>
            ESN
        </label>
        <input class="dbTicket" data-title="ESN" data-section="Database" id="esn" type="text" />
        <span id="esn_span"></span>
    </div>
    <div class="form-group">
        <label>
            MSAG Valid
        </label>
        <span id="msag_valid_span"></span>
        <select id="msag_valid" data-title="MSAG Valid" data-section="Database" class="dbTicket">
            <option></option>
            <option>YES</option>
            <option>NO</option>
        </select>
    </div>
    <div class="form-group">
        <label>
            Trans ID
        </label>
        <input class="dbTicket" data-title="Trans ID" data-section="Database"  id="trans_id" type="text" />
        <span id="trans_id_span"></span>
    </div>
    <div class="form-group">
        <label>
            Verified Date
        </label>
        <input class="dbTicket" id="date_verified" data-title="Verified Date"  data-section="Database"   type="date" />
        <span id="date_verified_span"></span>
    </div>
    <div class="form-group">
        <label>Verified By</label>
        <input data-trigger="1" data-check="1" type="text" data-title="Verified By" data-section="Database" class="dbTicket" id="verified_by" placeholder="CLICK HERE TO STAMP"  >
        <span id="verified_by_span"></span>
    </div>
</Window>