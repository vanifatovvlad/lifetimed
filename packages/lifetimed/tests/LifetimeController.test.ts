import { test, beforeEach, afterEach, expect, describe, vi } from 'vitest';
import { Lifetime } from '../src/Lifetime.js';
import { LifetimeController, LifetimeAbortedError } from "../src/index.js";

describe('Lifetime', () => {
    const LISTENERS = '_listeners';
    const LISTENERS_COUNT = '_listenersCount';
    const COMPACTIFY_LISTENERS = 'compactifyListeners';

    let controller: LifetimeController;
    let lifetime: Lifetime;

    beforeEach(() => {
        controller = new LifetimeController();
        lifetime = controller.getLifetime();
    });

    afterEach(() => {
        controller.abort();
    });

    test('alive lifetime is `alive`', () => {
        expect(lifetime.alive).toBe(true);
        expect(lifetime.aborted).toBe(false);

        expect(controller.alive).toBe(true);
        expect(controller.aborted).toBe(false);
    });

    test('aborted lifetime is `aborted`', () => {
        controller.abort();

        expect(lifetime.alive).toBe(false);
        expect(lifetime.aborted).toBe(true);

        expect(controller.alive).toBe(false);
        expect(controller.aborted).toBe(true);
    });

    test('multiple calls of `abort` function no throws', () => {
        controller.abort();
        controller.abort();
    });

    test('`throwIfAborted` not throws on alive lifetime', () => {
        lifetime.throwIfAborted();
    });

    test('`throwIfAborted` throws on aborted lifetime', () => {
        controller.abort();

        expect(() => lifetime.throwIfAborted()).toThrow(LifetimeAbortedError);
    });

    test('call callback once on lifetime abort', () => {
        let runs = '';
        lifetime.onAbort(() => runs += 'R');
        controller.abort();

        expect(runs).toBe('R');
    });

    test('skip error in lifetime callback', () => {
        console.error = vi.fn();

        let runs = '';

        lifetime.onAbort(() => runs += 'A');
        lifetime.onAbort(() => {
            throw new Error('should be logged and skipped')
        });
        lifetime.onAbort(() => runs += 'C');

        controller.abort();

        expect(runs).toBe('CA');
        expect(console.error).toHaveBeenCalled();
    });

    test('call lifetime callbacks in reversed order', () => {
        let runs = '';
        lifetime.onAbort(() => runs += 'A');
        lifetime.onAbort(() => runs += 'B');
        lifetime.onAbort(() => runs += 'C');

        controller.abort();

        expect(runs).toBe('CBA');
    });

    test('call nested lifetime callbacks in reverse order', () => {
        let runs = '';
        lifetime.onAbort(() => runs += 'A');
        lifetime.child().onAbort(() => runs += 'B');
        lifetime.onAbort(() => runs += 'C');

        controller.abort();

        expect(runs).toBe('CBA');
    });

    test('lifetime listeners cleaned on abort', () => {
        controller.onAbort(() => { });
        controller.onAbort(() => { });

        controller.abort();

        expect(controller[LISTENERS_COUNT]).toBe(0);
        expect(controller[LISTENERS]).toHaveLength(0);
    });

    test('child lifetime aborting does not lead to parent lifetime abort', () => {
        const childController = lifetime.child();

        childController.abort();

        expect(lifetime.aborted).toBe(false);
    });

    test('child lifetime aborts with parent lifetime', () => {
        const childLifetime = lifetime.child();

        controller.abort();

        expect(childLifetime.aborted).toBe(true);
    });

    test('callback called immediately on aborted lifetime', () => {
        let runs = '';

        controller.abort();

        lifetime.onAbort(() => runs += 'R');

        expect(runs).toBe('R');
    });

    test('AbortSignal on alive lifetime is not aborted', () => {
        const signal = lifetime.asSignal;

        expect(signal.aborted).toBe(false);
    });

    test('AbortSignal on aborted lifetime is aborted', () => {
        const signal = lifetime.asSignal;

        controller.abort();

        expect(signal.aborted).toBe(true);
    });

    test('AbortSignal created from aborted lifetime is aborted', () => {
        controller.abort();

        const signal = lifetime.asSignal;

        expect(signal.aborted).toBe(true);
    });

    test('internal buffer correctly grows', () => {
        expect(controller[LISTENERS_COUNT]).toBe(0);
        expect(controller[LISTENERS]).toHaveLength(2);

        lifetime.onAbort(() => { }); // №1
        lifetime.onAbort(() => { }); // №2

        expect(controller[LISTENERS_COUNT]).toBe(2);
        expect(controller[LISTENERS]).toHaveLength(2);

        lifetime.onAbort(() => { }); // №3

        expect(controller[LISTENERS_COUNT]).toBe(3);
        expect(controller[LISTENERS]).toHaveLength(4);

        lifetime.onAbort(() => { }); // №4
        lifetime.onAbort(() => { }); // №5
        lifetime.onAbort(() => { }); // №6

        expect(controller[LISTENERS_COUNT]).toBe(6);
        expect(controller[LISTENERS]).toHaveLength(8);
    });

    test('internal buffer correcly compacting', () => {
        lifetime.onAbort(() => { }); // №1

        const children = [
            lifetime.child(), // №2
            lifetime.child(), // №3
            lifetime.child() // №4
        ];

        // spy on private function
        // eslint-disable-next-line
        const compactifySpy = vi.spyOn(controller, COMPACTIFY_LISTENERS as any);

        expect(compactifySpy).toHaveBeenCalledTimes(0);
        expect(controller[LISTENERS_COUNT]).toBe(4);
        expect(controller[LISTENERS]).toHaveLength(4);

        children.forEach(it => it.abort());

        lifetime.onAbort(() => { }); // №2
        lifetime.onAbort(() => { }); // №3
        lifetime.onAbort(() => { }); // №4

        expect(compactifySpy).toHaveBeenCalledTimes(1);
        expect(controller[LISTENERS_COUNT]).toBe(4);
        expect(controller[LISTENERS]).toHaveLength(4);

        lifetime.onAbort(() => { }); // №5

        expect(compactifySpy).toHaveBeenCalledTimes(2);
        expect(controller[LISTENERS_COUNT]).toBe(5)
        expect(controller[LISTENERS]).toHaveLength(8);
    });
});