 <script>
    import {onMount} from "svelte";
    import InputCalendarPicker from "../components/Calendar/InputCalendarPicker.svelte";
    import Window from "../Window.svelte";
    import Ticket from "../utils/Ticket";
    let gispeeps = [];
    let ticket;
    
    onMount(() =>{
        ticket = new Ticket();
        ticket.ELEMENTS = "gisTicket";

     });


     export function onDownload(objectid) {
         if(window.client_status) { //If local network send sql query..
           
            window.sql.query(ticket.getSQL(), [objectid]).then((res) => {
              
               ticket.DATA = (res.rows.length == 1) ? res.rows[0] : null;
               console.log(res.rows);
               if(ticket.RECORDS){ticket.processData()}
              

            })
        }else{ //<<<<<<Fetch Through ONLINE>>>>

        }
    }

    export function setUsers(users) {
       ticket.SPARTANS = users;
    }
 </script>

 <Window title="GIS Process">
    <h2>RCL Valid</h2>
    <div class="form-group">
        <label>
            Staff Initials
        </label>
        <!-- <input class="inTicket" data-title="Staff Initials" data-section="GIS" id="initials_mapping" type="text" /> -->
        <select class="gisTicket" data-title="Staff Initials" data-section="GIS" id="initials_mapping"  >
            {#each gispeeps as team}
                <option value="{team.user_id}">{team.first_name + " " + team.last_name}</option>
            {/each}
        </select>
        <span id="initials_mapping_span"></span>
    </div>
    <div class="form-group">
        <InputCalendarPicker btnGroup={true}  type="text" title="RCL Date" section="GIS" clazz="gisTicket" id="mapping_verified_date" />
        <span id="mapping_verified_date_span"></span>
    </div>
    <br>
    <hr>
    <h2>SSAP Valid</h2>
    <div class="form-group">
        <label>
            Staff Initials
        </label>
        <!-- <input class="inTicket" data-title="Staff Initials" data-section="GIS" id="initials_geocoding" type="text" /> -->
        <select class="gisTicket" data-title="Staff Initials" data-section="GIS" id="initials_geocoding"  >
            {#each gispeeps as team}
                <option value="{team.user_id}">{team.first_name + " " + team.last_name}</option>
            {/each}
        </select>
        <span id="initials_geocoding_span"></span>
    </div>
    <div class="form-group">
        <InputCalendarPicker btnGroup={true}  type="text" title="Geocoding Date" section="GIS" clazz="gisTicket" id="geocoding_date" />
        <span id="geocoding_date_span"></span>
    </div>
 </Window>
 