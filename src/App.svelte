<script>
  import {onMount} from "svelte";
	import RibbonToolbar from './ui/RibbonToolbar.svelte';
	import Login from "./pages/Login.svelte";
	import Ticket from './pages/Ticket.svelte';
	import DatePicker from './ui/DatePicker.svelte';
  import svelte from 'svelte/compiler';
  import SQL from './utils/sql';
  import User from './utils/User';

  console.log(`CURRENT VERSION OF SVELTE RUNNING: ${svelte.VERSION}v`);
  
  //Main API EndPOINT
	let url = "https://gis.lrgvdc911.org/php/spartan/api/v2/index.php/";
  let spartans = [];
  let isMe = null;
  let sql = new SQL(client, api, client_status)

  //Connection to spartan chat server...
  let socket = io('http://localhost:3000');
  
  onMount(async () => {
 
  });

  function queryDB() {
      console.timeEnd("init");
      let sql = new SQL(client, api, client_status)

      sql.getActiveUsers().then((res) => {
         res.rows.forEach(em => {
            spartans.push(new User(em.user_id, em.first_name, em.middle_name, em.last_name, em.email, em.icon2, em.organization_id, em.work_center));
         });

         console.log(spartans);
      })
  }

  function onSelectUser(event) {
    console.log(event);
    spartans.forEach(spartan => {
        if(spartan.user_id === event.detail.user_id) {
          spartan.IsMe = true;
          isMe = spartan;
          return;//stop loop..
        }
    });

    //reset with new values hope to tell the app changes..
    spartans = spartans;

    console.log(spartans)
  }


	
</script>

<style>
  #titlebar {
	display: block;
	position: fixed;
  width: 100%;
  height: 38px;
  background: #05173F;
  
  z-index: 2;
  border-bottom: 2px solid #CAB448;
}

#titlebar #drag-region {
  width: 100%;
  height: 100%;
  cursor: grab;
  -webkit-app-region: drag;
}
#titlebar {
  color: #FFF;
}
#titlebar #drag-region {
  display: grid;
  grid-template-columns: auto auto 138px;
}
#window-title {
  grid-column: 2;
  display: flex;
  align-items: center;
  margin-left: 20px;
 
}
#window-icon {
  grid-column: 1;
  display: flex;
  align-items: center;
  margin-left: 8px;
}
#window-title span {
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
}
#window-controls {
  display: grid;
  grid-template-columns: repeat(3, 46px);
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  font-family: segoe;
  font-size: 10px;
}
#window-controls {
  -webkit-app-region: no-drag;
}
#window-controls .button {
  grid-row: 1 / span 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
#window-controls .button {
  user-select: none;
  color: #BBB;
  background: transparent;
}
#window-controls .button:hover {
  background: rgba(255,255,255,0.2);
  color: #FFF;
  cursor: pointer;
}
#window-controls #min-button {
  grid-column: 1;
}
#window-controls #max-button, #window-controls #restore-button {
  grid-column: 2;
}
#window-controls #restore-button {
  display: none;
}
#window-controls #close-button {
  grid-column: 3;
}
#window-controls #close-button:hover {
  background: #E81123;
}



</style>
<svelte:window on:clientready={queryDB}></svelte:window>

<header id="titlebar">
      <div id="drag-region" style="cursor: grab !important;">
        <div id="window-icon">
          <img width="50" height="50" src="./assets/spartan_logo.webp" alt="Spartan Logo">
        </div>
        <div id="window-title">
         
          <span>Spartan Pro Desktop</span>
        </div>

        <div id="window-controls">
          <div class="button" id="min-button">
            <span>&#xE921;</span>
          </div>
          <div class="button" id="max-button">
            <span>&#xE922;</span>
          </div>
          <div class="button" id="restore-button">
            <span>&#xE923;</span>
          </div>
          <div class="button" id="close-button">
            <span>&#xE8BB;</span>
          </div>

        </div>
      </div>
    </header>
<div style="height: 38px;"></div>
<!-- <DatePicker /> -->
<Login on:user={onSelectUser}  />
<!-- <RibbonToolbar {socket} url={url} /> -->
<!-- <RibbonToolbar {spartans} url={url} /> -->
<!-- <Ticket /> -->