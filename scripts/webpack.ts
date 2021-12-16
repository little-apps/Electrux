import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import webpack from "webpack";

import { resolvePath } from "@scripts/utils";

/**
 * Generates the Webpack configuration to be used by all modules.
 *
 * @param {string} outDir
 * @param {string} nodeEnv
 * @returns Webpack configuration
 */
const webpackBaseConfig = (outDir: string, nodeEnv: string) => {
    const inDevMode = nodeEnv === 'development';

    const config: webpack.Configuration = {
        devtool: inDevMode ? 'eval-source-map' : 'source-map',
        mode: inDevMode ? 'development' : 'production',
        output: {
            path: resolvePath(outDir),
            filename: '[name].js'
        },
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }
            ]
        }
    };

    return config;
};

/**
 * Generates Webpack configuration so Typescript files are compiled.
 *
 * @param {string} tsConfigPath Relative path to tsconfig.json file.
 * @return Webpack configuration
 */
const webpackTsConfig = (tsConfigPath: string) => ({
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    configFile: resolvePath(tsConfigPath)
                }
            }
        ]
    },
    resolve: {
        plugins: [
            new TsconfigPathsPlugin({
                configFile: resolvePath(tsConfigPath)
            })
        ]
    },
});

/**
 * Generates a message from Webpack stats.
 *
 * @param {webpack.Stats} stats
 * @returns Message to be displayed.
 */
const generateMessageFromStats = (stats: webpack.Stats) => {
	const info = stats.toJson();
	let message = '';

	if (stats.hasWarnings()) {
		message += `${info.warnings}\n`;
	}

	message += stats.toString({ colors: true });

	return message;
}

/**
 * Changes Webpack callback into a Promise.
 *
 * @param {Error} [err]
 * @param {webpack.Stats} [stats]
 * @returns Resolved promise with stats or rejection with error.
 */
const handleCompileCallback = async (err?: Error, stats?: webpack.Stats) => {
    return new Promise<webpack.Stats | undefined>((resolve, reject) => {
        if (err) {
            reject(err.stack ? new Error(err.stack) : err);
        } else if (stats) {
            const info = stats.toJson();

            if (stats.hasErrors()) {
                reject(info.errors);
            } else {
                resolve(stats);
            }
        } else {
            resolve(undefined);
        }
    });
}

/**
 * Checks if variable is an an array of Webpack stats errors.
 *
 * @param {*} obj
 * @returns {obj is webpack.StatsError[]}
 */
const isStatsErrors = (obj: any): obj is webpack.StatsError[] => {
    if (Array.isArray(obj)) {
        if (obj.length === 0)
            return true;

        return obj.findIndex((item) => !isStatsError(item)) === -1;
    }

    return false;
};

/**
 * Checks if object is a Webpack stats error.
 *
 * @param {*} obj
 * @returns {obj is webpack.StatsError}
 */
const isStatsError = (obj: any): obj is webpack.StatsError => {
    return (
        typeof obj === 'object' &&
        ('message' in obj && typeof obj.message === 'string')
    );
};

export {
    webpackBaseConfig,
    webpackTsConfig,
    generateMessageFromStats,
    handleCompileCallback,
    isStatsErrors,
    isStatsError
};