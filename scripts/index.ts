import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import path from 'path';

import pkg from '../package.json';

import { isStatsErrors } from '@scripts/webpack';
import build, { modules, ICompileOptions, TModule } from '@scripts/commands/compile';
import start, { attachOnElectronExit } from '@scripts/commands/start';

(async () => {
    const { config: { electrux } } = pkg;

    const argv = yargs(hideBin(process.argv))
        .command(
            'compile [module]',
            'Compile the JavaScript files for specified module.'
        )
        .positional('module', {
            choices: [...modules, 'all'],
            default: 'all'
        })
        .command('start', 'Starts Electron')
        .option('watch', {
            description: 'Spins up Webpack Dev Server.',
            type: 'boolean',
            default: false
        })
        .option('entry', {
            description: 'Path to entry JavaScript file (relative to the project root directory) for Electron.',
            type: 'string'
        })
        .parseSync();

    try {
        const nodeEnv = process.env.NODE_ENV || 'development';
        const baseDir = nodeEnv === 'development' ? electrux.modes.dev.outDir : electrux.modes.prod.outDir;

        console.info(`Build environment: ${nodeEnv}`);

        if (argv._.includes('compile')) {
            console.info(`Output directory: ${path.resolve(baseDir)}`);

            const options: ICompileOptions = {
                modules: (argv.module !== 'all' ? [argv.module] : modules) as TModule[],
                pkg: electrux,
                watch: argv.watch,
                baseDir,
                nodeEnv
            };

            await build(options);
        }

        if (argv._.includes('start')) {
            attachOnElectronExit(([err, stdout, stderr]) => {
                if (err)
                    console.error(err);

                if (stdout)
                    console.log(stdout);

                if (stderr)
                    console.error(stderr);
            });

            let entry: string;

            if (typeof argv.entry !== 'undefined') {
                entry = path.resolve(__dirname, '..', argv.entry);
            } else {
                entry = nodeEnv === 'development' ? electrux.modes.dev.entry : electrux.modes.prod.entry;
            }

            console.info(`Entry point: ${entry}`);

            await start(entry);
        }
    } catch (e) {
        if (isStatsErrors(e)) {
            console.table(e.slice(0, 5), ['file', 'message']);
        } else {
            console.error(e);
        }
    }
})();
