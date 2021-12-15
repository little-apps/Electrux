import { ipcRenderer } from 'electron';
import { generateChannelName } from "@ipc/shared";

/**
 * Generates exposures that can be called by renderer process.
 *
 * @param {TAvailableIpcs} ipcs IPCs to expose to the renderer process.
 * @returns Exposures that can be called in renderer process.
 */
export const createExposures = (ipcs: TAvailableIpcs, module: keyof TAvailableIpcs) => {
	const exposures: Record<string, Record<string, (...args: any[]) => void>> = {};

	exposures[module] = {};

	if (!(module in ipcs))
		return exposures;

	for (const [name,] of Object.entries(ipcs[module])) {
		const channel = generateChannelName(module, name);

		exposures[module][name] = (...args: any[]) => ipcRenderer.send(channel, ...args);
	}

	return exposures;
};