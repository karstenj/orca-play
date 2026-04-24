'use strict'

/* global createWindow */

const { app, BrowserWindow, Menu, protocol } = require('electron')
const path = require('path')

let isShown = true

app.win = null

// Register app:// as a standard secure scheme so all frames share the same
// origin — this is what allows orca_play.js to access iframe contentWindows.
protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: { standard: true, secure: true, supportFetchAPI: true }
}])

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')

app.on('ready', () => {
  // Serve the project root via app://app/
  protocol.registerFileProtocol('app', (request, callback) => {
    const filePath = request.url.replace(/^app:\/\/app/, '')
    callback({ path: path.normalize(path.join(__dirname, '..', filePath)) })
  })

  app.win = new BrowserWindow({
    width: 780,
    height: 462,
    minWidth: 380,
    minHeight: 360,
    backgroundColor: '#000',
    icon: path.join(__dirname, { darwin: 'icon.icns', linux: 'icon.png', win32: 'icon.ico' }[process.platform] || 'icon.ico'),
    resizable: true,
    frame: process.platform !== 'darwin',
    skipTaskbar: process.platform === 'darwin',
    autoHideMenuBar: process.platform === 'darwin',
    webPreferences: { zoomFactor: 1.0, nodeIntegration: true, backgroundThrottling: false }
  })

  app.win.loadURL('app://app/desktop/index.html')
  // app.inspect()

  app.win.on('closed', () => {
    app.quit()
  })

  app.win.on('hide', function () {
    isShown = false
  })

  app.win.on('show', function () {
    isShown = true
  })

  app.on('window-all-closed', () => {
    app.quit()
  })

  app.on('activate', () => {
    if (app.win === null) {
      createWindow()
    } else {
      app.win.show()
    }
  })
})

app.inspect = function () {
  app.win.toggleDevTools()
}

app.toggleFullscreen = function () {
  app.win.setFullScreen(!app.win.isFullScreen())
}

app.toggleMenubar = function () {
  app.win.setMenuBarVisibility(!app.win.isMenuBarVisible())
}

app.toggleVisible = function () {
  if (process.platform !== 'darwin') {
    if (!app.win.isMinimized()) { app.win.minimize() } else { app.win.restore() }
  } else {
    if (isShown && !app.win.isFullScreen()) { app.win.hide() } else { app.win.show() }
  }
}

app.injectMenu = function (menu) {
  try {
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
  } catch (_err) {
    console.warn('Cannot inject menu.')
  }
}
