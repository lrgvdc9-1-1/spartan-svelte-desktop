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

    createWindow(nmeWindow) {

    }

    
     createSplash() {
      
        const { width, height } = _self.electron.screen.getPrimaryDisplay().workAreaSize;
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


        _self.win['TICKET'] = new _self.BrowserWindow({
            width:  width - 200,
            height: height - 150,
            show:false,
            frame: false, webPreferences:{
                
                preload: _self.path.join(_self.workspace, "./public/components/TICKET/js/preload.js")
            }
        })
    
        
        _self.win['TICKET'].loadURL(`file://${_self.workspace}/public/components/Ticket/index.html`)
        
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
      this.win['TICKET'].parent = this.win['Main'];
      
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
      
    
      //Ticket the devtools...
      this.win['TICKET'].webContents.openDevTools();
    
      // Open the DevTools.
      this.win['Main'].webContents.openDevTools()
    
      // Emitted when the window is closed.
      this.win['Main'].on('closed',  () => {
                // Dereference the window object, usually you would store windows
                // in an array if your app supports multi windows, this is the time
                // when you should delete the corresponding element.
                
                if(this.win['Main']) {
                    this.win['Main'] = null;
                }

                if(this.win['TICKET']){
                    this.win['TICKET'].destroy();
                    this.win['TICKET'] = null;
                }
            
                //Close all the windows available..
                if(this.win['Profile']){
                    this.win['Profile'].destroy();   
                    this.win['Profile'] = null;
                }
            
                if(this.win['GIS']){
                    this.win['GIS'].destroy();
                    this.win['GIS'] = null;
                }

                if(this.win['Splash']){
                    this.win['Splash'].destroy();
                    this.win['Splash'] = null;
                }

      });

}

 openApp(cmd) {
    this.ps.addCommand(cmd);
    this.ps.invoke()
    //.then(output => {}).catch(error = {});

    return;
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
        }else if(window.openFile) {


            let fileDest = _self.workspace + `/public/files/${window.fname}`;
            let cmd  = `Start-Process ((Resolve-Path "${fileDest}").Path)`;


            _self.fs.writeFileSync(fileDest, window.content, {encoding: 'base64'});
            
            _self.openApp(cmd);
            return;
        }else{
            _self.win[window.name].send(window.event, window.send);
        }
    });


  }

}

module.exports = SpartanController