declare module 'electrux' {
	export interface IPackageOptions {
		outDirs: {
			dev: string;
			prod: string;
		};

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
	}
}