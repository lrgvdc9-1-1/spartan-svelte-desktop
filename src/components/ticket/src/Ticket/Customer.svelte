 <script>
    import {onMount} from "svelte";
    import Window from "../Window.svelte";
    import IMask from 'imask';
    import Ticket from "../utils/Ticket";
    let data;
    let phones = {};
    let ph_mask = {};
    let maskOptions = {
               mask: '(000) 000-0000'
         };

    let ticket = new Ticket();
    onMount(()=> {
       //Construct the ticket object
      
        ticket.ELEMENTS = 'cTicket';

        //setup some mask for the telephone inputs...
        ph_mask.land = IMask(phones.land, maskOptions);
        ph_mask.alt = IMask(phones.alt, maskOptions);
        ph_mask.alt2 = IMask(phones.alt2, maskOptions);
    })


      //On Download only relevant to the inputs of this component..
    export function onDownload(objectid) {
         if(window.client_status) { //If local network send sql query..
           
             ticket.ELEMENTS = 'cTicket';
            window.sql.query(ticket.getSQL(), [objectid]).then((res) => {
               
               ticket.DATA = (res.rows.length == 1) ? res.rows[0] : null
               if(ticket.RECORDS){ticket.processData()}
            })
        }
    }
 </script>
      <Window title="CUSTOMER DATA">
              <div class="form-group">
                  <label>First Name</label>
                  <input class="cTicket" data-title="First Name" data-section="Customer Data" id="cfirst_name" type="text" />
                  <span id="cfirst_name_span"></span>
            </div>
            <div class="form-group">
               <label>Last Name</label>
               <input class="cTicket" data-title="Last Name" data-section="Customer Data" id="clast_name" type="text" />
               <span id="clast_name_span"></span>
            </div>
            <div class="form-group">
               <label>9-1-1 Telephone</label>
               <input bind:this={phones.land} class="cTicket" data-title="9-1-1 Telephone" data-section="Customer Data"    id="telephone_land_line" type="text" />
               <span id="telephone_land_line_span"></span>
            </div>
            <div class="form-group">
               <label>ALT 1 Tele</label>
               <input bind:this={phones.alt} class="cTicket" data-title="ALT 1 Tele" data-section="Customer Data"    id="alt_telephone"  type="text" />
               <span id="alt_telephone_span"></span>
            </div>
            <div class="form-group">
               <label>ALT 2 Tele</label>
               <input bind:this={phones.alt2} class="cTicket" data-title="ALT 2 Tele" data-section="Customer Data"   id="alt2_telephone" type="text" />
               <span id="alt2_telephone_span"></span>
            </div>
            <div class="form-group">
               <label>Email</label>
               <input class="cTicket" data-title="Email" data-section="Customer Data" id="cemail" type="email"   />
               <span id="cemail_span"></span>
            </div>
            <div class="form-group">
               <label>
                  ALT E-mail
               </label>
               <input class="cTicket" data-title="ALT E-mail" data-section="Customer Data" id="alt_cemail" type="email" section="customer-data" />
               <span id="alt_cemail"></span>
            </div>
            <div class="form-group">
               <label>Prefered Language</label>
               <span id="prf_language_span"></span>
               <select class="cTicket" data-title="Prefered Language" data-section="Customer Data" id="prf_language"  >
                  <option></option>
                  <option>English</option>
                  <option>Spanish</option>
               </select>
            </div>
            <div class="form-group">
               <label>Walk In</label>
               <span id="walk_in_span"></span>
               <select class="cTicket" data-title="Walk In" data-section="Customer Data" id="walk_in" section="customer-data" >
                  <option ></option>
                  <option >Yes</option>
                  <option >No</option>
               </select>
            </div>
            <div class="form-group">
               <label>Utilities</label>
               <span id="utility_span"></span>
               <select class="cTicket" data-title="Utilities" data-section="Customer Data" id="utility" section="customer-data" >
                  <option ></option>
                  <option >Yes</option>
                  <option >No</option>
               </select>
            </div>
            <div class="form-group">
               <label>Mailing Info</label>
               <input class="cTicket" data-title="Mailing Info" data-section="Customer Data" id="mailing_address"  type="text" section="customer-data" />
               <span id="mailing_address_span"></span>
            </div>
      
      </Window>


    