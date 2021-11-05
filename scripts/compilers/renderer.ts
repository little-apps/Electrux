import { webpack } from "webpack";
import merge from "webpack-merge";
import HtmlWebpackPlugin from "html-webpack-plugin";
import WebpackDevServer from 'webpack-dev-server';
import path from 'path';

import { resolvePath } from '../utils';
import { webpackBaseConfig, webpackTsConfig, generateMessageFromStats, handleCompileCallback } from '../webpack';

export interface ICompileRendererOptions {
    outDir: string;
    webpackPath: string;
    entry: string;
    htmlTemplate: string;
    htmlOutput: string;
    tsConfigPath: string;
    nodeEnv: string;
}

export interface IWatchRendererOptions extends ICompileRendererOptions {
    devServer: WebpackDevServer.Configuration;
}

const createConfig = ({ outDir, webpackPath, entry, htmlTemplate, htmlOutput, tsConfigPath, nodeEnv }: ICompileRendererOptions) => {
    const baseConfig = webpackBaseConfig(outDir, nodeEnv);
    const tsConfig = webpackTsConfig(tsConfigPath);

    return merge(
        baseConfig,
        tsConfig,
        {
            entry: {
                renderer: resolvePath(entry)
            },
            plugins: [
                new HtmlWebpackPlugin({
                    filename: resolvePath(path.join(outDir, htmlOutput)),
                    template: resolvePath(htmlTemplate)
                })
            ]
        },
        require(resolvePath(webpackPath)).default
    );
}

export const watch = async (options: IWatchRendererOptions) => {
    const config = createConfig(options);

    const compiler = webpack({ ...config, target: 'web' });

    const devServerOptions = { ...options.devServer, open: false };
    const server = new WebpackDevServer(devServerOptions, compiler);

    return new Promise<WebpackDevServer>((resolve, reject) => {
        server.startCallback(() => {
            resolve(server);
        });
    });
};

export const build = async (options: ICompileRendererOptions) => {
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
