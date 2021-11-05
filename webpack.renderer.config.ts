import { Configuration } from 'webpack';

const config: Configuration = {
    target: 'electron-renderer',
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};

export default config;
