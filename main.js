const electron = require('electron')
const {app, BrowserWindow} = require('electron')

let win

function createWindow(window_width = 1000, window_height = 900) {
  win = new BrowserWindow({
    width: window_width, height: window_height,
    center: true,
    title: 'Shanghai University Alfred Recreations'
  })
  win.loadURL('file://' + __dirname + '/view/homogeneous.html')
  //win.openDevTools()
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

app.on('ready', () => {
  const {window_width, window_height} = electron.screen.getPrimaryDisplay().workAreaSize
  createWindow(window_width / 2, window_height / 2)
})

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})