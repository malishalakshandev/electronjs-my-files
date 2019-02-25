// Modules to control application life and create native browser window

//const fs = require('fs');
const url = require('url');
const path = require('path');
const {app, BrowserWindow, BrowserView, Tray, Menu, MenuItem, ipcMain, globalShortcut} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let appIcon
//let browserViewInvoice


function createWindow() {


    // Create the browser window.
    mainWindow = new BrowserWindow({width: 280, height: 513, frame: false})

    mainWindow.webContents.on('will-navigate', (event) => event.preventDefault());// TO PREVENT APP STOP, WHEN DROP A FILE INTO OUT OF DROP ZONE

//  browserViewInvoice = new BrowserWindow({width: 270, height: 250, frame: false, parent: mainWindow})


//    mainWindow.loadFile('index.html')
//    mainWindow.loadFile('folderManagerComponent/index.html');

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'folderManagerComponent/index.html'),
        protocol: 'file:',
        slashes: true
    }));


//    mainWindow.setAlwaysOnTop(true, "floating", 1);// "floating" + 1 is higher than all regular windows, but still behind things // like spotlight or the screen saver
//    mainWindow.setVisibleOnAllWorkspaces(true);// allows the window to show over a fullscreen window

    // Open the DevTools.
//    mainWindow.webContents.openDevTools({mode: 'undocked'});

//    appIcon = new Tray('./icon.png')


    // Emitted when the window is closed.
    mainWindow.on('closed', function () {

        mainWindow = null
    })

}


function ViewContextMenu() {
    const ctxMenu = new Menu();
    ctxMenu.append(new MenuItem({label: 'Pin Top', click: function () {
            mainWindow.setAlwaysOnTop(true, "floating", 1);// "floating" + 1 is higher than all regular windows, but still behind things // like spotlight or the screen saver
            mainWindow.setVisibleOnAllWorkspaces(true);// allows the window to show over a fullscreen window
        }, accelerator: 'CmdOrCtrl + P'
    }));

    //KEYBOARD SHORTCUT FOR PINTOP
    globalShortcut.register('CommandOrControl+P', function () {
        mainWindow.setAlwaysOnTop(true, "floating", 1);// "floating" + 1 is higher than all regular windows, but still behind things // like spotlight or the screen saver
        mainWindow.setVisibleOnAllWorkspaces(true);// allows the window to show over a fullscreen window
    });

    ctxMenu.append(new MenuItem({label: 'Release Pin', click: function () {
            mainWindow.setAlwaysOnTop(false, "floating", 1);// "floating" + 1 is higher than all regular windows, but still behind things // like spotlight or the screen saver
            mainWindow.setVisibleOnAllWorkspaces(false);// allows the window to show over a fullscreen window
        }, accelerator: 'CmdOrCtrl + Shift + P'
    }));

    //KEYBOARD SHORTCUT FOR RELEASE PINTOP
    globalShortcut.register('CommandOrControl + Shift + P', function () {
        mainWindow.setAlwaysOnTop(false, "floating", 1);// "floating" + 1 is higher than all regular windows, but still behind things // like spotlight or the screen saver
        mainWindow.setVisibleOnAllWorkspaces(false);// allows the window to show over a fullscreen window
    });

    ctxMenu.append(new MenuItem({type: 'separator'}))

    ctxMenu.append(new MenuItem({label: 'Refresh', role: 'reload', accelerator: 'CmdOrCtrl + R'}));

    globalShortcut.register('CommandOrControl + R', function () {
        mainWindow.reload();
    })

    ctxMenu.append(new MenuItem({label: 'Minimize', role: 'minimize'}));


    ctxMenu.append(new MenuItem({label: 'Close', role: 'close'}));


    mainWindow.webContents.on('context-menu', function (e, params) {
        ctxMenu.popup(mainWindow, params.x, params.y);
    });



}





// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {

    createWindow();
    ViewContextMenu()

})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }

})




//$(document).on('click', '.pin-div', function () {
//
//    //    app.dock.hide();
//    mainWindow.setAlwaysOnTop(true, "floating", 1);// "floating" + 1 is higher than all regular windows, but still behind things // like spotlight or the screen saver
//    mainWindow.setVisibleOnAllWorkspaces(true);// allows the window to show over a fullscreen window
//});

