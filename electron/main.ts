// electron/main.ts
import { app, BrowserWindow, session } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // In development, use the Next.js dev server
  const isDev = process.env.NODE_ENV !== 'production';
  const url = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../out/index.html')}`;
  
  // Gestisci la navigazione per evitare 404
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    if (isDev) {
      // Reindirizza tutte le navigazioni al server di sviluppo
      const parsedUrl = new URL(navigationUrl);
      event.preventDefault();
      mainWindow?.loadURL(`http://localhost:3000${parsedUrl.pathname}`);
    }
  });
  
  mainWindow.loadURL(url);
  
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});