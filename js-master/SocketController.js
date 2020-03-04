let _self = null;
const User = require('./User');
class SocketController{
    constructor(io, url, ipc, spController)
    {
        this.socket = io(url);
        this.spartans = [];
        this.ticketRoom = "";
        this.worksheetRoom = "";
        this.indexMe = -1;
        this.ipc = ipc;
        this.socketid = 0;
        this.spartanController = spController;
        _self = this;


        this.setupSocketEvents();
        this.setupIPCEvents();
    }

    //Function: Purpose is to get communications from window
    //to send to socket server and advise other clients..
    setupIPCEvents() {

        this.ipc.on("socket-update-users", (event, window) => {
         
          
           let users = window.data || [];
            users.forEach(em => {
                _self.spartans.push(new User(em.user_id, em.first_name, em.middle_name, em.last_name, em.email, em.icon2, em.organization_id, em.org_name, em.work_center, em.active));
            });

          
           
        });

        this.ipc.on("socket-is-me", (event, window) => {
            var user = window.data;

            if(_self.spartans) {
                var length = _self.spartans.length;
                for(var i = 0; i < length; i++) {
                    if(_self.spartans[i].EMAIL == user.email) {
                        _self.spartans[i].me = true;
                        _self.spartans[i].socket_id = _self.socketid;
                        _self.indexMe = i;
                        break;
                    }
                    
                }

                console.log(_self.spartans[_self.indexMe]);
                //console.log(_self.spartans);

            }
        });

        this.ipc.on("socket-action", (event, window) =>{
            
            _self.socket.emit(window.name, window.data);
        })
    }

    //This will get all the emits send by the server...
    //Collect the information receiving from the server and sending it to 
    //the particular window been viewe
    setupSocketEvents() {

        
        this.socket.on("online", (data) => {
            if(data.socketid == _self.socketid) {

            }
        });

        this.socket.on("offline", (data) => {

        });

        this.socket.on("socketid", (data) => {
            //var window = _self.spartanController.getWindows();
            _self.socketid = data;           
        });
    }


}

module.exports = SocketController;