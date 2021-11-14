declare module 'electroner' {
	export interface IElectronerOptions extends Record<string | number, any> {
		cwd?: string;
	}

	export type TElectronerCallback = (error: Error | null, stdout?: string, stderr?: string, code?: any) => any;

	export default function electroner(path: string, options?: IElectronerOptions | TElectronerCallback, callback?: TElectronerCallback): NodeJS.Process;
}