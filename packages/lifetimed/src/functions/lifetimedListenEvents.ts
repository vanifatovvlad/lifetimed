import { Lifetime } from "../Lifetime.js";

type AnyEventMap = {
    [Key: string]: Event;
}

type EventMapOf<T> =
    T extends HTMLElement ? HTMLElementEventMap :
    T extends Document ? DocumentEventMap :
    T extends Window ? WindowEventMap :
    T extends WebSocket ? WebSocketEventMap :
    T extends Worker ? WorkerEventMap :
    AnyEventMap;

type EventMapKeys<EventMap> = Extract<keyof EventMap, string>;

export function lifetimedListenEvents<
    T extends EventTarget,
    M = EventMapOf<T>,
    K extends EventMapKeys<M> = EventMapKeys<M>
>(
    lifetime: Lifetime,
    target: T,
    type: K,
    listener: (this: EventTarget, ev: M[K]) => void,
    options?: AddEventListenerOptions): void

export function lifetimedListenEvents(
    lifetime: Lifetime,
    target: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions) {

    const signal = options && options.signal
        ? AbortSignal.any([options.signal, lifetime.asSignal])
        : lifetime.asSignal;

    target.addEventListener(type, listener, { ...options, signal });
}