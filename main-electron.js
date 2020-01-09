// Modules to control application life and create native browser window
const electron = require('electron');
const { app, BrowserWindow } = electron
const path = require('path')
const url  = require('url')
const fs = require('fs');
const Shell = require('node-powershell');

const ps = new Shell({
  executionPolicy: 'Bypass',
  noProfile: true
});



//Delete all the files on the file directory...
const directory = `${__dirname}/public/files/`;

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(directory, file), err => {
      if (err) throw err;
    });
  }
});

//Done Cleaning UP...



var ipc = require('electron').ipcMain;


// enabled live reload for all the files inside your project
require('electron-reload')(`${__dirname}\\public`, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
  hardResetMethod: 'exit'
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let winMain;
let winSplash
let winProfile;
let winGIS;

function createSplash() {

  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
      winSplash = new BrowserWindow({
        width: 440,
        height: 400,
        show: false,
        frame: false
    });


    winProfile = new BrowserWindow({
        width: 500,
        height: 850,
        show: false,
        frame: false,
        webPreferences: {
          nodeIntegration: true
      }
    })

    winGIS = new BrowserWindow({
      width: width - 250,
      height: height - 250,
      show:false,
      frame: false, webPreferences:{
        //nodeIntegration: true
        preload: path.join(__dirname, "./public/components/GIS/js/preload.js")
      }
    })


    //  winGIS.loadURL('http://localhost:4200/');
    winGIS.loadURL(`file://${__dirname}/public/components/GIS/index.html`)
  

    // winGIS.loadURL(url.format({
    //   pathname: path.join(__dirname, './public/components/GIS/index.html'),
    //   protocol: 'file:',
    //   slashes: true
    // }))
    winProfile.loadURL(
      url.format({
        pathname: path.join(__dirname, './public/components/Profile/index.html'),
        protocol: 'file:',
        slashes: true
      })
    )


      winSplash.loadURL(
        url.format({
          pathname: path.join(__dirname, './public/splash/index.html'),
          protocol: 'file:',
          slashes: true
        })
      );
      
    
      
      
      createWindow(width, height)
      
      winSplash.once('ready-to-show', () => {
        winSplash.show();
      });


   
}

function openApp(cmd) {
        ps.addCommand(cmd);
        ps.invoke().then(output => {}).catch(error = {});
}




//Handles all the communication with the main thread..
//and with other windows magic happens here..
ipc.on('SvelteAlive', function(event, data){
  
    if(data.action == 'ready') {
      winMain.show();
     
      if(winSplash){
        winSplash.close();   
        winSplash.destroy();
        winSplash = null;
      }
    }else if(data.action == 'open') {

        let fileDest = __dirname + `/public/files/${data.fname}`;
        let cmd  = `Start-Process ((Resolve-Path "${fileDest}").Path)`;
        fs.writeFileSync(fileDest, data.content, {encoding: 'base64'});
        
        openApp(cmd);
       
    }
});

ipc.on("show-profile", (event, data)  => {

    winProfile.show();
     //Communicate to the window display the users information..
    winProfile.webContents.send('profile-msg', data);
     
     
});

ipc.on('hide-profile', (event, data) =>{
   winProfile.hide();
})

ipc.on('hide-gis-window', (event, data) => {
    winGIS.hide();
});


//Show GIS WINDOW IF NOT OPEN..
//If open don't do nothing...
ipc.on('show-gis-window', (event,data)=>{
    winGIS.webContents.openDevTools()
    if(!winGIS.isVisible()) winGIS.show()

});

ipc.on('window-gis-events', (event, data) => {
   console.log(data.event);
   winGIS.webContents.send(data.event, data.send);
});

ipc.on('send-gis-user', (event,data) => {
    winGIS.webContents.send('get-user-info', data);
});

ipc.on('window-main', (event, data) => {

  winMain.webContents.send(data.event, data.send);

})





//Create main window for application..
function createWindow (width, height) {
  // Create the browser window.
 
 winMain = new BrowserWindow({
    width:  width - 200,
    height: height - 200,
    show: false,
    frame: false,
    webPreferences: {
        nodeIntegration: true
    }
  })


  //Set Parent lets see what this does... lol
  winGIS.parent = winMain;


 

  
  // and load the index.html of the app.
  //winMain.loadFile(`${__dirname}\\public\\index.html`)

  winMain.loadURL(
		url.format({
			pathname: path.join(__dirname, './public/index.html'),
			protocol: 'file:',
			slashes: true
		})
  );
  


  // Open the DevTools.
  winMain.webContents.openDevTools()

  // Emitted when the window is closed.
  winMain.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    winMain = null;


    //Close all the windows available..
    if(winProfile){
      winProfile.destroy();   
      winProfile = null;
    }

    if(winGIS){
      winGIS.destroy();
      winGIS = null;
    }
    
   
    
  })


  winMain.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {

    
    if (frameName === 'modal') {
      //   // open window as modal
        //event.preventDefault();
        options.frame = true;
        Object.assign(options, {
          parent: winMain,
          width: 800,
          height: 800
        })
    }else {
        Object.assign(options, {
          parent: winMain,
          modal: true,
          width: 500,
          height: 850,
          webPreferences: {
            nodeIntegration: true
        }
      })
    }
  })
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createSplash)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (winMain === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.