import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackDevServer from 'webpack-dev-server';

declare module 'electrux' {
	export interface IModuleMain {
		webpackPath: string;
		entry: {
			electron: string;
			window?: string;
		};
		outDir: string;
		tsConfigPath: string;
	}

	export interface IModulePreload {
		webpackPath: string;
		entry: Record<string, string>;
		outDir: string;
		tsConfigPath: string;
	}

	export interface IModuleRenderer {
		webpackPath: string;
		entry: string;
		outDir: string;
		tsConfigPath: string;
		html: {
			template: string;
			output: string;
			extras?: {
				dev?: HtmlWebpackPlugin.Options;
				prod?: HtmlWebpackPlugin.Options;
			};
		};
	}

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
			main: IModuleMain;
			preload: IModulePreload;
			renderer: IModuleRenderer;
		};
	}
}