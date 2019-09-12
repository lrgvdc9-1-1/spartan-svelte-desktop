
async function  initDB() {
   
    if(client_status) {
		console.time("init");
		// DO DNS LOOK UP local network connect to db
		// if not fail over to API http request 
		client_status = false;
		try {
			await dns.lookup('911.local', {all: true}, async (err, addresses) =>
				{
					if(addresses){
						console.log("I CAN CONTACT 911.local")
						client_status = (addresses.length > 0) ? true : false;
						if(client_status) {
							try { //Try to connect if fail then tell the app to switch
								client = new Client(db) //Connect to database...
								//console.log("SQL Local");
								client.connect(err => {
									if(err) {
                                        window.dispatchEvent(new Event('clientfailed'));
									}else {
                                        window.dispatchEvent(new Event('clientready'));
									}
								}); //await to Connect to the database...
								
								

								// client.on('end', (res) => {
								// 	console.log(`END: ${res}`)
								// })

							} catch (error) {
								console.log("FAILED")
								window.dispatchEvent(new Event('clientfailed'));
								client_status = false;
							}
						}	
					}else {
						client_status = false;
						window.dispatchEvent(new Event('clientfailed'));
					}
					
				
								
				}
			);
       
		} catch (error) {
			client_status = false;
			window.dispatchEvent(new Event('clientfailed'));
		}
		

      
    }
    
}

initDB();

window.onbeforeunload = function(){
    // Do something
    if(client_status){
        client.end(); //Close the connection...
    }
 }