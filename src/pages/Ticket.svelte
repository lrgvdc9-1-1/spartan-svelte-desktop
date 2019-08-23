<script>
   import { onMount, onDestroy } from 'svelte';
   import { fade } from 'svelte/transition';
  
   import DatePicker from "../ui/DatePicker.svelte";
   import Loading from "../ui/Loading.svelte";
   import OnlineDash from "../ui/OnlineDash.svelte";
   import Ticket from "../utils/Tickets";
   import IMask from 'imask';


    let listTabs = {'customerData' : true, 'premisesData': true, 'lv': true,
   'db': true, 'gis' : true, 'comment' : true, 'history' : true, 'msg' : true};

    //First Lets figure out if the page has change or refresh..
    let href = listTabs[window.location.href.split("#")[1]] ? window.location.href.split("#")[1] : 'customerData';
   
    let ticket = new Ticket();
   //  let heightTicket = 600 + "px";
   
    let active = href;
    let loading = true;
   
    let dockable = false;

    export let action;
    export let newTicket = false;
    export let api;
    export let socket;

     export let router;

 
    //Handle action for the riboon and other actions..
    $: handleAction = (action) ? decideAction(action) : '';
    $: customerData = (active === 'customerData') ? '' : 'none';
    $: premisesData = (active === 'premisesData') ? '' : 'none';
    $: lv      = (active === 'lv') ? '' : 'none';
    $: db      = (active === 'db') ? '' : 'none';
    $: gis     = (active === 'gis') ? '' : 'none';
    $: comment = (active === 'comment') ? '' : 'none';
    $: history = (active === 'history') ? '' : 'none';
    $: msg     = (active === 'msg') ? '' : 'none';
   
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

    function keyPressElement(e) {
       //console.log(e);
       let element = e.target;
       if(element.tagName == "INPUT") {
          var attribute = element.getAttribute("id");
          var value = element.value;
          console.log(`VALUE IS ${value} and attribute is ${attribute}`);
          socket.emit("ticketViewer", {room: ticket.objectid,locked: true, value: value, attribute: attribute});
       }
    }

    function onBlurElement(e) {
       let element = e.target;
       if(element.tagName == "INPUT") {
          var attribute = e.target.getAttribute("id");
          var value = e.target.value;
          socket.emit("ticketViewer", {room: ticket.objectid,locked: false, value: value, attribute: attribute});
          console.log(`lost focus VALUE IS ${value} and attribute is ${attribute}`);
       }
    }

     onMount(async () => {
       

         var classname = document.getElementsByClassName("input");
         var fakeName = new Date();
     
         for (var i = 0; i < classname.length; i++) {
             classname[i].addEventListener('focus', keyPressElement, false);
            classname[i].addEventListener('keyup', keyPressElement, false);
            classname[i].addEventListener('blur', onBlurElement, false);
         }
         

         if(socket) {
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

             socket.emit("joinTicketRoom", {ticketID: ticket.objectid, name: fakeName.getTime()});
         }else{
            console.log("NO SOCKET");
         }

        
          
        

         

       
         
         if(newTicket){
            
            // ticket.fetchTicketNumber(api).then(res => res.json())
            // .then(response => 
            // console.log('Success:', response))

         }else{
             //Fetch The URL..
            console.log(router.params); // /about/bill/123/kansas { who: 'bill', where: 'kansas' }
            ticket.objectid = router.params['objectid'];
            ticket.id_ticket = router.params['idTicket'];
            if(client_status) {
               console.log("LOCAL DATABASE ACCESS");

            }else{
               console.log("FETCH THROUGH API");
              
            } 
         }

         loading = false;
         
         ticket.setUpMask();
     })

     onDestroy(async () => {
        
        
        if(socket) {
             //remove from room
            socket.emit("leaveTicketRoom", ticket.objectid);
        }
       
       
       //Remove the event listeners..
        var classname = document.getElementsByClassName("input");


         for (var i = 0; i < classname.length; i++) {
           
             classname[i].removeEventListener('focus', keyPressElement, false);
            classname[i].removeEventListener('keyup', keyPressElement, false);
            classname[i].removeEventListener('blur', onBlurElement, false);
         }
       

       ticket.destroyMask();
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
   
   <div  class="tabs tabs-wrapper top tabs-expand" style="float: left;width: 90%; overflow: auto;" >
         <div style="width: 90%;background: white; color: #CAB448;">
            <h3 >Ticket Number: {ticket.objectid}</h3>
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
               <div transition:fade  class="frame ribbed-white"  style="display: {customerData}" id="customerData">
                     <div class="form-group">
                        <label>First Name</label>
                        <input class="input" id="inputFname"  bind:value={ticket.cfirst_name} type="text" />
                     </div>
                     <div class="form-group">
                        <label>Last Name</label>
                        <input class="input" id="inputLname" bind:value={ticket.clast_name} type="text" />
                     </div>
                     <div class="form-group">
                        <label>9-1-1 Telephone</label>
                        <input class="input" id="inputTELE" bind:value={ticket.telephone_land_line} bind:this={ticket.tele_object} type="text" />
                     </div>
                     <div class="form-group">
                        <label>ALT 1 Tele</label>
                        <input class="input" id="inputALT" bind:value={ticket.alt_telephone} bind:this={ticket.alt_object}  type="text" />
                     </div>
                     <div class="form-group">
                        <label>ALT 2 Tele</label>
                        <input class="input" id="inputALT2" bind:value={ticket.alt2_telephone} bind:this={ticket.alt2_object} type="text" />
                     </div>
                     <div class="form-group">
                        <label>Email</label>
                        <input class="input" id="inputEmail" bind:value={ticket.cemail} type="email"  />
                     </div>
                     <div class="form-group">
                        <label>
                           ALT E-mail
                        </label>
                        <input class="input" id="inputALTE" bind:value={ticket.alt_cemail} type="email" />
                     </div>
                     <div class="form-group">
                        <label>Prefered Language</label>
                        <select  id="selectPRL" >
                           <option></option>
                           <option>English</option>
                           <option>Spanish</option>
                        </select>
                     </div>
                     <div class="form-group">
                        <label>Walk In</label>
                        <select id="selectWKI" >
                           <option ></option>
                           <option >Yes</option>
                           <option >No</option>
                        </select>
                     </div>
                     <div class="form-group">
                        <label>Utilities</label>
                        <select id="selectUTI" >
                           <option ></option>
                           <option >Yes</option>
                           <option >No</option>
                        </select>
                     </div>
                     <div class="form-group">
                        <label>Mailing Info</label>
                        <input class="input" id="inputMailingInfo"  type="text" />
                     </div>
               </div>
               <div  style="display: {premisesData}" id="premisesData">
                     <div class="form-group">
                        <label>Owner First Name</label>
                        <input class="input" id="inputOFName"  type="text" />
                     </div>
                     <div class="form-group">
                        <label>Owner Last Name</label>
                        <input class="input" id="inputOLName" type="text" />
                     </div>
                     <div class="form-group">
                        <label on:click={()=>{ dockable = true;}}>Subdivision</label>
                        <input class="input" id="inputSub"  on:keyup={getHCADSubSuggestions} type="text" />
                     </div>
                     <div class="form-group">
                        <label>Block Number</label>
                        <input class="input" id="inputBNumber" type="text" />
                     </div>
                     <div class="form-group">
                        <label>Lot Number</label>
                        <input class="input" id="inputLNumber" type="text" />
                     </div>
                     <div class="form-group">
                        <label>Tax Account</label>
                        <input class="input" id="inputTaxAccount" type="text" />
                     </div>
                     <div class="form-group">
                        <label>Property Id</label>
                        <input class="input" id="inputPropID" type="text" />
                     </div>
                     <div class="form-group">
                        <label>Street</label>
                        <input class="input" id="inputStreet" type="text" />
                     </div>
                     <div class="form-group">
                        <label>Intersection</label>
                        <input class="input" id="inputINTER" type="text" />
                     </div>
                     <div class="form-group">
                        <label>Building Description</label>
                        <textarea id="textareaBDes" ></textarea>
                     </div>
                     
               </div>
               <div  style="display: {lv}" id="lv">
                     <div class="form-group">
                        <label>Address Number</label>
                        <input class="input" id="inputAN" type="number" />
                     </div>
                     <div class="form-group">
                        <label>Pre Directional</label>
                        <input class="input" id="inputPRD" type="text" />
                     </div>
                     <div class="form-group">
                        <label>Road Name</label>
                        <input class="input" id="inputRN" type="text" />
                     </div>
                     <div class="form-group">
                        <label>Street Type</label>
                        <input class="input" id="inputST" type="text" />
                     </div>
                     <div class="form-group">
                        <label>Post Directional</label>
                        <input class="input" id="inputPDIR" type="text" />
                     </div>
                     <div class="form-group">
                        <label>Unit</label>
                        <input class="input" id="inputUN" type="text" />
                     </div>
                     <div class="form-group">
                        <label>MSAG Comm</label>
                        <input class="input" id="inputMSAG" type="text" />
                     </div>
                     <div class="form-group">
                        <label>Postal Comm</label>
                        <input class="input" id="inputPOSTAL" type="text" />
                     </div>
                     <div class="form-group">
                        <label>Full Address</label>
                        <input class="input" id="inputFADD" type="text" />
                     </div>
                     <div class="form-group">
                        <label>Address By</label>
                        <input class="input"  placeholder="CLICK HERE TO STAMP" type="text" />
                     </div>
                     <div class="form-group">
                        <DatePicker />
                     </div>
               </div>
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
</style>