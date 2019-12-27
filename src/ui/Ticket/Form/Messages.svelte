<script>
        import { onMount, onDestroy, createEventDispatcher } from 'svelte';
        export let hparcels = [];
        export let wparcels = [];
        let property = ['hcad.DBO.Parcel.PROP_ID', 'HCAD2.dbo.web_map_property.hood_name', 'HCAD2.dbo.web_map_property.geo_id'];
        let hurl = "https://gis.lrgvdc911.org/php/spartan/api/v2/index.php/";
        let wurl = "https://gis.lrgvdc911.org/arcgis/rest/services/Features/Parcels/MapServer/find?";
        let count = 0;
        const dispatch = createEventDispatcher();

        onMount(()=> {
            console.log("MEssages")
            console.log(hparcels);
            
        });


        //This functions we going to use for sharing resources...
        export function updateHParcels(parcels) {
            hparcels = parcels;
        }

        //This functions we going to use for sharing resources..
        export function updateWParcels(parcels) {
            wparcels = parcels;
        }


        //Function to execute to find parcels for willacy and hidalgo parcels..
        export async function findParcels(formInputs){
                 
                //Reset count..
                count = 0;

                // setup local variables ..
                var selection = 0;
                var search_value = '';
                var search_wcad = false;
                //Here we going to loop thru all the input elements and see is there values we interested...
                
                //Identify which value we going to get first is property_id..
                if(formInputs) {
                    for(var input of formInputs){
                        //console.log(input);
                        if(input.id == "property_id" && input.value) {
                            search_value = input.value;
                            selection = 0;
                            search_wcad = true;
                            break;
                        }else if(input.id == "" && input.value){
                            search_value = input.value;
                            selection = 2;
                            break;
                        }
                        else if(input.id == ""  && input.value){
                            selection = 1;
                            break;
                        }
                    }

                }
       
                
                var hcadsearch = `proxy/findHCADParcels/?search=${search_value}&field=${property[selection]}`;
               
             
                let response_hcad = await fetch(hurl + hcadsearch);
               

                response_hcad = await  response_hcad.json();
               

              
                
                response_hcad = (typeof(response_hcad) == "string") ? JSON.parse(response_hcad) : response_hcad;
                if(response_hcad && response_hcad.results.length > 0){

                        response_hcad.results.forEach(element => {
                                element.moreinfo = false;
                                element.display = [];
                        });

                     hparcels = response_hcad.results;
                     count += response_hcad.results.length;
                     console.log(`COUNT ROWS ${count}`)
                }

                if(search_wcad) { //only search if prop id is specified..

                    let wcadsearch = `searchText=${search_value}&sr=4326&contains=true&searchFields=pid&layers=0&returnGeometry=true&f=pjson`;
                    let response_wcad = await fetch(wurl + wcadsearch);
                    response_wcad = await response_wcad.json();
                    count += response_wcad.results.length;
                    console.log(`type of this is ${typeof(response_wcad)}`);
                    console.log(response_wcad);
                }

                console.log(`total count is ${count}`);

                dispatch("totalMSG", count);

        }

       function openMessageTable(index, parcel) {
           
            parcel.display = [];
            parcel.moreinfo = !parcel.moreinfo;

            if(parcel.moreinfo){
                for(var x in parcel.attributes) {
                    parcel.display.push({"name" : x, "value" : parcel.attributes[x]});
                }
            }
            

            hparcels[index] = parcel;


        }

        function copyConfiramtion() {

        }

        function displayMap() {

        }

        function shortHand(inValue, slice){

            return inValue.substring(0, slice) + '...';
        }


</script>
<div class="form-group" style="width: 14%;">

         <div class="input">
            <input type="text" placeholder="Search Parcels" id="search" >
        <div class="button-group">
         <button  data-copy="longy"  class="button input-search-button"><span style="color: #05173F !important" class="mif-search"></span></button>
        </div>
   </div>
</div>

