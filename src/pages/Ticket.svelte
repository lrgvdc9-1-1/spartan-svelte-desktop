<script>
   import { onMount, onDestroy, createEventDispatcher } from 'svelte';
   import { fade } from 'svelte/transition';
   import InputPicker from "../ui/Calendar/InputPicker.svelte";
   import SQL from '../utils/sql';
   import Loading from "../ui/Loading.svelte";
   import OnlineDash from "../ui/OnlineDash.svelte";
   import Ticket from "../utils/Tickets";
   import DatePicker from "../ui/DatePicker.svelte";
   import Attachments from "../ui/Ticket/Form/Attachments.svelte";
   import CommentFeed from "../ui/Ticket/Form/CommentFeed.svelte";
   import Connections from "../ui/Ticket/Form/Connections.svelte";
   import Messages  from "../ui/Ticket/Form/Messages.svelte";

    let listTabs = {'customerData' : true, 'premisesData': true, 'lv': true,
   'db': true, 'gis' : true, 'comment' : true, 'history' : true, 'msg' : true};
   //This is sql transaction handler
   let sql = new SQL(pool, api, client_status);

    //First Lets figure out if the page has change or refresh..
    let href = listTabs[window.location.href.split("#")[1]] ? window.location.href.split("#")[1] : 'customerData';
   
    let ticket = new Ticket();
   //  let heightTicket = 600 + "px";
   
    let activeTab = href;
    let loading = true;
   
    let dockable = false;
    let msgComp;


    export let action;
    export let newTicket = false;
    export let socket;
    export let spartans;
    export let router;
    export let isMe;
    export let url;
   let viewers = [];
   let windowSize = "70%";
   let totalFeed = 0;
   let totalAttachments = 0;
   let totalConnections = 0;
   let totalMessages = 0;
   let comConnection;
  
   const dispatch = createEventDispatcher();
 
    //Handle action for the riboon and other actions..
    $: handleAction = (action) ? decideAction(action) : '';
    $: customerData = (activeTab === 'customerData') ? '' : 'none';
    $: premisesData = (activeTab === 'premisesData') ? '' : 'none';
    $: lv      = (activeTab === 'lv') ? '' : 'none';
    $: db      = (activeTab === 'db') ? '' : 'none';
    $: gis        = (activeTab === 'gis') ? '' : 'none';
    $: attachment = (activeTab === 'attach') ? '' : 'none';
    $: comment    = (activeTab === 'comment') ? '' : 'none';
    $: history    = (activeTab === 'history') ? '' : 'none';
    $: msg        = (activeTab === 'msg') ? ''     : 'none';
    $: ontickets  = viewers;

    $: gispeeps = spartans.filter(spartan => spartan.work_center == 'GIS' || spartan.work_center == "ADMIN") || [];
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
         console.table(gispeeps);
         console.table(spartans);
         ticket.SQL = sql;
         dispatch('toolbar', {text: 'TICKET'});
         ticket.setUpInputsEvent();
         ticket.setUpMask();

         if(socket) {


               ticket.socket = socket;
                socket.on("totalUsers", (msg) => {
                     console.log(msg);
                     console.log(spartans);
                     viewers = spartans.filter((spartan) => (msg.users.includes(spartan.SOCKETID)));
                     console.log(viewers);
                });
               
               //When users typing on the ticket
               socket.on("ticketInfo", (data) => {
                     console.log(data);
                     let form = data.data;
                   
                     let formElement = document.getElementById(form.elemID)
                     let type = formElement.type;
                     let spanElement = document.getElementById(form.elemID + "_span")
                     let userId  = data.user;
                     let full_name = viewers.find(spartan => (spartan.SOCKETID == userId));
                     
                     if(spanElement) {
                            if(form.locked) {
                        spanElement.textContent = `EDITING: ${full_name.FULL_NAME}`
                     }else {
                        spanElement.textContent = '';
                     }
                     }
                    
                     

                     formElement.disabled = form.locked;
                     if(type == "checkbox") {
                        formElement.checked = form.value;
                     }else {
                        formElement.value = form.value;
                     }
                     
                     viewers.forEach(spartan => {
                        if(spartan.SOCKETID == userId) {
                            spartan.editing.form = "TICKET";
                           spartan.editing.section = form.section;
                           spartan.editing.attribute = form.title;
                           return; ///break the function once meet the requirements.alt2_mask..
                        }
                       
                     });
                     //reset the viewers  
                     viewers = viewers;
               });

               //User kills the app un expectly update DOM
               socket.on("ticket:leaving", (data) => {
                     viewers = viewers.filter((spartan) => (spartan.SOCKETID != data.id))
               });

             
         }else{
            console.log("NO SOCKET AVAILABLE");
         }

        
      
         
         if(newTicket){
            loading = false;
            if(router){
               console.log(router);
               let lat = router.params['lat'].replace(",", ".");
               let long = router.params['long'].replace(",",".");

               ticket.updateFormById('lat', lat);
               ticket.updateFormById('longy', long);
            }
            // ticket.fetchTicketNumber(api).then(res => res.json())
            // .then(response => 
            // console.log('Success:', response))

         }else{
            
            //..GET THE TICKET ID AND OBJECTID FROM THE ROUTE...
            ticket.objectid = router.params['objectid'];
            ticket.id_ticket = router.params['idTicket'];

            //Check wparcels and hparcels Database to help users...
           

            //Tell spartan chat server to join the room
            socket.emit("joinTicketRoom", {rmName: ticket.objectid, username: isMe.EMAIL});

            if(client_status) {
                  sql.getTicketComFeedTotal([ticket.id_ticket]).then(res => {
                      
                      totalFeed = parseInt(res.rows[0].count);
                  });

                  sql.getTicketForm(ticket.getSQL(), [ticket.objectid]).then(res => {
                     ticket.setOriginal(res)
                     ticket.updateForm(res.rows);

                    

                     //This loop is to handle the address by and address issued by section on lv maybe other areas
                     spartans.forEach(spartan => {
                           if(spartan.UID == ticket.address_by.value) {
                              ticket.address_by.value = spartan.FULL_NAME;
                              ticket.address_by.disabled  = true;
                              return;
                           }
                     });

                     spartans.forEach(spartan => {
                           if(spartan.UID == ticket.address_issued_by.value) {
                              ticket.address_issued_by.value = spartan.FULL_NAME;
                              ticket.address_issued_by.disabled  = true;
                              return;
                           }
                     });

                     spartans.forEach(spartan => {
                           if(spartan.UID == ticket.verified_by.value) {
                              ticket.verified_by.value = spartan.FULL_NAME;
                              ticket.verified_by.disabled  = true;
                              return;
                           }
                     });

                     //Search parcels...
                     msgComp.findParcels(ticket.formInputs);

                     //Notify Window For Getting Connections.
                     window.dispatchEvent(new Event('queryForm'));

                     loading = false;

                     
                })

            }else{ //Can't access the DB directly talk thru the API...
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

     function onResize(event) {
        console.log(event.detail.size);

        windowSize = event.detail.size;

     }

     function onLookUp() {
        console.log(comConnection);
        comConnection.onLookUp();
     }

     function addressByCheckMark(event) {
        var elem = event.target || event.srcElement;
        
         if(elem.value.length == 0) {
               elem.dataset.userid = isMe.UID;
               elem.value = isMe.FULL_NAME;
               ticket.onUpdate(elem, isMe.UID);
              
         }

     }


</script>

{#if loading}
    <!-- content here -->
    <Loading />

{/if}

<div >

   <div id="maintab" class="tabs tabs-wrapper top tabs-expand" style="float: left;width: {windowSize}; overflow: auto;" >
         <div style="width: {windowSize};background: white; color: #CAB448;">
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
               <li on:click="{() => activeTab = 'customerData'}" 
                        class:active="{activeTab === 'customerData'}">
                        <span>CUSTOMER DATA</span> 
               </li>
               <li on:click="{() => activeTab = 'premisesData'}" 
                        class:active="{activeTab === 'premisesData'}">
                        <span>PREMISES DATA</span>
               </li>
               <li on:click="{() => activeTab = 'lv'}" 
                        class:active="{activeTab === 'lv'}">
                        <span>LOCATION VALIDATION PROCESS</span>
               </li>
               <li on:click="{() => activeTab = 'db'}" 
                        class:active="{activeTab === 'db'}">
                        <span>DATABASE VALIDATION PROCESS</span>
               </li>
               <li on:click="{() => activeTab = 'gis'}" 
                        class:active="{activeTab === 'gis'}">
                     <span>
                        GIS VALIDATION PROCESS
                     </span> 
               </li>
               <li on:click="{() => activeTab = 'attach'}" class:active="{activeTab === 'attach'}">
                  <span>
                     ATTACHMENTS - {totalAttachments}
                  </span>
               </li>
               <li on:click="{() => activeTab = 'comment'}" 
                        class:active="{activeTab === 'comment'}">
                        <span>COMMENTS FEED - {totalFeed}</span>
               </li>
               <li class:highlight={(totalConnections > 0)} on:click="{() => activeTab = 'history'}" 
                        class:active="{activeTab === 'history'}" >
                        <span>CONNECTIONS - {totalConnections}</span> 
               </li>
               <li on:click="{() => activeTab = 'msg'}" 
                        class:active="{activeTab === 'msg'}">
                        <span>MESSAGES - {totalMessages}</span> 
                  </li>
            </ul>    

            <div class="frames border bd-default no-border-top p-2">

                      <div style="display: {customerData}"  id="customerData">
                           <div class="form-group">
                              <label>First Name</label>
                              <input class="inTicket" data-title="First Name" data-section="Customer Data" id="cfirst_name" type="text" />
                              <span id="cfirst_name_span"></span>
                           </div>
                           <div class="form-group">
                              <label>Last Name</label>
                              <input class="inTicket" data-title="Last Name" data-section="Customer Data" id="clast_name" type="text" />
                              <span id="clast_name_span"></span>
                           </div>
                           <div class="form-group">
                              <label>9-1-1 Telephone</label>
                              <input class="inTicket" data-title="9-1-1 Telephone" data-section="Customer Data" bind:this={ticket.tele_object}   id="telephone_land_line" type="text" />
                              <span id="telephone_land_line_span"></span>
                           </div>
                           <div class="form-group">
                              <label>ALT 1 Tele</label>
                              <input class="inTicket" data-title="ALT 1 Tele" data-section="Customer Data" bind:this={ticket.alt_object}   id="alt_telephone"  type="text" />
                              <span id="alt_telephone_span"></span>
                           </div>
                           <div class="form-group">
                              <label>ALT 2 Tele</label>
                              <input class="inTicket" data-title="ALT 2 Tele" data-section="Customer Data" bind:this={ticket.alt2_object}  id="alt2_telephone" type="text" />
                              <span id="alt2_telephone_span"></span>
                           </div>
                           <div class="form-group">
                              <label>Email</label>
                              <input class="inTicket" data-title="Email" data-section="Customer Data" id="cemail" type="email"   />
                              <span id="cemail_span"></span>
                           </div>
                           <div class="form-group">
                              <label>
                                 ALT E-mail
                              </label>
                              <input class="inTicket" data-title="ALT E-mail" data-section="Customer Data" id="alt_cemail" type="email" section="customer-data" />
                              <span id="alt_cemail"></span>
                           </div>
                           <div class="form-group">
                              <label>Prefered Language</label>
                              <span id="prf_language_span"></span>
                              <select class="inTicket" data-title="Prefered Language" data-section="Customer Data" id="prf_language"  >
                                 <option></option>
                                 <option>English</option>
                                 <option>Spanish</option>
                              </select>
                           </div>
                           <div class="form-group">
                              <label>Walk In</label>
                              <span id="walk_in_span"></span>
                              <select class="inTicket" data-title="Walk In" data-section="Customer Data" id="walk_in" section="customer-data" >
                                 <option ></option>
                                 <option >Yes</option>
                                 <option >No</option>
                              </select>
                           </div>
                           <div class="form-group">
                              <label>Utilities</label>
                              <span id="utility_span"></span>
                              <select class="inTicket" data-title="Utilities" data-section="Customer Data" id="utility" section="customer-data" >
                                 <option ></option>
                                 <option >Yes</option>
                                 <option >No</option>
                              </select>
                           </div>
                           <div class="form-group">
                              <label>Mailing Info</label>
                              <input class="inTicket" data-title="Mailing Info" data-section="Customer Data" id="mailing_address"  type="text" section="customer-data" />
                              <span id="mailing_address_span"></span>
                           </div>
                      </div>
                      <!-- END OF CUSTOMER DATA -->
                        <div  style="display: {premisesData}" id="premisesData">
                           <div class="form-group">
                              <label>Owner First Name</label>
                              <input class="inTicket" data-title="Owner First Name" data-section="Premises Data" id="pfirst_name"  type="text" />
                              <span id="pfirst_name_span"></span>
                           </div>
                           <div class="form-group">
                              <label>Owner Last Name</label>
                              <input class="inTicket" data-title="Owner Last Name" data-section="Premises Data" id="plast_name" type="text" />
                              <span id="plast_name_span"></span>
                           </div>
                           <div class="form-group">
                              <label >Subdivision</label>
                              <input class="inTicket" data-title="Subdivision" data-section="Premises Data" id="subdivision"  type="text" />
                              <span id="subdivision_span"></span>
                           </div>
                           <div class="form-group">
                              <label>Block Number</label>
                              <input class="inTicket" data-title="Block Number" data-section="Premises Data" id="block_num" type="text" />
                              <span id="block_num_span"></span>
                           </div>
                           <div class="form-group">
                              <label>Lot Number</label>
                              <input class="inTicket" data-title="Lot Number" data-section="Premises Data" id="lot_num" type="text" />
                              <span id="lot_num_span"></span>
                           </div>
                           <div class="form-group">
                              <label>Tax Account</label>
                              <input class="inTicket" data-title="Tax Account" data-section="Premises Data" id="tax_account_num" type="text" />
                              <span id="tax_account_num_span"></span>
                           </div>
                           <div class="form-group">
                              <label>Property Id</label>
                              <input on:blur={onLookUp} class="inTicket" bind:this={ticket.property_id} data-title="Property Id" data-section="Premises Data" id="property_id" type="text" />
                              <span id="property_id_span"></span>
                           </div>
                           <div class="form-group">
                              <label>Street</label>
                              <input class="inTicket" data-title="Street" data-section="Premises Data" id="street" type="text" />
                              <span id="street_span"></span>
                           </div>
                           <div class="form-group">
                              <label>Intersection</label>
                              <input class="inTicket" data-title="Intersection" data-section="Premises Data" id="intersection" type="text" />
                              <span id="intersection_span"></span>
                           </div>
                           <div class="form-group">
                              <label>Building Description</label>
                              <span id="building_description_span"></span>
                              <textarea class="inTicket" data-title="Building Description" data-section="Premises Data" id="building_description" ></textarea>
                              
                           </div>
                        </div>
                        <!-- END OF PREMISES DATA -->
                     <div  style="display: {lv}"   id="lv">
                           <div class="form-group">
                              <label>Address Number</label>
                              <input class="inTicket" data-title="Address Number" data-section="Location Validation" id="add_num" type="number" />
                              <span id="add_num_span"></span>
                           </div>
                           <div class="form-group">
                              <label>Pre Directional</label>
                              <input class="inTicket" data-title="Pre Directional" data-section="Location Validation" id="prd" type="text" />
                              <span id="prd_span"></span>
                           </div>
                           <div class="form-group">
                              <label>Road Name</label>
                              <input class="inTicket" data-title="Road Name" data-section="Location Validation" id="rd" type="text" />
                              <span id="rd_span"></span>
                           </div>
                           <div class="form-group">
                              <label>Street Type</label>
                              <input class="inTicket" data-title="Street Type" data-section="Location Validation" id="sts" type="text" />
                              <span id="sts_span"></span>
                           </div>
                           <div class="form-group">
                              <label>Post Directional</label>
                              <input class="inTicket" data-title="Post Directional" data-section="Location Validation" id="pod" type="text" />
                              <span id="pod_span"></span>
                           </div>
                           <div class="form-group">
                              <label>Unit</label>
                              <input class="inTicket" data-title="Unit" data-section="Location Validation" id="unit" type="text" />
                              <span id="unit_span"></span>
                           </div>
                           <div class="form-group">
                              <label>MSAG Comm</label>
                              <input class="inTicket" data-title="MSAG Comm" data-section="Location Validation"  id="msag_comm" type="text" />
                              <span id="msag_comm_span"></span>
                           </div>
                           <!-- <div class="form-group">
                              <label>Postal Comm</label>
                              <input class="inTicket" data-title="Postal Comm" data-section="Location Validation" id="postal_comm" type="text" />
                              <span id="postal_comm_span"></span>
                           </div> -->
                           <div class="form-group">
                              <label>Full Address</label>
                              <div class="input">
                                 <input class="inTicket" data-title="Full Address" data-section="Location Validation" id="full_address" type="text">
                                 <div class="button-group">
                                    <button on:click={ticket.onClearFullAddress} class="button input-search-button"><span class="mif-bin"></span></button>
                                    <button on:click={ticket.onGlueFullAddress}  class="button input-search-button"><span class="mif-clipboard"></span></button>
                                 </div>
                              </div>
                              <span id="full_address_span"></span>
                           </div>
                           <div class="form-group">
                              <label>Address By</label>
                              <input id="address_by" on:click={addressByCheckMark} style="cursor: pointer;" bind:this={ticket.address_by} data-trigger="1" data-check="1" data-title="Address By" data-section="Location Validation" class="inTicket"  placeholder="CLICK HERE TO STAMP" type="text" />
                              <span id="address_by_span"></span>
                           </div>
                           <div class="form-group">
                              <label>Date Addressed</label>
                              <InputPicker title="Date Addressed" btnGroup={true} section="Location Validation" id="date_addressed" clazz="inTicket"  />
                        
                              <span id="date_addressed_span"></span>
                           </div>

                           <div class="form-group">
                               
                              <label class="switch transition-on">
                                 <input type="checkbox" class="inTicket" data-title="Address Issued" data-section="Location Validation" id="address_issued" />
                                 <span class="check"></span>
                                 <span class="caption">Address Issued</span>
                              </label>

                               <label class="switch transition-on">
                                 <input type="checkbox" class="inTicket" data-title="Called Customer" data-section="Location Validation" id="called_cust" />
                                 <span class="check"></span>
                                 <span class="caption">Called Customer</span>
                              </label>

                              <label class="switch transition-on">
                                 <input type="checkbox" class="inTicket" data-title="Plack Generated" data-section="Location Validation" id="plack_generated" />
                                 <span class="check"></span>
                                 <span class="caption">Plack Generated</span>
                              </label>


                           </div>

                           <div class="form-group">
                              <label>Address Issued Date</label>
                               <InputPicker title="Address Issued Date" btnGroup={true} section="Location Validation" id="address_issued_date" clazz="inTicket"  />
                               <span id="address_issued_date_span"></span>
                           </div>

                           <div class="form-group">
                              <label>Address Issued By</label>
                              <input on:click={addressByCheckMark} bind:this={ticket.address_issued_by}  data-trigger="1" data-check="1" type="text" data-title="Address Issued By" data-section="Location Validation" class="inTicket" id="address_issued_by" placeholder="CLICK HERE TO STAMP"     >
                              <span id="address_issued_date_span"></span>
                           </div>

                           <div class="form-group">
                              <label>Lat</label>
                              
                              <div class="input">
                                 <input type="text" data-title="Lat" data-section="Location Validation" class="inTicket" id="lat"     >
                                 <div class="button-group">
                                    <button on:click={ticket.copy} data-copy="lat"  class="button input-search-button"><span style="color: #05173F !important" class="mif-clipboard"></span></button>
                                 </div>
                              </div>

                              <span id="lat_span"></span>
                           </div>

                           <div class="form-group">
                              <label>Long</label>
                              
                              <div class="input">
                                 <input type="text" data-title="Long" data-section="Location Validation" class="inTicket" id="longy" >
                                 <div class="button-group">
                                    <button on:click={ticket.copy} data-copy="longy"  class="button input-search-button"><span style="color: #05173F !important" class="mif-clipboard"></span></button>
                                 </div>
                              </div>

                              <span id="longy_span"></span>
                           </div>
                           
                     </div>
                     <!-- END OF LV -->
                     <div  style="display: {db}"  id="db">
                           <div class="form-group">
                              <label>Range From</label>
                              <input class="inTicket" data-title="Range From" data-section="Database" id="range_low" type="number" />
                              <span id="range_low_span"></span>
                           </div>
                           <div class="form-group">
                              <label>Range To</label>
                              <input class="inTicket" data-title="Range To" data-section="Database" id="range_high" type="number"  />
                              <span id="range_high_span"></span>
                           </div>
                           <div class="form-group">
                              <label>
                                 ESN
                              </label>
                              <input class="inTicket" data-title="ESN" data-section="Database" id="esn" type="text" />
                              <span id="esn_span"></span>
                           </div>
                           <div class="form-group">
                              <label>
                                 MSAG Valid
                              </label>
                              <span id="msag_valid_span"></span>
                              <select id="msag_valid" data-title="MSAG Valid" data-section="Database" class="inTicket">
                                 <option></option>
                                 <option>YES</option>
                                 <option>NO</option>
                              </select>
                           </div>
                           <div class="form-group">
                              <label>
                                 Trans ID
                              </label>
                              <input class="inTicket" data-title="Trans ID" data-section="Database"  id="trans_id" type="text" />
                              <span id="trans_id_span"></span>
                           </div>
                           <div class="form-group">
                              <label>
                                 Verified Date
                              </label>
                              <InputPicker title="Verified Date" btnGroup={true} section="Database" id="date_verified" clazz="inTicket"  />
                              <span id="date_verified_span"></span>
                           </div>
                           <div class="form-group">
                              <label>Verified By</label>
                              <input on:click={addressByCheckMark} bind:this={ticket.verified_by}  data-trigger="1" data-check="1" type="text" data-title="Verified By" data-section="Database" class="inTicket" id="verified_by" placeholder="CLICK HERE TO STAMP"     >
                              <span id="verified_by_span"></span>
                           </div>
                     </div>
                     <!-- END OF DB -->
                     <div style="display: {gis}" id="gis">
                           <h2>RCL Valid</h2>
                           <div class="form-group">
                              <label>
                                 Staff Initials
                              </label>
                              <!-- <input class="inTicket" data-title="Staff Initials" data-section="GIS" id="initials_mapping" type="text" /> -->
                              <select class="inTicket" data-title="Staff Initials" data-section="GIS" id="initials_mapping"  >
                                 {#each gispeeps as team}
                                     <option value="{team.user_id}">{team.first_name + " " + team.last_name}</option>
                                 {/each}
                              </select>
                              <span id="initials_mapping_span"></span>
                           </div>
                           <div class="form-group">
                              <InputPicker btnGroup={true} clazz="inTicket" title="Date" section="GIS" id="mapping_verified_date" />
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
                              <select class="inTicket" data-title="Staff Initials" data-section="GIS" id="initials_geocoding"  >
                                 {#each gispeeps as team}
                                     <option value="{team.user_id}">{team.first_name + " " + team.last_name}</option>
                                 {/each}
                              </select>
                              <span id="initials_geocoding_span"></span>
                           </div>
                           <div class="form-group">  

                              <InputPicker btnGroup={true} clazz="inTicket" title="Geocoding Date" section="GIS" id="geocoding_date" />
                              <span id="geocoding_date_span"></span>
                           </div>
                     </div>
                     <!-- END OF GIS -->
                     <!-- Start of Attachments -->
                     <div style="display: {attachment}" id="attach">
                           <Attachments on:loading="{(event)=>{loading=event.detail}}" on:totalMSG="{(event)=> {totalAttachments = event.detail;}}" {sql} ticketId={ticket.id_ticket} />
                     </div>
                     <!-- Start of COmment Feed -->
                     <div style="display: {comment}" id="comment">
                        {#if comment == ''}
                            <!-- content here -->
                            <CommentFeed on:totalMSG={(event) => {totalFeed = event.detail;}} {url} {isMe} {spartans} {socket} {sql} ticketId={ticket.id_ticket}></CommentFeed>
                        {/if}
                        
                     </div>
                     <div style="display: {history}" id="connections">
                        
                             <Connections bind:this={comConnection} on:totalMSG={(event) => {totalConnections = event.detail;}} {sql} phoneNumTwo={ticket.alt2_object} phoneNumOne={ticket.alt_object} ticketNum={ticket.objectid} elePropId={ticket.property_id} />
                     </div>

                     <div style="display: {msg}" id="msg">
                           <Messages on:totalMSG={(event) =>{ totalMessages = event.detail;}} bind:this={msgComp}  />
                     </div>
                     
            </div>
         </div>
      <OnlineDash  on:resize={onResize} {url} {isMe} {socket} {ontickets}/>
</div>


<style>
  span {
     color: #D55441;
  }
   ul.tabs-list > li:hover {
      cursor: pointer;
   }

   .tabs {
      height: calc(100vh - 240px);
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

input:disabled {
  color:  #D55441;
  cursor: wait !important;
}
input[type=date] {

       -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    position: relative;
    border: 1px #d9d9d9 solid;
    color: #1d1d1d;
    width: 100%;
    /* display: block; */
    padding: 0 .75rem;
    font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu,"Helvetica Neue",sans-serif;
    font-size: 1rem;
    height: 36px;
    line-height: 36px;
    background: #fff none;
    background-clip: padding-box;
    min-width: 0;
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

    .highlight {
        color: #C3073F !important;
        animation: shadow-pulse 1s infinite;
    }

</style>