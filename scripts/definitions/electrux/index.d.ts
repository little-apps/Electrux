import WebpackDevServer from 'webpack-dev-server';

declare module 'electrux' {
	export interface IPackageOptions {
		modes: {
			dev: {
				entry: string;
				outDir: string;
			};

			prod: {
				entry: string;
				outDir: string;
			};

			watch: {
				webpackConfig: WebpackDevServer.Configuration;
				baseUrl: string;
			};
		};
		
		modules: {
			main: {
				webpackPath: string;
				entry: string;
				outDir: string;
				tsConfigPath: string;
			};

			preload: {
				webpackPath: string;
				entry: Record<string, string>;
				outDir: string;
				tsConfigPath: string;
			};

			renderer: {
				webpackPath: string;
				entry: string;
				htmlTemplate: string;
				htmlOutput: string;
				outDir: string;
				tsConfigPath: string;
			};
		};


	}
}