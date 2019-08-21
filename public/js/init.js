
async function  initDB() {
   
    await client.connect(); //await to Connect to the database...

    //Couple of test everything works fine...
    client.on('error', err => {
        console.error('something bad has happened!', err.stack)
    })
    //This is just for testing..
    client.query('SELECT NOW()', (err, res) => {
            console.log(err, res)

    })
}

initDB();

window.onbeforeunload = function(){
    // Do something
    if(client){
        client.end(); //Close the connection...
    }
 }