// Modules to control application life and create native browser window
const electron = require('electron')
const { app, BrowserWindow } = electron
const path = require('path')
const url  = require('url')

var ipc = require('electron').ipcMain;


// enabled live reload for all the files inside your project
require('electron-reload')(`${__dirname}\\public`, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
  hardResetMethod: 'exit'
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let winSplash
function createSplash() {
      winSplash = new BrowserWindow({
        width: 440,
        height: 400,
        show: false,
        frame: false
    })


      winSplash.loadURL(
        url.format({
          pathname: path.join(__dirname, './public/splash/index.html'),
          protocol: 'file:',
          slashes: true
        })
      );
      createWindow()
      
      winSplash.once('ready-to-show', () => {
        winSplash.show();
      });
   
}


ipc.on('SvelteAlive', function(event, data){

    console.log(data);
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
    
    if(data.action == 'ready') {
      mainWindow.show();
      if(winSplash){
        winSplash.close();   
        winSplash.destroy();
        winSplash = null;
      }

    }else if(data.action == 'resize')
    {
        // set a single bounds property
      mainWindow.setBounds({x: 10, y: 0, width: width - 50, height: height - 50 }); 
    }
});

function createWindow () {
  // Create the browser window.
  
 
  mainWindow = new BrowserWindow({
    width: 750,
    height: 500,
    show: false,
    frame: false,
    webPreferences: {
        nodeIntegration: true
    }
  })


 

  
  // and load the index.html of the app.
  //mainWindow.loadFile(`${__dirname}\\public\\index.html`)

  mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, './public/index.html'),
			protocol: 'file:',
			slashes: true
		})
  );
  


  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })


  mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
    // if (frameName === 'modal') {
    //   // open window as modal
    //  // event.preventDefault()

      event.newGuest = new BrowserWindow({frame: true})
    // }
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
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.