import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { Lifetime, LifetimeController, lifetimedSetTimeout } from "../../src";

describe('lifetimedSetTimeout', () => {
    const LISTENERS_COUNT = '_listenersCount';
    const COMPACTIFY_LISTENERS = 'compactifyListeners';

    let controller: LifetimeController;
    let lifetime: Lifetime;

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    beforeEach(() => {
        controller = new LifetimeController();
        lifetime = controller.getLifetime();
    });

    afterEach(() => {
        controller.abort();
    });

    test('callback executed in time', () => {
        let runs = '';

        lifetimedSetTimeout(lifetime, () => runs += 'R', 1000);

        jest.advanceTimersByTime(900);
        expect(runs).toBe('');

        jest.advanceTimersByTime(200);
        expect(runs).toBe('R');
    });

    test('callback not executed when lifetime is aborted', () => {
        let runs = '';

        lifetimedSetTimeout(lifetime, () => runs += 'R', 1000);

        controller.abort();
        expect(runs).toBe('');

        jest.advanceTimersByTime(1100);
        expect(runs).toBe('');
    });

    test('cleaned up from parent`s buffer on completion', () => {
        lifetimedSetTimeout(lifetime, () => {}, 600);
        lifetimedSetTimeout(lifetime, () => {}, 800);
        lifetimedSetTimeout(lifetime, () => {}, 1000);
        lifetimedSetTimeout(lifetime, () => {}, 1200);

        jest.advanceTimersByTime(900);
        controller[COMPACTIFY_LISTENERS]();
        expect(controller[LISTENERS_COUNT]).toBe(2);

        jest.advanceTimersByTime(400);
        controller[COMPACTIFY_LISTENERS]();
        expect(controller[LISTENERS_COUNT]).toBe(0);
    });
});