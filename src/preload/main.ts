import { ipcRenderer, contextBridge } from 'electron';

console.log('👋 Hello from the preload script!');

// Define any functionality for the renderer to call in the main process.
contextBridge.exposeInMainWorld("electron", {
    settings: {
        show: () => {
            ipcRenderer.send("settings-show");
        },
    }
});

