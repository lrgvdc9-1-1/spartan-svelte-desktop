
async function  initDB() {

		
		// DO DNS LOOK UP local network connect to db
		// if not fail over to API http request 
		// Assume client status is offline..
		client_status = false;
		try {
		
			await dns.lookup('911.local', {all: true}, async (err, addresses) =>
				{

				
					if(addresses){
						
						client_status = (addresses.length > 0) ? true : false;
						if(client_status) {
							try { //Try to connect if fail then tell the app to switch
								pool = new Pool(db) //Connect to database...
								//console.log("SQL Local");
								pool.connect((err, client, release) => {
									if(err) {
										window.dispatchEvent(new Event('clientfailed'));
										return;
									}
									release();
                                    window.dispatchEvent(new Event('clientready'));
									return;
								}); 

							} catch (error) {
								console.log("FAILED")
								window.dispatchEvent(new Event('clientfailed'));
								client_status = false;
							}
						}	
					}else {
						console.log("CLIENT FAILED");
						client_status = false;
						window.dispatchEvent(new Event('clientfailed'));
					}
					
				
								
				}
			);
       
		} catch (error) {
			console.log(err);
			client_status = false;
			window.dispatchEvent(new Event('clientfailed'));
		}
    
}

initDB();

window.onbeforeunload = function(){
    // Do something
    if(client_status){
        pool.end(); //Close the connection...
    }
 }


window.addEventListener('online',  () =>{
	client_status = true;
});
window.addEventListener('offline', () => {
	client_status = false;
});


