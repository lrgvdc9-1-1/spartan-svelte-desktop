// Modules to control application life and create native browser window
const SpartanController = require('./js/SpartanController');
const electron = require('electron');
const { app, BrowserWindow } = electron
const path = require('path')
const url  = require('url')
const fs = require('fs');
const Shell = require('node-powershell');
var ipc = require('electron').ipcMain;

const ps = new Shell({
  executionPolicy: 'Bypass',
  noProfile: true
});

//Spartan Controllers Handles Creation, Communication of windows.
let spartan = new SpartanController(ipc, electron, BrowserWindow, path, url, fs, Shell, __dirname);






//Delete all the files on the file directory...
const directory = `${__dirname}/public/files/`;
spartan.cleanUpFiles(directory);


// enabled live reload for all the files inside your project
//require('electron-reload')(`${__dirname}\\public`, {
 // electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
 // hardResetMethod: 'exit'
//});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.



// function openApp(cmd) {
//         ps.addCommand(cmd);
//         ps.invoke().then(output => {}).catch(error = {});
// }




//Handles all the communication with the main thread..
//and with other windows magic happens here..
// ipc.on('SvelteAlive', function(event, data){
  
//     if(data.action == 'ready') {
//       winMain.show();
     
//       if(winSplash){
//         winSplash.close();   
//         winSplash.destroy();
//         winSplash = null;
//       }
//     }else if(data.action == 'open') {

//         let fileDest = __dirname + `/public/files/${data.fname}`;
//         let cmd  = `Start-Process ((Resolve-Path "${fileDest}").Path)`;
//         fs.writeFileSync(fileDest, data.content, {encoding: 'base64'});
        
//         openApp(cmd);
       
//     }
// });

// ipc.on("show-profile", (event, data)  => {

//     winProfile.show();
//      //Communicate to the window display the users information..
//     winProfile.webContents.send('profile-msg', data);
     
     
// });

// ipc.on('hide-profile', (event, data) =>{
//    winProfile.hide();
// })

// ipc.on('hide-gis-window', (event, data) => {
//     winGIS.hide();
// });


// //Show GIS WINDOW IF NOT OPEN..
// //If open don't do nothing...
// ipc.on('show-gis-window', (event,data)=>{
//     winGIS.webContents.openDevTools()
//     if(!winGIS.isVisible()) winGIS.show()

// });

// ipc.on('window-gis-events', (event, data) => {
//    console.log(data.event);
//    winGIS.webContents.send(data.event, data.send);
// });

// ipc.on('send-gis-user', (event,data) => {
//     winGIS.webContents.send('get-user-info', data);
// });

// ipc.on('window-main', (event, data) => {

//   winMain.webContents.send(data.event, data.send);

// })





  // win['Main'].webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {

    
  //   if (frameName === 'modal') {
  //     //   // open window as modal
  //       //event.preventDefault();
  //       options.frame = true;
  //       Object.assign(options, {
  //         parent: winMain,
  //         width: 800,
  //         height: 800
  //       })
  //   }else {
  //       Object.assign(options, {
  //         parent: winMain,
  //         modal: true,
  //         width: 500,
  //         height: 850,
  //         webPreferences: {
  //           nodeIntegration: true
  //       }
  //     })
  //   }
  // })
//}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', spartan.createSplash)//createSplash)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  // if (win['Main'] === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.