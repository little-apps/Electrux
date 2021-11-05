import path from 'path';

import { ENTRY_HTML_FILE } from './constants';

export const resolvePath = (...parts: string[]) => path.resolve(process.cwd(), ...parts);

export const entryUrl = (outDir: string) => {
    return resolvePath(outDir, ENTRY_HTML_FILE);
};