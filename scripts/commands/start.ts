import electroner, { TElectronerCallback } from 'electroner';

type TElectronOnStartCallback = () => void;
type TElectronOnExitCallback = (params: Parameters<TElectronerCallback>) => void;

const onStartCallbacks: TElectronOnStartCallback[] = [];
const onExitCallbacks: TElectronOnExitCallback[] = [];

export const attachOnElectronStart = (callback: TElectronOnStartCallback) => {
	if (!onStartCallbacks.includes(callback))
		onStartCallbacks.push(callback);
}

export const attachOnElectronExit = (callback: TElectronOnExitCallback) => {
	if (!onExitCallbacks.includes(callback))
		onExitCallbacks.push(callback);
}

const start = async (entry: string) => {
	console.log('Starting Electron...');

	onStartCallbacks.forEach((cb) => cb());

	electroner(entry, (err, stdout, stderr) => {
		onExitCallbacks.forEach((cb) => cb([err, stdout, stderr]));
	});
};

export default start;
