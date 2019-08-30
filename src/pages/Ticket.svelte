<script>
   import { onMount, onDestroy, createEventDispatcher } from 'svelte';
   import { fade } from 'svelte/transition';
   import SQL from '../utils/sql';
   import Loading from "../ui/Loading.svelte";
   import OnlineDash from "../ui/OnlineDash.svelte";
   import Ticket from "../utils/Tickets";
   import DatePicker from "../ui/DatePicker.svelte";

    let listTabs = {'customerData' : true, 'premisesData': true, 'lv': true,
   'db': true, 'gis' : true, 'comment' : true, 'history' : true, 'msg' : true};
   //This is sql transaction handler
   let sql = new SQL(client, api, client_status);

    //First Lets figure out if the page has change or refresh..
    let href = listTabs[window.location.href.split("#")[1]] ? window.location.href.split("#")[1] : 'customerData';
   
    let ticket = new Ticket();
   //  let heightTicket = 600 + "px";
   
    let active = href;
    let loading = true;
   
    let dockable = false;
    let fakeName = new Date();

    export let action;
    export let newTicket = false;
    export let socket;
    export let spartans;
    export let router;

   const dispatch = createEventDispatcher();
 
    //Handle action for the riboon and other actions..
    $: handleAction = (action) ? decideAction(action) : '';
    $: customerData = (active === 'customerData') ? '' : 'none';
    $: premisesData = (active === 'premisesData') ? '' : 'none';
    $: lv      = (active === 'lv') ? '' : 'none';
    $: db      = (active === 'db') ? '' : 'none';
    $: gis     = (active === 'gis') ? '' : 'none';
    $: comment = (active === 'comment') ? '' : 'none';
    $: history = (active === 'history') ? '' : 'none';
    $: msg     = (active === 'msg') ? ''     : 'none';
   
    //Decide Action is when ribbon press something happens in the ticket form...

    function decideAction(key) {
           switch (key) {
              case "SAVE":
                action = '';
                console.log(ticket);
                
                break;
              case "DELETE":
                break;
              default:
                break;
            } 
    }

   
   

     onMount(async () => {
         console.log(spartans);
         dispatch('toolbar', {text: 'TICKET'});
         ticket.setUpInputsEvent();
         ticket.setUpMask();
         if(socket) {
             
               ticket.setSocket(socket);
                socket.on("totalUsers", (msg) => {
                     console.log(msg);
                });

               socket.on("ticketInfo", (data) => {
                     console.log(data);
                     let element = document.getElementById(data.attribute)
                     element.disabled = data.locked;
                     element.value = data.value;
                     ticket.changeValue(data.attribute, data.value);
               });

             socket.emit("joinTicketRoom", {rmName: ticket.objectid, username: fakeName.getTime()});
         }else{
            console.log("NO SOCKET AVAILABLE");
         }

        
      
         
         if(newTicket){
            
            // ticket.fetchTicketNumber(api).then(res => res.json())
            // .then(response => 
            // console.log('Success:', response))

         }else{
            
            //..GET THE TICKET ID AND OBJECTID FROM THE ROUTE...
            ticket.objectid = router.params['objectid'];
            ticket.id_ticket = router.params['idTicket'];
            if(client_status) {
               console.log("LOCAL DATABASE ACCESS");
               
                  sql.getTicketForm(ticket.getSQL(), [ticket.objectid]).then(res => {
                     ticket.setOriginal(res)
                     ticket.updateForm(res.rows);
                     loading = false;
                })

            }else{
               console.log("FETCH THROUGH API");
              
            } 
         }
     })

     onDestroy(async () => {
         ticket.destroyMask();
          dispatch('toolbar', {text: 'NONE'});
        if(socket) {
             //remove from room
            socket.emit("leaveTicketRoom", ticket.objectid);
        }
       
       
        //Remove the event listeners..
         ticket.destroyInputsEvent();
       
     });

     function getHCADSubSuggestions(event) { 
       

        var html = event.target;
        if(html.value.length > 3) {
           var term = html.value;

            var subURL = `http://propaccess.hidalgoad.org/ClientDB/Codes.aspx?cid=&term=${term}&type=S`;
           
            var formData = new FormData();
            

            formData.append('url', subURL);
          

            fetch('https://gis.lrgvdc911.org/php/spartan/api/v2/proxy.php', {
            method: 'POST',
            body: formData
            })
            .then(response => response.json())
            .catch(error => console.error('Error:', error))
            .then(response => console.log('Success:', JSON.stringify(response)));
            
            
        }
       

     }


</script>

