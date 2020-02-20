<script>
    import {onMount, createEventDispatcher} from "svelte";
    import { fade } from 'svelte/transition';
    import {  Link } from '../lib/main';
    import SQL from '../utils/sql';

    export let Audio;

    let sql;
    let visible = false;
    let username = "";
    let password = "";
    let remMe = false;
    $: email = username.toUpperCase();
    $: base64 = btoa(password);

    const dispatch = createEventDispatcher();
 

    onMount(() => {
         dispatch("ready", true);
        
    }); 

    export function setSQL(sqlObject) {
        sql = sqlObject;
    }
    export function authenticateSQL() {
        sql = new SQL(pool, api, client_status)
        visible = true;
    }
    export function checkOnSave() {
         let account = window.localStorage.getItem("account");
        
            if(account)
            {
                account = JSON.parse(account);
              
                sql.logMeIn(account.email).then((res) => {
                
                        if(res.rows.length == 1) {
                        let found = false;
                        let user_id = 0;
                            res.rows.forEach(element => {
                                if(element.email == account.email && account.pin == 1 && element.pin_pass == account.password) {
                                    
                                        found = true;
                                        user_id = element.user_id;
                                }else if(element.email == account.email && element.password == account.password){
                                
                                    found = true;
                                    user_id = element.user_id;
                                }else {
                                    console.log("NOTIFY USER");
                                }
                            });
                            if(found){
                                dispatch("user", {user_id: user_id});
                            }
                        }
                    
                    });
            }
    }

    async function onAuthenticate() {
        console.log("AUTHENTICATE")

        let isPin = false
        let hashHex = "";
        console.log(`Remember me ${remMe}`);
    
        if(isNaN(password)) { //Not PIN
            const encoder = new TextEncoder();
            const data = encoder.encode(base64);
            const hashBuffer  = await crypto.subtle.digest('SHA-1', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
            hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
        }else { //IS a pin
            isPin = true;
        }

        if(remMe) {
            var jsonOb = JSON.stringify({email: email, password: ((isPin) ? password : hashHex), pin: ((isPin) ? 1 : 0)});
            window.localStorage.setItem("account", jsonOb);
           
        }
        
        sql.logMeIn(email).then((res) => {
                console.log(res);
                if(res.rows.length == 1) {
                   let found = false;
                   let user_id = 0;
                    res.rows.forEach(element => {
           
                        
                        if(element.email == email && isPin && element.pin_pass == password) {
                                console.log("good pin")
                                found = true;
                                user_id = element.user_id;
                        }else if(element.email == email && element.password == hashHex){
                            console.log("HASH IS AWESOME")
                            found = true;
                            user_id = element.user_id;
                        }else {
                            console.log("TELL USER BAD USERNAME ");
                            
                             //Clear storage because bad credentials...
                             window.localStorage.clear();
                            
                        }
                    });
                    if(found){
                         dispatch("user", {user_id: user_id});
                    }
                }
                
        });
        
    }

</script>
<style>
    [class*=mif-] {
    color: #CAB448;
}
.text-light{
  color: #CAB448;
  text-align: center;
}
.login-form {
    width: 34rem;
    height: 19.65rem;
    position: fixed;
    top: 50%;
    margin-top: -9.5rem;
    left: 50%;
    margin-left: -17rem;
    background-color: #ffffff;
   
    -webkit-transform: scale(.8);
    transform: scale(.8);
}
    a {
    cursor: pointer;
    color: #05173F !important;
    }
    
	.bgbody{
		width:100%;
		height: 100vh;
		background-color: #303030;
	}
    input {
        cursor: pointer !important;
    }

    .button:hover {
        background: #CAB448 !important;
        color: white !important;
    }
</style>


  

<div  class="bgbody">
    {#if visible}
    <form transition:fade class="login-form rounded bg-white p-6 padding20 block-shadow  border bd-default win-shadow"
          >
          <div style="position: absolute;top: 1.8px; z-index: 1000">
            <img src="assets/public_safety_logo.webp" width="100" height="100" alt="">
          </div>
        <span class="mif-vpn-lock mif-4x place-right" style="margin-top: -10px;"></span>
        <h2 class="text-light">SpartanPro V4</h2>
        <hr style="color: #C12F79;" class="thin mt-4 mb-4 ">
        <div class="form-group">
            <input type="text" bind:value={username} data-role="input" data-prepend="<span class='mif-envelop'>" placeholder="Enter your email..." data-validate="required email">
        </div>
        <div class="form-group">
            <input type="password" bind:value={password}   placeholder="Enter your password..." >
        </div>
        <div class="form-group mt-10">

            <div class="place-right">
                <input bind:value={remMe} type="checkbox"  >
                <span style="color: #CAB448;"> Remember Me</span>
                <br>
                <Link>Forgot Password</Link>
            </div>
           
            <button on:click|preventDefault={onAuthenticate} style="border: 1px solid #CAB448; background: transparent; color: #05173F;" class="button large rounded">Login</button>
        </div>
    </form>
    {/if}
</div>


