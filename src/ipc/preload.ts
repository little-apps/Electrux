import { ipcRenderer } from 'electron';
import { generateChannelName } from "@ipc/shared";

/**
 * Generates exposures that can be called by renderer process.
 *
 * @param {TAvailableIpcs} ipcs IPCs to expose to the renderer process.
 * @returns Exposures that can be called in renderer process.
 */
export const createExposures = (ipcs: TAvailableIpcs, ...modules: (keyof TAvailableIpcs)[]) => {
	const exposures: Record<string, Record<string, (...args: any[]) => void>> = {};

	for (const module of modules) {
		exposures[module] = {};

		if (typeof ipcs[module] !== 'object')
			continue;

		for (const [name,] of Object.entries(ipcs[module])) {
			const channel = generateChannelName(module, name);

			exposures[module][name] = (...args: any[]) => ipcRenderer.send(channel, ...args);
		}
	}

	return exposures;
};