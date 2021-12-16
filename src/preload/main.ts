import { createExposures } from '@ipc/preload';
import { contextBridge } from 'electron';
import ipcs from '@constants/ipcs';

console.log('👋 Hello from the preload side!');

// Define any functionality for the renderer to call in the main process.

contextBridge.exposeInMainWorld('electron', createExposures(ipcs, 'main', 'settings'));