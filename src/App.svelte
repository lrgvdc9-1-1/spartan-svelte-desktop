<script>
  import {onMount} from "svelte";
  import { fade } from 'svelte/transition';
  import { Router, Route, Link, navigateTo  } from './lib/main';
	import RibbonToolbar from './ui/RibbonToolbar.svelte';
	import Login from "./pages/Login.svelte";
	import Ticket from './pages/Ticket.svelte';
	import DatePicker from './ui/DatePicker.svelte';
  import svelte from 'svelte/compiler';
  import SQL from './utils/sql';
  import User from './utils/User';
  import StatusBar from './ui/Notifications/StatusBar.svelte';


  console.log(`CURRENT VERSION OF SVELTE RUNNING: ${svelte.VERSION}v`);
  
  //Main API EndPOINT
	let url = "https://gis.lrgvdc911.org/php/spartan/api/v2/index.php/";
  let spartans = [];
  let organizations_name = [];
  let isMe = null;
  let sql = new SQL(pool, api, client_status)
  let login = false;
  let loginComponent;
  let send = false;
  let startApp = false;
  let shMenu = false;
  let message = 'ONLINE';
  let Audio;

  $: console.log(`CHANGING: ${spartans.length}`)
  $: username = (isMe) ? `${isMe.first_name} ${isMe.last_name}` : 'SIGN IN - SPARTANS'
  


  //Connection to spartan chat server...
  let socket = io('http://hchapa:3000'); 
  
  onMount(async () => {
      
      ipcNavigationEvents();
      socket.on("online", (users) => { // Collect all the users...

      
          //Reset everythign to no socket id, and online off everyone.
          spartans.forEach(spartan => {
             spartan.SOCKETID = null;
             spartan.ONLINE = 0;
          });

          //Then Change which spartan to be on or off..
          for(var x in users) {
              let user = users[x];
              spartans.forEach(spartan => {
                    if(user.uid == spartan.UID) {
                      spartan.SOCKETID = user.socketid;
                      spartan.ONLINE = 1;
                      return; //Kill for each..
                    }
              });
          }

          //Reassig itself..
          spartans = spartans;
      })

      //Future for comunication esri map with main application..

  });

  //Once the application has sign in then this can happen..
  async function queryDB() {
      console.timeEnd("init");
      let sql = new SQL(pool, api, client_status)
      loginComponent.setSQL(sql);

      var res_orga = await sql.getOrganizationNames();
      //console.log(res_orga);
      organizations_name = res_orga.rows || [];
      console.log(organizations_name);
      sql.getActiveUsers().then((res) => {
        
         res.rows.forEach(em => {
            spartans.push(new User(em.user_id, em.first_name, em.middle_name, em.last_name, em.email, em.icon2, em.organization_id, em.org_name, em.work_center));
         });
         console.log(spartans);
      }).catch(err => console.log("Error executing query", err.stack));

      loginComponent.checkOnSave();
      window['ipc'].send("window-action", {"show" : true, "name" : "Main"});
      window['ipc'].send('window-action', {"close" : true, "name" : "Splash"});
      window['ipc'].send("window-action", {"event" : "local-network", "name" : "TICKET", "send" : true});
     
  }

  function onSelectUser(event) {
   
    spartans.forEach(spartan => {
        if(spartan.user_id === event.detail.user_id) {
          spartan.IsMe = true;
          spartan.chat = false;
          isMe = spartan;
          console.log(isMe);
          return;//stop loop..
        }
    });

    //reset with new values hope to tell the app changes..
    spartans = spartans;

    if(isMe) {
        //Let user know I am online...
        ipc.send('window-action', {"event" : 'get-user-info' , 'name' : 'GIS', "send" : isMe});//send-gis-user', isMe);
        Audio.play();
        startApp = true;
        socket.emit("aboutme", isMe); //Tell Socket about me..
    }

  }

  function ipcNavigationEvents() {
    if(window.ipc) {
        window.ipc.on("open-ticket", (event, data) => {
            navigateTo(`#viewTicket/${data['id_ticket']}/${data['objectid']}`)
           
        });
        window.ipc.on("new-ticket", (event, data) => {
            
            if(data['lat'] && data['long']) {
                 
                 var lat = data['lat'].toString().replace(".", ",");
                 var lng = data['long'].toString().replace(".", ",");
                 navigateTo(`#newTicket/${lat}/${lng}`)
           
            }
           
        });
    }
  }

  function onLoginReady() {
    // if(!login) {
    //   login = true;
    //   setTimeout(() => {
    //       ipc.send('SvelteAlive', {"action" : "ready"});
    //   }, 600); 
    // }
    loginComponent.authenticateSQL();
  }

  function onLogOut() {
     isMe = null;
     shMenu = false;
     startApp = false;
     window.localStorage.clear();
  }

  function onExit() {
     if(pool) {
        pool.end();
    }
     let window = remote.getCurrentWindow();
     window.close();
  }

  function onProfile() {
    shMenu = false;
   
    //Communicate with the main thread to toggle profile..
    ipc.send('window-action', {
            "name" : "Profile",
            "event": "profile-msg",
            "send" : {"me" : isMe, "myself" : true}
            
            });
           window['ipc'].send("window-action", {
            "show": true,
            "name"  : "Profile"
        }) 
  }

  function onFailedDNS() {
    window['ipc'].send('window-action', {
      "close" : true,
      "name" : "Splash"
    });
    window['ipc'].send("window-action", {
      "show" : true,
      "name" : "Main"
    })
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
    grid-template-columns: 80px auto 125px 138px;
  }
  #window-title {
    grid-column: 2;
    display: flex;
    align-items: center;
    bottom: 8px;
    
  
  }


  #window-icon {
    grid-column: 1;
    display: flex;
    align-items: center;
    margin-left: 8px;
  }

  #window-username {
    position: absolute;
    z-index: 4;
    align-items: center;
    right: 126px;
    top: 4px;
  }

  #window-username button:hover {
    cursor: pointer;
  }
  #window-title span {
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
  }
  #window-controls {
    display: grid;
    grid-template-columns: repeat(4, 46px);
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
    grid-column: 3;
  }
  #window-controls #max-button, #window-controls #restore-button {
    grid-column: 4;
  }
  #window-controls #restore-button {
    display: none;
  }
  #window-controls #close-button {
    grid-column: 5;
  }
  #window-controls #close-button:hover {
    background: #E81123;
  }
  .subMenu {
    list-style: none;
      position: absolute;
      z-index: 5;
      background: #05173F;
      width: 109px;
      top: 18px;
      /* bottom: 16px; */
      height: auto;
      right: -16px;
      padding: 10px;

  }

  li:hover {
    cursor: pointer;
    background: #CAB448;
  }

