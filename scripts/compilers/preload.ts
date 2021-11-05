import webpack from 'webpack';
import merge from 'webpack-merge';

import { resolvePath } from '../utils';
import { generateMessageFromStats, handleCompileCallback, webpackBaseConfig, webpackTsConfig } from '../webpack';

export type TPreloadEntries = Record<string, string>;
export type TPreloadEntry = TPreloadEntries | string;

export interface ICompilePreloadOptions {
    outDir: string;
    webpackPath: string;
    entry: TPreloadEntry;
    tsConfigPath: string;
    nodeEnv: string;
}

const createConfig = ({ outDir, webpackPath, entry, tsConfigPath, nodeEnv }: ICompilePreloadOptions) => {
    const baseConfig = webpackBaseConfig(outDir, nodeEnv);
    const tsConfig = webpackTsConfig(tsConfigPath);

    return merge(
        baseConfig,
        tsConfig,
        {
            entry,
            plugins: [
                new webpack.DefinePlugin({
                    ELECTRUX_ENV: JSON.stringify(nodeEnv)
                })
            ]
        },
        require(resolvePath(webpackPath)).default
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
