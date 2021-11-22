import { ipcRenderer } from 'electron';
import { generateChannelName } from "@ipc/shared";

/**
 * Generates exposures that can be called by renderer process.
 *
 * @param {TAvailableIpcs} ipcs IPCs to expose to the renderer process.
 * @returns Exposures that can be called in renderer process.
 */
export const createMainExposures = (ipcs: TAvailableIpcs) => {
	const exposures: Record<string, Record<string, (...args: any[]) => void>> = {};

	for (const [module, channels] of Object.entries(ipcs)) {
		if (!(module in exposures))
			exposures[module] = {};

		for (const [name, options] of Object.entries(channels)) {
			const channel = generateChannelName(module, name);

			exposures[module][name] = (...args: any[]) => ipcRenderer.send(channel, ...args);
		}
	}

	return exposures;
};