const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;

function createMainWindow() {

    mainWindow = new BrowserWindow({
        icon: 'srv/icon.ico',
        width: 800, 
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    
    mainWindow.removeMenu()
    mainWindow.on('closed', ()=> app.quit())
    mainWindow.setFullScreen(true)
    mainWindow.loadFile('dist/enigma/browser/index.html');
}

app.whenReady().then(createMainWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('app:exit', ()=>{
    app.quit();
})