{#if loading}
    <!-- content here -->
    <Loading />

{/if}

<div >

   <div  class="tabs tabs-wrapper top tabs-expand" style="float: left;width: 85%; overflow: auto;" >
         <div style="width: 85%;background: white; color: #CAB448;">
             <div style="display: grid; grid-template-columns: 80px auto">
               <div style="cursor: pointer;">
                  <img  src="./assets/spartan_logo.webp" width="70" height="70" alt=""> 
               </div>
               <div>
                   <h3 >Ticket Number: {ticket.objectid}</h3>
               </div>
             </div>
            
            
         </div> 
            <ul class="tabs-list">
               <li on:click="{() => active = 'customerData'}" 
                        class:active="{active === 'customerData'}">
                        <span>CUSTOMER DATA</span> 
               </li>
               <li on:click="{() => active = 'premisesData'}" 
                        class:active="{active === 'premisesData'}">
                        <span>PREMISES DATA</span>
               </li>
               <li on:click="{() => active = 'lv'}" 
                        class:active="{active === 'lv'}">
                        <span>LOCATION VALIDATION PROCESS</span>
               </li>
               <li on:click="{() => active = 'db'}" 
                        class:active="{active === 'db'}">
                        <span>DATABASE VALIDATION PROCESS</span>
               </li>
               <li on:click="{() => active = 'gis'}" 
                        class:active="{active === 'gis'}">
                     <span>
                        GIS VALIDATION PROCESS
                     </span> 
               </li>
               <li on:click="{() => active = 'comment'}" 
                        class:active="{active === 'comment'}">
                        <span>Comments Feed - </span>
               </li>
               <li on:click="{() => active = 'history'}" 
                        class:active="{active === 'history'}" >
                        <span>CONNECTIONS - </span> 
               </li>
               <li on:click="{() => active = 'msg'}" 
                        class:active="{active === 'msg'}">
                        <span>MESSAGES - </span> 
                  </li>
            </ul>    

            <div class="frames border bd-default no-border-top p-2">

                      <div style="display: {customerData}"  id="customerData">
                           <div class="form-group">
                              <label>First Name</label>
                              <input class="inTicket" section="customer-data" id="cfirst_name" type="text" />
                           </div>
                           <div class="form-group">
                              <label>Last Name</label>
                              <input class="inTicket" id="clast_name" type="text" />
                           </div>
                           <div class="form-group">
                              <label>9-1-1 Telephone</label>
                              <input class="inTicket" bind:this={ticket.tele_object} section="customer-data"  id="telephone_land_line" type="text" />
                           </div>
                           <div class="form-group">
                              <label>ALT 1 Tele</label>
                              <input class="inTicket" bind:this={ticket.alt_object} section="customer-data"  id="alt_telephone"  type="text" />
                           </div>
                           <div class="form-group">
                              <label>ALT 2 Tele</label>
                              <input class="inTicket" bind:this={ticket.alt2_object} section="customer-data" id="alt2_telephone" type="text" />
                           </div>
                           <div class="form-group">
                              <label>Email</label>
                              <input class="inTicket" id="cemail" type="email" section="customer-data"  />
                           </div>
                           <div class="form-group">
                              <label>
                                 ALT E-mail
                              </label>
                              <input class="inTicket" id="alt_cemail" type="email" section="customer-data" />
                           </div>
                           <div class="form-group">
                              <label>Prefered Language</label>
                              <select class="inTicket" id="prf_language"  section="customer-data" >
                                 <option></option>
                                 <option>English</option>
                                 <option>Spanish</option>
                              </select>
                           </div>
                           <div class="form-group">
                              <label>Walk In</label>
                              <select class="inTicket" id="walk_in" section="customer-data" >
                                 <option ></option>
                                 <option >Yes</option>
                                 <option >No</option>
                              </select>
                           </div>
                           <div class="form-group">
                              <label>Utilities</label>
                              <select class="inTicket" id="utility" section="customer-data" >
                                 <option ></option>
                                 <option >Yes</option>
                                 <option >No</option>
                              </select>
                           </div>
                           <div class="form-group">
                              <label>Mailing Info</label>
                              <input class="inTicket" id="mailing_address"  type="text" section="customer-data" />
                           </div>
                      </div>
                      <!-- END OF CUSTOMER DATA -->
                        <div  style="display: {premisesData}" id="premisesData">
                           <div class="form-group">
                              <label>Owner First Name</label>
                              <input class="inTicket" id="pfirst_name"  type="text" />
                           </div>
                           <div class="form-group">
                              <label>Owner Last Name</label>
                              <input class="inTicket" id="plast_name" type="text" />
                           </div>
                           <div class="form-group">
                              <label >Subdivision</label>
                              <input class="inTicket" id="subdivision"  type="text" />
                           </div>
                           <div class="form-group">
                              <label>Block Number</label>
                              <input class="inTicket" id="block_num" type="text" />
                           </div>
                           <div class="form-group">
                              <label>Lot Number</label>
                              <input class="inTicket" id="lot_num" type="text" />
                           </div>
                           <div class="form-group">
                              <label>Tax Account</label>
                              <input class="inTicket" id="tax_account_num" type="text" />
                           </div>
                           <div class="form-group">
                              <label>Property Id</label>
                              <input class="inTicket" id="property_id" type="text" />
                           </div>
                           <div class="form-group">
                              <label>Street</label>
                              <input class="inTicket" id="street" type="text" />
                           </div>
                           <div class="form-group">
                              <label>Intersection</label>
                              <input class="inTicket" id="intersection" type="text" />
                           </div>
                           <div class="form-group">
                              <label>Building Description</label>
                              <textarea class="inTicket" id="building_description" ></textarea>
                           </div>
                        </div>
                        <!-- END OF PREMISES DATA -->
                     <div  style="display: {lv}"   id="lv">
                           <div class="form-group">
                              <label>Address Number</label>
                              <input class="inTicket" id="add_num" type="number" />
                           </div>
                           <div class="form-group">
                              <label>Pre Directional</label>
                              <input class="inTicket" id="prd" type="text" />
                           </div>
                           <div class="form-group">
                              <label>Road Name</label>
                              <input class="inTicket" id="rd" type="text" />
                           </div>
                           <div class="form-group">
                              <label>Street Type</label>
                              <input class="inTicket" id="sts" type="text" />
                           </div>
                           <div class="form-group">
                              <label>Post Directional</label>
                              <input class="inTicket" id="pod" type="text" />
                           </div>
                           <div class="form-group">
                              <label>Unit</label>
                              <input class="inTicket" id="unit" type="text" />
                           </div>
                           <div class="form-group">
                              <label>MSAG Comm</label>
                              <input class="inTicket" id="msag_comm" type="text" />
                           </div>
                           <div class="form-group">
                              <label>Postal Comm</label>
                              <input class="inTicket" id="postal_comm" type="text" />
                           </div>
                           <div class="form-group">
                              <label>Full Address</label>
                              <div class="input">
                                 <input class="inTicket" id="full_address" type="text">
                                 <div class="button-group">
                                    <button on:click={ticket.onClearFullAddress} class="button input-search-button"><span class="mif-bin"></span></button>
                                    <button on:click={ticket.onGlueFullAddress}  class="button input-search-button"><span class="mif-clipboard"></span></button>
                                 </div>
                              </div>
                           </div>
                           <div class="form-group">
                              <label>Address By</label>
                              <input id="address_by" class="inTicket"  placeholder="CLICK HERE TO STAMP" type="text" />
                           </div>
                           <div class="form-group">
                              <DatePicker />
                           </div>
                     </div>
                     <!-- END OF LV -->
                     <div  style="display: {db}"  id="db">
                           <div class="form-group">
                              <label>Range From</label>
                              <input class="inTicket"  id="range_low" type="number" />
                           </div>
                           <div class="form-group">
                              <label>Range To</label>
                              <input class="inTicket" id="range_high" type="number"  />
                           </div>
                           <div class="form-group">
                              <label>
                                 ESN
                              </label>
                              <input class="inTicket" id="esn" type="text" />
                           </div>
                           <div class="form-group">
                              <label>
                                 MSAG Valid
                              </label>
                              <select id="msag_valid" class="inTicket">
                                 <option></option>
                                 <option>YES</option>
                                 <option>NO</option>
                              </select>
                           </div>
                           <div class="form-group">
                              <label>
                                 Trans ID
                              </label>
                              <input class="inTicket" id="trans_id" type="text" />
                           </div>
                           <div class="form-group">
                              <label>
                                 Verified Date
                              </label>
                              <input class="inTicket" on:change={()=> {console.log(this.id); console.log("START"); console.log(this);}} id="date_verified" type="text" />
                           </div>
                     </div>
                     <!-- END OF DB -->
                     <div style="display: {gis}" id="gis">
                           <h2>RCL Valid</h2>
                           <div class="form-group">
                              <label>
                                 Staff Initials
                              </label>
                              <input class="inTicket" id="initials_mapping" type="text" />
                           </div>
                           <div class="form-group">
                              <input type="text" id="mapping_verified_date" class="inTicket">
                           </div>
                           <br>
                           <hr>
                           <h2>SSAP Valid</h2>
                           <div class="form-group">
                              <label>
                                 Staff Initials
                              </label>
                              <input class="inTicket" id="initials_geocoding" type="text" />
                           </div>
                           <div class="form-group">
                              <input type="text" id="geocoding_date" class="inTicket">
                           </div>
                     </div>
                     <!-- END OF GIS -->
            </div>
         </div>
      <OnlineDash items={['test', 'test', 'test']}/>
</div>


<style>
   ul.tabs-list > li:hover {
      cursor: pointer;
   }

   .tabs {
      height: calc(100vh - 182px);
   }

   .tabs>ul.tabs-list>li>span {
    padding: .5rem 1rem;
    background-color: inherit;
    color: inherit;
    text-decoration: none;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
}
select {
   cursor: pointer;
}
input {
   text-transform: uppercase;
}
</style>