import BaseWindow from "@main/windows/BaseWindow";

/**
 * Creates a new BaseWindow object using the name and class type.
 *
 * @template T
 * @param {string} name Name of window
 * @param {TWindowCtor} ctor BaseWindow constructor
 * @returns BaseWindow object
 */
export const createWindow = (ctor: TWindowCtor) => {
    return new ctor();
};

/**
 * Creates BaseWindow objects from object and stores them in createdWindows array.
 * @returns Records with name being the module name and the value the BaseWindow object.
 */
export const createWindows = (windowsToCreate: TWindowCtor[]) => {
    const windowsCreated: Record<string, BaseWindow> = {};

    for (const windowCtor of windowsToCreate) {
        const window = createWindow(windowCtor);

        windowsCreated[window.name] = window;
    }

    return windowsCreated;
};