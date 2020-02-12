<script>
    import {onMount} from "svelte";
    import Carousel from "./components/Carousel.svelte";
    import Customer from "./Ticket/Customer.svelte";
    import Premises from "./Ticket/Premises.svelte";
    import LV from "./Ticket/LV.svelte";
    import DB from "./Ticket/DB.svelte";
    import GIS from "./Ticket/GIS.svelte";
    import Comments from "./Ticket/Comments.svelte";
    import Connections from "./Ticket/Connections.svelte";
    import Attach from "./Ticket/Attach.svelte";
    import Messages from "./Ticket/Messages.svelte";

    let nav_elem;
    let ticketNumber = 0;
    let carousel;
    let form = {};
    let msg;
    let myself = "TICKET";
    let spartans = [];

    onMount(()=> {
        msg = document.getElementById("msg-ticket");
        if(window['ipc']){

             
             //Notify The Controller to display himself since it mounted...\
             //Also findout if is local available...
              window['ipc'].send("window-action", {"name" : myself, "GETLOCAL" : true});
             
             //MESSAGE RECEIVE INFORMATION FROM 
             window['ipc'].on("ticket:users", (event, data) =>{
                    console.log("GETING TICKET USERS");
                    console.log(data);
                    spartans = data;
                    form.customer.setUsers(spartans);
                    form.premises.setUsers(spartans);
                    form.lv.setUsers(spartans);
                    form.db.setUsers(spartans);


             });

            //On Open Ticket Get Information About Ticket...
            window['ipc'].on("open-ticket", (event, data) => {
                    console.log("")
                    console.log(data);
                    ticketNumber = (data['objectid']) ? data['objectid'] : data['id_ticket'];
                    msg.innerHTML = `Ticket: ${ticketNumber}`;
                    form.customer.onDownload(ticketNumber);
                    form.premises.onDownload(ticketNumber);
                    form.lv.onDownload(ticketNumber);
                    form.db.onDownload(ticketNumber);
            });

            //Setup Listener If available.
            window['ipc'].on("local-network", (event, data) => {
                console.log("local network is good so far...")
                window.client_status = data;
                window.sql = new window.Pool(window.db);
                
                //Notify main window ticket window is ready...
                window['ipc'].send("window-action", {"event" : "ticket:ready", "name" : "Main", "send": true});
                window['ipc'].send("window-action", {"show" : true, "name" : myself});
                
            });
        }

    });

	function onTabChange() {
        let element = this;
        
        let active = document.getElementsByClassName("active");
        
        active[0].classList.remove("active");
       
        element.classList.add("active");
       
        carousel.goTo(element.dataset.tab);
    }
    
    function onSlide(e){
        let index = e.detail;
        let active = document.getElementsByClassName("active");
        let liElements = document.querySelectorAll("li");
        active[0].classList.remove("active");

        liElements.forEach((elem) => {

            if(elem.dataset.tab == index){
                elem.classList.add("active");
                return; //exit function..
            }
        })


    }
</script>



<div bind:this={nav_elem} class="navview navview-compact-md navview-expand-lg">
                        <nav class="navview-pane">
                          
                            <ul class="navview-menu" style="height: calc(100% - 120px);">
                               

                                <li class="item-separator"></li>

                                <li class="item-header">Ticket Section</li>

                                <li on:click|preventDefault={onTabChange} data-tab="0" class="active">
                                    <a href="/#">
                                        <span class="icon"><span class="mif-contacts-dialer"></span></span>
                                        <span class="caption">CUSTOMER DATA</span>
                                    </a>
                                </li>
                                <li on:click|preventDefault={onTabChange} data-tab="1" >
                                    <a href="/#">
                                        <span class="icon"><span class="mif-compass2"></span></span>
                                        <span class="caption">PREMISES DATA</span>
                                    </a>
                                </li>
                                <li on:click|preventDefault={onTabChange} data-tab="2">
                                    <a href="/#">
                                        <span class="icon"><span class="mif-books"></span></span>
                                        <span class="caption">LV PROCESS</span>
                                       
                                    </a>
                                </li>
                                <li on:click|preventDefault={onTabChange} data-tab="3">
                                    <a href="/#" >
                                        <span class="icon"><span class="mif-database"></span></span>
                                        <span class="caption">DB VALIDATION PROCESS</span>
                                    </a>
                                </li>
                                <li on:click|preventDefault={onTabChange} data-tab="4">
                                    <a href="/#">
                                        <span class="icon"><span class="mif-images"></span></span>
                                        <span class="caption">GIS VALIDATION PROCESS</span>
                                    </a>
                                </li>

                                <li on:click|preventDefault={onTabChange} data-tab="5">
                                    <a href="/#">
                                        <span class="icon"><span class="mif-attachment"></span></span>
                                        <span class="caption">ATTACHMENTS</span>
										 <div class="badges">
                                            <span class="badge inline">10</span>
                                        </div>
                                    </a>
                                </li>
								 <li on:click|preventDefault={onTabChange} data-tab="6">
                                    <a href="/#">
                                        <span class="icon"><span class="mif-comment"></span></span>
                                        <span class="caption">COMMENTS FEED</span>
										 <div class="badges">
                                            <span class="badge inline">10</span>
                                        </div>
                                    </a>
                                </li>
								 <li on:click|preventDefault={onTabChange} data-tab="7">
                                    <a href="/#">
                                        <span class="icon"><span class="mif-info"></span></span>
                                        <span class="caption">CONNECTIONS</span>
										 <div class="badges">
                                            <span class="badge inline">10</span>
                                        </div>
                                    </a>
                                </li>
								<li on:click|preventDefault={onTabChange} data-tab="8">
                                    <a href="/#">
                                        <span class="icon"><span class="mif-folder"></span></span>
                                        <span class="caption">MESSAGES</span>
										 <div class="badges">
                                            <span class="badge inline">10</span>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </nav>

                        <div class="navview-content">
                                <Carousel on:slide={onSlide} bind:this={carousel}>
                                        <div class="swiper-slide">
                                             <Customer bind:this={form.customer} />
                                        </div>
                                        <div class="swiper-slide">
                                             <Premises bind:this={form.premises} />
                                        </div>
                                         <div class="swiper-slide">
                                             <LV bind:this={form.lv} />
                                        </div>
                                         <div class="swiper-slide">
                                             <DB bind:this={form.db} />
                                        </div>
                                         <div class="swiper-slide">
                                             <GIS bind:this={form.gis} />
                                        </div>
                                        <div class="swiper-slide">
                                             <Attach bind:this={form.attach} />
                                        </div>
                                         <div class="swiper-slide">
                                             <Comments bind:this={form.com} />
                                        </div>
                                         <div class="swiper-slide">
                                             <Connections bind:this={form.con} />
                                        </div>
                                         <div class="swiper-slide">
                                             <Messages bind:this={form.message} />
                                        </div>
                                </Carousel>
            </div>
</div>

