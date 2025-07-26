import { Lifetime } from '../Lifetime.js';

export function lifetimedFetch(
    lifetime: Lifetime,
    input: RequestInfo | URL,
    init?: RequestInit,
): Promise<Response> {
    const signal =
        init && init.signal
            ? AbortSignal.any([init.signal, lifetime.asSignal])
            : lifetime.asSignal;

    return fetch(input, { ...init, signal });
}
