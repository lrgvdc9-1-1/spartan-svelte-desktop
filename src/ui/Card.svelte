<script>
    import {  navigateTo  } from '../lib/main';
    import { fade, fly } from 'svelte/transition';
    import CheckBox from './CheckBox.svelte';
    import EsriMap from './EsriMap.svelte';  

    export let created_date;
    export let cfirst_name;
    export let clast_name;
    export let cfull_name;
    export let view;
    export let staff;
    export let x;
    export let y;
    export let id_ticket;
    export let objectid;
    export let walk_in;
    export let icon;
    export let icon_transfer;
    export let init;

    let MapView = false;
    function toggleMapView(value) {
        MapView = value;
    }
    async function MapError() {
        
        MapView = false;
       
        
     }
</script>

<style>
    img {
        max-width: 100%;
        max-height: 100%;
    }

      .card {
        margin-top: 0 !important;
    }
</style>

<div  in:fly={{ y: 200, duration: 2000 }} out:fade class="card">
            <div class="card-header">
                <div class="avatar">
                    <img src="../../assets/globe-map-icon.webp" alt="Map Preview">
                </div>
                <div class="name">{cfirst_name + " " + clast_name}</div>
                <div class="date">{created_date}</div>
            </div>
            <div  class:p-2={!MapView} class="card-content">
                {#if MapView}  
                    <EsriMap on:MapError={MapError} pictureURLMarker={"../../assets/PurpleShinyPin.png"} center={[x, y]} />
                {:else}
                    <img  src="./assets/globe-map-icon.webp" alt="Map Preview">
                {/if}       
            </div>
            <div class="card-footer">
                    <CheckBox checkDefaultValue={MapView} on:checkmark={(event)=>{toggleMapView(event.detail.value)}}></CheckBox>
                    <button class="button secondary mif-file-archive"></button>
                    <button on:click="{()=> {navigateTo(`#viewTicket/${id_ticket}/${objectid}`)}}" class="button secondary mif-folder-open"></button>
                    <button class="button secondary mif-share"></button>
            </div>
</div>