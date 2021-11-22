import BaseWindow from "@main/windows/BaseWindow";

/**
 * Creates a new BaseWindow object using the name and class type.
 *
 * @template T
 * @param {string} name Name of window
 * @param {new(name: string) => T} ctor Class type with constructor that takes in name.
 * @returns BaseWindow object
 */
export const createWindow = <T extends BaseWindow>(name: string, ctor: new(name: string, createWindow?: boolean) => T) => {
    return new ctor(name);
};

/**
 * Creates BaseWindow objects from object and stores them in createdWindows array.
 *
 */
export const createWindows = (windowsToCreate: TWindows) => {
    const windowsCreated: Record<string, BaseWindow> = {};

    for (const [name, type] of Object.entries(windowsToCreate)) {
        const window = createWindow(name, type);

        windowsCreated[name] = window;
    }

    return windowsCreated;
};