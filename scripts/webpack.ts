import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import webpack from "webpack";
import { resolvePath } from "./utils";

export const webpackBaseConfig = (outDir: string, nodeEnv: string) => {
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

export const webpackTsConfig = (tsConfigPath: string) => ({
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

export const generateMessageFromStats = (stats: webpack.Stats) => {
	const info = stats.toJson();
	let message = '';

	if (stats.hasWarnings()) {
		message += `${info.warnings}\n`;
	}

	message += stats.toString({ colors: true });

	return message;
}

export const handleCompileCallback = async (err?: Error, stats?: webpack.Stats) => {
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

export const isStatsErrors = (obj: any): obj is webpack.StatsError[] => {
    if (Array.isArray(obj)) {
        if (obj.length === 0)
            return true;

        return obj.findIndex((item) => !isStatsError(item)) === -1;
    }

    return false;
};

export const isStatsError = (obj: any): obj is webpack.StatsError => {
    return (
        typeof obj === 'object' &&
        ('message' in obj && typeof obj.message === 'string')
    );
};