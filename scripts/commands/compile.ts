import { IPackageOptions } from 'electrux';
import path from 'path';

import buildMain from '../compilers/main';
import buildPreload from '../compilers/preload';
import { build as buildRenderer, watch as watchRenderer } from '../compilers/renderer';

import { MODULE_MAIN, MODULE_PRELOAD, MODULE_RENDERER } from '../constants';
import { attachOnElectronExit } from './start';

export const modules = [MODULE_MAIN, MODULE_PRELOAD, MODULE_RENDERER] as const;
export type TModule = typeof modules[number];

export interface ICompileOptions {
    modules: TModule[];
    pkg: IPackageOptions;
    baseDir: string;
    watch: boolean;
    nodeEnv: string;
}

const build = async ({ modules, pkg, baseDir, watch, nodeEnv }: ICompileOptions) => {
    const { modules: { main, preload, renderer } } = pkg;

    if (modules.includes('main')) {
        console.info('Building main...');

        const outDir = path.join(baseDir, main.outDir);

        const urlDev = watch ? pkg.modes.watch.baseUrl : path.join(renderer.outDir, renderer.htmlOutput);
        const urlProd = path.join(renderer.outDir, renderer.htmlOutput);

        console.log(
            await buildMain({
                ...main,
                preload: {
                    entry: preload.entry,
                    baseDir: preload.outDir
                },
                outDir,
                url: {
                    dev: urlDev,
                    prod: urlProd
                },
                nodeEnv
            })
        );
    }

    if (modules.includes('preload')) {
        console.info('Building preload...');

        console.log(await buildPreload({ ...preload, outDir: path.join(baseDir, preload.outDir), nodeEnv }));
    }

    if (modules.includes('renderer')) {
        console.info('Building renderer...');

        if (watch) {
            const { webpackConfig } = pkg.modes.watch;
            const server = await watchRenderer({ ...renderer, outDir: path.join(baseDir, renderer.outDir), devServer: webpackConfig, nodeEnv });

            attachOnElectronExit(() => server.stop());
        } else {
            console.log(await buildRenderer({ ...renderer, outDir: path.join(baseDir, renderer.outDir), nodeEnv }));
        }
    }
};

export default build;