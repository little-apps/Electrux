import webpack from "webpack";
import merge from 'webpack-merge';
import path from 'path';

import { resolvePath } from '@scripts/utils';
import { webpackBaseConfig, webpackTsConfig, handleCompileCallback, generateMessageFromStats } from '@scripts/webpack';
import { TPreloadEntry } from '@scripts/compilers/preload';

interface IPreloadOptions {
    baseDir: string;
    entry: TPreloadEntry;
}

export interface ICompileMainOptions {
    outDir: string;
    webpackPath: string;
    entry: string;
    tsConfigPath: string;
    preload: IPreloadOptions;
    url: {
        prod: string;
        dev: string;
    };
    nodeEnv: string;
}

const createPreloadDefines = ({ entry, baseDir }: IPreloadOptions) => {
    const defines: Record<string, string> = {};

    if (typeof entry === 'string') {
        const { name } = path.parse(entry);

        defines.ELECTRUX_PRELOAD = JSON.stringify(path.join(baseDir, `${name}.js`));
    } else {
        for (const [key, value] of Object.entries(entry)) {
            const { name } = path.parse(value);

            defines[`ELECTRUX_PRELOAD_${key.toUpperCase()}`] = JSON.stringify(path.join(baseDir, `${name}.js`));
        }
    }

    return defines;
};

const createConfig = ({ outDir, webpackPath, entry, tsConfigPath, preload, url, nodeEnv }: ICompileMainOptions) => {
    const baseConfig = webpackBaseConfig(outDir, nodeEnv);
    const tsConfig = webpackTsConfig(tsConfigPath);

    return merge(
        baseConfig,
        tsConfig,
        {
            entry: {
                main: resolvePath(entry)
            },
            plugins: [
                new webpack.DefinePlugin({
                    ELECTRUX_ENV: JSON.stringify(nodeEnv),
                    ELECTRUX_DEV_URL: JSON.stringify(url.dev),
                    ELECTRUX_PROD_URL: JSON.stringify(url.prod),
                    ...createPreloadDefines(preload)
                })
            ]
        },
        require(resolvePath(webpackPath)).default
    );
}

export default async (options: ICompileMainOptions) => {
    return new Promise<string>((resolve, reject) => {
        const config = createConfig(options);

        webpack(config, (e, s) => {
            handleCompileCallback(e, s).then((stats) => {
                resolve(stats ? generateMessageFromStats(stats) : '');
            }).catch((err) => {
                reject(err);
            });
        });
    });
}
