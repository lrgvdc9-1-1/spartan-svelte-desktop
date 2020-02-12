let _self = null;
class SpartanController{

    constructor(ipc, electron, browser, path, url, fs, Shell, directory, dialog)
    {
        this.ipc = ipc;
        this.electron = electron;
        this.BrowserWindow = browser;
		this.dialog = dialog;
        this.path = path;
        this.url = url;
        this.fs = fs;
        this.width = 0;
        this.height = 0;
        this.localClient = false;
        if(Shell) {
            this.ps =  new Shell({
                executionPolicy: 'Bypass',
                noProfile: true
              });
        }
        
        
        this.win =  {
            "Main" : null,
            "Splash" : null,
            "Profile" : null,
            "GIS" : null,
            "TICKET" : null
         };
        
        this.workspace = directory;

        this.fileURL = {
            "TICKET" : `file://${this.workspace}/public/components/Ticket/index.html`
        }
        this.preloads = {
            "TICKET" : this.path.join(this.workspace, "./public/components/TICKET/js/preload.js")
        }
        _self = this;

        this.setupIPCEvents();
    }

    cleanUpFiles(dir) {
        this.fs.readdir(dir, (err, files) => {
            if (err) throw err;
        
            for (const file of files) {
                this.fs.unlink(this.path.join(dir, file), err => {
                    if (err) throw err;
                });
            }
        });

    }



    
     createSplash() {
      
        const { width, height } = _self.electron.screen.getPrimaryDisplay().workAreaSize;
        _self.width = width;
        _self.height = height;
		//_self.dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
        _self.win['Splash'] = new _self.BrowserWindow({
            width: 440,
            height: 400,
            show: false,
            frame: false
        });
    
    
        _self.win['Profile'] = new _self.BrowserWindow({
            width: 500,
            height: 850,
            show: false,
            frame: false,
            webPreferences: {
                nodeIntegration: true
            }
        })
    
        _self.win['GIS'] = new _self.BrowserWindow({
            width: width - 250,
            height: height - 250,
            show:false,
            frame: false, webPreferences:{
            //nodeIntegration: true
            preload: _self.path.join(_self.workspace, "./public/components/GIS/js/preload.js")
            }
        })


       
        
        _self.win['GIS'].loadURL(`file://${_self.workspace}/public/components/GIS/index.html`)
        
    
        _self.win['Profile'].loadURL(
            _self.url.format({
            pathname: _self.path.join(_self.workspace, './public/components/Profile/index.html'),
            protocol: 'file:',
            slashes: true
            })
        )
    
    
            _self.win['Splash'].loadURL(
            _self.url.format({
                pathname: _self.path.join(_self.workspace, './public/splash/index.html'),
                protocol: 'file:',
                slashes: true
            })
            );
            
            
            
            _self.createMainWindow(width, height)
        
            _self.win['Splash'].once('ready-to-show', () => {
                _self.win['Splash'].show();
            });
  
  
     
  }

  createMainWindow(width, height) {
    
    //Main Window Creation..
    this.win['Main'] = new this.BrowserWindow({
        width:  width - 200,
        height: height - 200,
        show: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
      })
    
    
      //Set Parent lets see what this does... lol
      this.win['GIS'].parent = this.win['Main'];
      
    
      
      // and load the index.html of the app.
      //winMain.loadFile(`${__dirname}\\public\\index.html`)
    
      //Load the URL..
      this.win['Main'].loadURL(
            this.url.format({
                pathname: this.path.join(_self.workspace, './public/index.html'),
                protocol: 'file:',
                slashes: true
            })
      );
      
    
   
    
      // Open the DevTools.
      this.win['Main'].webContents.openDevTools()
    
      // Emitted when the window is closed.
      this.win['Main'].on('closed',  () => {
                
            
               //If the main event is closed.
               //Destroy all the other windows to close the application.
               //Loop through all window  key's
               for(var key in this.win){
                   if(key == "Main"){
                       this.win[key] = null;
                   }else if(this.win[key]) {
                       this.win[key].destroy();
                       this.win[key] = null;
                   }
               }
      });

}

 openApp(cmd) {
    this.ps.addCommand(cmd);
    this.ps.invoke()
    //.then(output => {}).catch(error = {});

    return;
}

     //Create ANY WINDOW WE WANTS BASED ON CONFIGS...
  createWindow(name, yespreload) {
    if(!_self.win[name] && yespreload) {
          _self.win[name] = new _self.BrowserWindow({
              width:  _self.width - 200,
              height: _self.height - 150,
              show:false,
              frame: false, webPreferences:{
                  
                  preload: _self.preloads[name]
              }
          })
     
          _self.win[name].loadURL(_self.fileURL[name])


           // Open the DevTools.
             _self.win[name].webContents.openDevTools()

      }else if(!_self.win[name]){
            _self.win[name] = new _self.BrowserWindow({
                width:  _self.width - 200,
                height: _self.height - 150,
                show:false,
                frame: false
            })
    
            _self.win[name].loadURL(_self.fileURL[name])     
            
             // Open the DevTools.
             _self.win[name].webContents.openDevTools()

      }
  }


  setupIPCEvents() {

    this.ipc.on('window-action', (event, window) => {

        if(window.show) {

            _self.win[window.name].show();

           
        }
        else if(window.hide){
            _self.win[window.name].hide();
        }
        else if(window.close){
            _self.win[window.name].close();
            _self.win[window.name].destroy();
            _self.win[window.name] = null;

            if(window.name == 'TICKET'){
                _self.win['Main'].send("ticket:close", true);
            }
            
        
            
        }else if(window.create){

            //If window null create window...
            if(_self.win[window.name] == null) _self.createWindow(window.name, window.preyes)
        } 
        else if(window.local){
            _self.localClient = window.local;
        }
        else if(window.openFile) {


            let fileDest = _self.workspace + `/public/files/${window.fname}`;
            let cmd  = `Start-Process ((Resolve-Path "${fileDest}").Path)`;


            _self.fs.writeFileSync(fileDest, window.content, {encoding: 'base64'});
            
            _self.openApp(cmd);
            return;
        }else if(window.GETLOCAL){
           
            if(_self.localClient) {
                _self.win[window.name].send("local-network", _self.localClient);
            }
        }else{

            //Only Send Information if the window is available...
            if(_self.win[window.name]){
                _self.win[window.name].send(window.event, window.send);
            }
        }
    });


  }

 

}

module.exports = SpartanController