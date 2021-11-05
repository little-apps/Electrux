import { Configuration } from 'webpack';

const config: Configuration = {
    target: 'electron-main',
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
};

export default config;
