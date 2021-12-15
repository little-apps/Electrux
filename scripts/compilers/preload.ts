import webpack from 'webpack';
import merge from 'webpack-merge';

import { IModulePreload } from 'electrux';
import { resolvePath } from '@scripts/utils';
import { generateMessageFromStats, handleCompileCallback, webpackBaseConfig, webpackTsConfig } from '@scripts/webpack';

export type TPreloadEntries = Record<string, string>;
export type TPreloadEntry = TPreloadEntries | string;

export interface ICompilePreloadOptions {
    outDir: string;
    nodeEnv: string;
    options: Omit<IModulePreload, 'outDir'>;
}

const createConfig = ({ outDir, nodeEnv, options }: ICompilePreloadOptions) => {
    const baseConfig = webpackBaseConfig(outDir, nodeEnv);
    const tsConfig = webpackTsConfig(options.tsConfigPath);

    return merge(
        baseConfig,
        tsConfig,
        {
            entry: options.entry,
            plugins: [
                new webpack.DefinePlugin({
                    ELECTRUX_ENV: JSON.stringify(nodeEnv)
                })
            ]
        },
        require(resolvePath(options.webpackPath)).default
    );
}

export default async (options: ICompilePreloadOptions) => {
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
