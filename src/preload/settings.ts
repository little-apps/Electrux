import { createExposures } from '@ipc/preload';
import { contextBridge } from 'electron';
import ipcs from '@constants/ipcs';

console.log('👋 Hello from the preload side!');

contextBridge.exposeInMainWorld('electron', createExposures(ipcs, 'settings'));