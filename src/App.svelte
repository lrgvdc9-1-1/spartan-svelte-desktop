<script>
  import {onMount} from "svelte";
  import {ticketStateWin, SpartansState} from "./stores/SpartanData.js";
  import { fade } from 'svelte/transition';
  import { Router, Route, Link, navigateTo  } from './lib/main';
  import Header from "./ui/Header.svelte";
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

  //$: console.log(`CHANGING: ${spartans.length}`)
  $: username = (isMe) ? `${isMe.first_name} ${isMe.last_name}` : 'SIGN IN - SPARTANS'
  


  //Connection to spartan chat server...
  let socket = null; //io('http://hchapa:3000'); 
  
  onMount(async () => {
      
      ipcNavigationEvents();


      //Handle All the users..
      window['ipc'].on("online", (data) => {
           

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
      });

     //Handle All the offline users..
      window['ipc'].on("offline", (data) => {

      });
  });

  //Once the application has sign in then this can happen..
  async function queryDB() {
     
      let sql = new SQL(pool, api, client_status)
      loginComponent.setSQL(sql);

      var res_orga = await sql.getOrganizationNames();
     
      organizations_name = res_orga.rows || [];
     
      sql.getAllUsers().then((res) => {
         ipc.send("socket-update-users", {"data" : res.rows});
         res.rows.forEach(em => {
            spartans.push(new User(em.user_id, em.first_name, em.middle_name, em.last_name, em.email, em.icon2, em.organization_id, em.org_name, em.work_center, em.active));
         });

         SpartansState.update(spartans => spartans = {"users": spartans, "timestamp" : new Date()}); 
        
      }).catch(err => console.log("Error executing query", err.stack));

      loginComponent.checkOnSave();


      window['ipc'].send("window-action", {"show" : true, "name" : "Main"});
      window['ipc'].send('window-action', {"close" : true, "name" : "Splash"});
      window['ipc'].send("window-action", {"local" :  true});
     
  }

  function onSelectUser(event) {
   
    spartans.forEach(spartan => {
        if(spartan.user_id === event.detail.user_id) {
          spartan.IsMe = true;
          spartan.chat = false;
          isMe = spartan;
          
          return;//stop loop..
        }
    });

    //reset with new values hope to tell the app changes..
    spartans = spartans;

    if(isMe) {
        //Let user know I am online...
        ipc.send('window-action', {"event" : 'get-user-info' , 'name' : 'GIS', "send" : isMe});
        Audio.play();
        startApp = true;
        ipc.send("socket-action", {"event" : "aboutme", "data" : isMe});
        
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

          //Listen for state when ticket pop is ready to go..
          //Once the ticket needs to send the spartans, and isMe information..
           window['ipc'].on("ticket:ready", (event, data) => {
                // WINDOW ACTION SEND SPARTANS USER TO THE WINDOW..
                window['ipc'].send("window-action", {
                    "name" : "TICKET", "event" : "ticket:users", "send" : spartans
                });
                
                // NOTIFY WINDOW TICKET ABOUT MYSELF 
                window['ipc'].send("window-action", {"name": "TICKET","event": "user:myself", "send" : isMe});
         
               ticketStateWin.update(window => window = {"open": true, "timestamp" : new Date()}); 
              
           });

            //Listen for state primarily on close window ticket
            window['ipc'].on("ticket:close", (event, data) =>{

                   ticketStateWin.update(window => window = {"close": true, "timestamp" : new Date()}); 
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

<Header />
<div style="height: 38px;"></div>
<!-- <DatePicker /> -->

<!-- <RibbonToolbar {socket} url={url} /> -->
{#if startApp}
   <!-- content here -->
  <RibbonToolbar {Audio} {sql} {isMe} {spartans} {url} />
{:else }
  <Login {spartans} {Audio} bind:this={loginComponent} on:ready={onLoginReady} on:user={onSelectUser}  />
{/if}


<StatusBar {Audio} {message} />


<!-- <Ticket /> -->