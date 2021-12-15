
import path from 'path';
import { IPackageOptions } from 'electrux';

import buildMain from '@scripts/compilers/main';
import buildPreload from '@scripts/compilers/preload';
import { build as buildRenderer, watch as watchRenderer } from '@scripts/compilers/renderer';

import { attachOnElectronExit } from '@scripts/commands/start';

import { MODULE_MAIN, MODULE_PRELOAD, MODULE_RENDERER } from '@scripts/constants';

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

        const urlDev = watch ? pkg.modes.watch.baseUrl : path.join(renderer.outDir, renderer.html.output);
        const urlProd = path.join(renderer.outDir, renderer.html.output);

        console.log(
            await buildMain({
                preload: {
                    entry: preload.entry,
                    baseDir: preload.outDir
                },
                outDir,
                url: {
                    dev: urlDev,
                    prod: urlProd
                },
                nodeEnv,
                options: main
            })
        );
    }

    if (modules.includes('preload')) {
        console.info('Building preload...');

        console.log(await buildPreload({ outDir: path.join(baseDir, preload.outDir), nodeEnv, options: preload }));
    }

    if (modules.includes('renderer')) {
        console.info('Building renderer...');

        if (watch) {
            const { webpackConfig } = pkg.modes.watch;
            const server = await watchRenderer({ outDir: path.join(baseDir, renderer.outDir), devServer: webpackConfig, nodeEnv, options: renderer });

            attachOnElectronExit(() => server.stop());
        } else {
            console.log(await buildRenderer({ outDir: path.join(baseDir, renderer.outDir), nodeEnv, options: renderer }));
        }
    }
};

export default build;