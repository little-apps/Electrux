import { Configuration } from 'webpack';

const config: Configuration = {
    target: 'electron-preload',
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};

export default config;
