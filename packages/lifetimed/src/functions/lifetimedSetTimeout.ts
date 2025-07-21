import { Lifetime } from "../Lifetime.js";

export function lifetimedSetTimeout(lifetime: Lifetime, callback: () => void, delay?: number): void {
    const controller = lifetime.child();

    const timeout = setTimeout(() => {
        controller.abort();
        callback();
    }, delay);

    controller.onAbort(() => clearTimeout(timeout));
}