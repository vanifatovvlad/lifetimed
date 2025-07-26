import { Lifetime } from './Lifetime.js';
import {
    LifetimeAbortable,
    isLifetimeAbortable,
    LifetimeCallbackOrAbortable,
    LifetimeCallback,
} from './types.js';

export class LifetimeController implements LifetimeAbortable {
    private _aborted: boolean;
    private _listenersCount: number;
    private _listeners: (null | LifetimeCallbackOrAbortable)[];
    private _abortController?: AbortController;

    constructor() {
        this._aborted = false;
        this._listenersCount = 0;
        this._listeners = new Array(2);
        this._abortController = undefined;
    }

    public get alive(): boolean {
        return !this._aborted;
    }

    public get aborted(): boolean {
        return this._aborted;
    }

    public getLifetime(): Lifetime {
        return Lifetime.fromLifetimeController(this);
    }

    public getSignal(): AbortSignal {
        if (!this._abortController) {
            this._abortController = new AbortController();

            if (this.aborted) {
                this._abortController.abort();
            }
        }

        return this._abortController.signal;
    }

    public abort() {
        if (this.aborted) {
            return;
        }

        for (let i = this._listenersCount - 1; i >= 0; i--) {
            const listener = this._listeners[i];

            if (listener != null) {
                this.callListener(listener);
            }

            this._listeners[i] = null;
        }

        this._listenersCount = 0;
        this._listeners = [];
        this._aborted = true;

        if (this._abortController) {
            this._abortController.abort();
        }
    }

    public onAbort(callback: LifetimeCallback): void;
    public onAbort(abortable: LifetimeAbortable): void;
    public onAbort(listener: LifetimeCallbackOrAbortable): void;
    public onAbort(listener: LifetimeCallbackOrAbortable) {
        if (this.aborted) {
            this.callListener(listener);
            return;
        }

        if (this._listenersCount === this._listeners.length) {
            this.compactifyListeners();

            if (this._listenersCount == this._listeners.length) {
                this._listeners.length = this._listenersCount * 2;
            }
        }

        this._listeners[this._listenersCount++] = listener;
    }

    private compactifyListeners() {
        let newCount = 0;

        for (let i = 0; i < this._listenersCount; i++) {
            const listener = this._listeners[i];

            const listenerIsAborted =
                listener instanceof LifetimeController && listener.aborted;
            if (!listenerIsAborted) {
                this._listeners[newCount++] = this._listeners[i];
            }
        }

        for (let i = newCount; i < this._listenersCount; i++) {
            this._listeners[i] = null;
        }

        this._listenersCount = newCount;
    }

    private callListener(listener: LifetimeCallbackOrAbortable) {
        try {
            if (isLifetimeAbortable(listener)) {
                listener.abort();
            } else {
                listener();
            }
        } catch (error) {
            console.error(error);
        }
    }
}
