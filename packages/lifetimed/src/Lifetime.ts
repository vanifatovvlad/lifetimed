import { LifetimeAbortedError } from "./LifetimeAbortedError.js";
import { LifetimeController } from "./LifetimeController.js";
import { LifetimeAbortable, LifetimeCallback, LifetimeCallbackOrAbortable } from "./types.js";

export class Lifetime {
    private _controller: LifetimeController;

    private constructor(controller: LifetimeController) {
        this._controller = controller;
    }

    public get alive(): boolean {
        return this._controller.alive;
    }

    public get aborted(): boolean {
        return this._controller.aborted;
    }

    public get asSignal(): AbortSignal {
        return this._controller.getSignal();
    }

    public throwIfAborted() {
        if (this.aborted) {
            throw new LifetimeAbortedError(this);
        }
    }

    public onAbort(callback: LifetimeCallback): void
    public onAbort(abortable: LifetimeAbortable): void
    public onAbort(listener: LifetimeCallbackOrAbortable) {
        this._controller.onAbort(listener);
    }

    public child(): LifetimeController {
        const controller = new LifetimeController();
        this.onAbort(controller);
        return controller;
    }

    public static fromLifetimeController(controller: LifetimeController): Lifetime {
        return new Lifetime(controller);
    }

    public static any(iterable: Lifetime[]): Lifetime {
        const controller = new LifetimeController();

        for (const lifetime of iterable) {
            lifetime.onAbort(controller);
        }

        return new Lifetime(controller);
    }
}