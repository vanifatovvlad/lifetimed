import { Lifetime } from "./Lifetime.js";

export class LifetimeAbortedError extends Error {
    public readonly lifetime: Lifetime;

    constructor(lifetime: Lifetime) {
        super();

        this.lifetime = lifetime;
    }
}