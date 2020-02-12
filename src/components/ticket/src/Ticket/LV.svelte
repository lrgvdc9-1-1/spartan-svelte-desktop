<script>
    import {onMount} from "svelte";
    import Window from "../Window.svelte";
    import Ticket from "../utils/Ticket";
    let ticket;
     onMount(() => {
        
        ticket = new Ticket();
        ticket.ELEMENTS = "lvTicket";

    })

    export function onDownload(objectid) {
         if(window.client_status) { //If local network send sql query..
           
            window.sql.query(ticket.getSQL(), [objectid]).then((res) => {
               //console.log(res.rows);
               ticket.DATA = (res.rows.length == 1) ? res.rows[0] : null
               if(ticket.RECORDS){ticket.processData()}
            })
        }
    }

    export function setUsers(users) {
       ticket.SPARTANS = users;
    }

</script>

<Window title="LV Process">
      <div class="form-group">
            <label>Address Number</label>
            <input class="lvTicket" data-title="Address Number" data-section="Location Validation" id="add_num" type="number" />
            <span id="add_num_span"></span>
      </div>
      <div class="form-group">
            <label>Pre Directional</label>
            <input class="lvTicket" data-title="Pre Directional" data-section="Location Validation" id="prd" type="text" />
            <span id="prd_span"></span>
       </div>
    <div class="form-group">
        <label>Road Name</label>
        <input class="lvTicket" data-title="Road Name" data-section="Location Validation" id="rd" type="text" />
        <span id="rd_span"></span>
    </div>
    <div class="form-group">
        <label>Street Type</label>
        <input class="lvTicket" data-title="Street Type" data-section="Location Validation" id="sts" type="text" />
        <span id="sts_span"></span>
    </div>
    <div class="form-group">
        <label>Post Directional</label>
        <input class="lvTicket" data-title="Post Directional" data-section="Location Validation" id="pod" type="text" />
        <span id="pod_span"></span>
    </div>
    <div class="form-group">
        <label>Unit</label>
        <input class="lvTicket" data-title="Unit" data-section="Location Validation" id="unit" type="text" />
        <span id="unit_span"></span>
    </div>
    <div class="form-group">
        <label>MSAG Comm</label>
        <input class="lvTicket" data-title="MSAG Comm" data-section="Location Validation"  id="msag_comm" type="text" />
        <span id="msag_comm_span"></span>
    </div>
    <!-- <div class="form-group">
        <label>Postal Comm</label>
        <input class="lvTicket" data-title="Postal Comm" data-section="Location Validation" id="postal_comm" type="text" />
        <span id="postal_comm_span"></span>
    </div> -->
    <div class="form-group">
        <label>Full Address</label>
        <div class="input">
            <input class="lvTicket" data-title="Full Address" data-section="Location Validation" id="full_address" type="text">
            <div class="button-group">
            <button on:click={ticket.onClearFullAddress} class="button input-search-button"><span class="mif-bin"></span></button>
            <button on:click={ticket.onGlueFullAddress}  class="button input-search-button"><span class="mif-clipboard"></span></button>
            </div>
        </div>
        <span id="full_address_span"></span>
    </div>
    <div class="form-group">
        <label>Address By</label>
        <input id="address_by"  style="cursor: pointer;"  data-trigger="1" data-check="1" data-title="Address By" data-section="Location Validation" class="lvTicket"  placeholder="CLICK HERE TO STAMP" type="text" />
        <span id="address_by_span"></span>
    </div>
    <div class="form-group">
        <label>Date Addressed</label>
        <input  type="date" data-title="Date Addressed" data-section="Location Validation" class="lvTicket" id="date_addressed"  >
        <span id="date_addressed_span"></span>
    </div>

    <div class="form-group">
        
        <label class="switch transition-on">
            <input type="checkbox" class="lvTicket" data-title="Address Issued" data-section="Location Validation" id="address_issued" />
            <span class="check"></span>
            <span class="caption">Address Issued</span>
        </label>

        <label class="switch transition-on">
            <input type="checkbox" class="lvTicket" data-title="Called Customer" data-section="Location Validation" id="called_cust" />
            <span class="check"></span>
            <span class="caption">Called Customer</span>
        </label>

        <label class="switch transition-on">
            <input type="checkbox" class="lvTicket" data-title="Plack Generated" data-section="Location Validation" id="plack_generated" />
            <span class="check"></span>
            <span class="caption">Plack Generated</span>
        </label>


    </div>

    <div class="form-group">
        <label>Address Issued Date</label>
        <input  type="date" data-title="Address Issued Date" data-section="Location Validation" class="lvTicket" id="address_issued_date"  >
        <span id="address_issued_date_span"></span>
    </div>

    <div class="form-group">
        <label>Address Issued By</label>
        <input data-trigger="1" data-check="1" type="text" data-title="Address Issued By" data-section="Location Validation" class="lvTicket" id="address_issued_by" placeholder="CLICK HERE TO STAMP"     >
        <span id="address_issued_date_span"></span>
    </div>

    <div class="form-group">
        <label>Lat</label>
        
        <div class="input">
            <input type="text" data-title="Lat" data-section="Location Validation" class="lvTicket" id="lat"     >
            <div class="button-group">
            <button on:click={ticket.copy} data-copy="lat"  class="button input-search-button"><span style="color: #05173F !important" class="mif-clipboard"></span></button>
            </div>
        </div>

        <span id="lat_span"></span>
    </div>

    <div class="form-group">
        <label>Long</label>
        
        <div class="input">
            <input type="text" data-title="Long" data-section="Location Validation" class="lvTicket" id="longy" >
            <div class="button-group">
            <button on:click={ticket.copy} data-copy="longy"  class="button input-search-button"><span style="color: #05173F !important" class="mif-clipboard"></span></button>
            </div>
        </div>

        <span id="longy_span"></span>
    </div>
</Window>