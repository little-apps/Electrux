import { dotCase } from 'string-fn';

/**
 * Generates a channel name.
 *
 * @param {string} module
 * @param {string} name
 * @returns Channel name (in dot case)
 */
export const generateChannelName = (...parts: string[]) => {
	return parts.join('.');
}