</style>
<svelte:window on:clientfailed={onFailedDNS} on:clientready={queryDB}></svelte:window>
<audio bind:this={Audio} id="myAudio">
  <source src="./music-tones/filling-your-inbox.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>

<div  id="window-username">
              <button on:blur={()=>{shMenu = false;}} style="color:#CAB448; background: transparent; border: 0;" 
                      on:click={()=>{shMenu = (isMe) ? !shMenu : false;}}>
                {username}
                <span class="mif-arrow-drop-down"></span>
              </button>
              
              {#if shMenu} 
                <ul transition:fade  class="subMenu">
                    <li on:click={onProfile}>
                      <span class="mif-profile"></span>
                      Profile
                    </li>
                    <li on:click={onLogOut}><span class="mif-lock"></span>
                    Log Out</li>
                    <li on:click={onExit}>
                      <span class="mif-exit"></span>
                      Exit
                    </li>
                </ul>
              {/if}
          </div>
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

<!-- <RibbonToolbar {socket} url={url} /> -->
{#if startApp}
   <!-- content here -->
  <RibbonToolbar {Audio} {sql} {socket} {isMe} {spartans} {url} />
{:else }
  <Login {Audio} bind:this={loginComponent} on:ready={onLoginReady} on:user={onSelectUser}  />
{/if}


<StatusBar {Audio} {message} />


<!-- <Ticket /> -->