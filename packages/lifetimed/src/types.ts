export type LifetimeCallback = () => void;
export type LifetimeCallbackOrAbortable = LifetimeCallback | LifetimeAbortable;

export interface LifetimeAbortable {
    abort: () => void;
}

export function isLifetimeAbortable(object: object): object is LifetimeAbortable {
    return 'abort' in object;
}