<table class="table">
    <caption><h3>HCAD</h3></caption>
    <thead>
    <tr>
        <th></th>
        <th>Owner Name</th>
         <th>Subdivision</th>
         <th >Tax ID</th>
         <th >Property ID</th>
    </tr>
    </thead>
    <tbody>
        {#each hparcels as parcel, i}
             <!-- content here -->
             <tr >
                            <td>
                              <button class="button cycle dark drop-shadow" on:click="{() => openMessageTable(i, parcel)}">
                                  {#if parcel.moreinfo}
                                       <span class="mif-minus"></span>
                                  {:else}
                                       <span class="mif-plus"></span>
                                  {/if}
                                  
                            </button>
                              <button class="button cycle dark drop-shadow" on:click="{copyConfiramtion}"><span class="mif-copy"></span></button>
                              <button class="button cycle dark drop-shadow" on:click="{displayMap}" ><span class="mif-location"></span></button>
                            </td>
                            <td>
                            { 
                            ((parcel.attributes.owner_name.length>24)  ? shortHand(parcel.attributes.owner_name, 24) : (parcel.attributes.owner_name))
                            }</td>
                            <td>
                            { 
                            
                                (parcel.attributes.hood_name.length>14) ? shortHand(parcel.attributes.hood_name, 14) :(parcel.attributes.hood_name)    
                            
                            }</td>
                             <td>{parcel.attributes.geo_id}</td>
                             <td>{parcel.attributes.PROP_ID}</td>
                        </tr>

                        {#if parcel.moreinfo}
                             <tr >
                                <td>
                                    <table class="table"  style="padding-left:100px;" cellspacing="0" cellpadding="5" border="0">
                                        <tbody>
                                            {#each parcel.display as item}
                                                 <tr >
                                                        <td>{item.name}:</td><td>{item.value}</td>
                                                 </tr>
                                            {/each}
                                        </tbody>
                                    </table>
                                </td> 
                            </tr>
                        {/if}
                        
        {/each}
    </tbody>
</table>

<table class="table">
    <caption><h3>WCAD</h3></caption>
    <thead>
    <tr>
         <th></th>
         <th>Owner Name</th>
         <th>Subdivision</th>
         <th >Tax ID</th>
         <th >Property ID</th>
    </tr>
    </thead>
    <tbody>
      {#each wparcels as parcel, i}
             <!-- content here -->
             <tr >
                            <td>
                              <button class="button cycle dark drop-shadow" on:click="{() => openMessageTable(i, parcel)}">
                                  {#if parcel.moreinfo}
                                       <span class="mif-minus"></span>
                                  {:else}
                                       <span class="mif-plus"></span>
                                  {/if}
                                  
                            </button>
                              <button class="button cycle dark drop-shadow" on:click="{copyConfiramtion}"><span class="mif-copy"></span></button>
                              <button class="button cycle dark drop-shadow" on:click="{displayMap}" ><span class="mif-location"></span></button>
                            </td>
                            <td>
                            { 
                            ((parcel.attributes.owner_name.length>24)  ? shortHand(parcel.attributes.owner_name, 24) : (parcel.attributes.owner_name))
                            }</td>
                            <td>
                            { 
                            
                                (parcel.attributes.hood_name.length>14) ? shortHand(parcel.attributes.hood_name, 14) :(parcel.attributes.hood_name)    
                            
                            }</td>
                             <td>{parcel.attributes.geo_id}</td>
                             <td>{parcel.attributes.PROP_ID}</td>
                        </tr>

                        {#if parcel.moreinfo}
                             <tr >
                                <td>
                                    <table class="table"  style="padding-left:100px;" cellspacing="0" cellpadding="5" border="0">
                                        <tbody>
                                            {#each parcel.display as item}
                                                 <tr >
                                                        <td>{item.name}:</td><td>{item.value}</td>
                                                 </tr>
                                            {/each}
                                        </tbody>
                                    </table>
                                </td> 
                            </tr>
                        {/if}
                        
        {/each}
    </tbody>
</table>