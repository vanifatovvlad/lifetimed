import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { Lifetime, LifetimeController } from "../src";

describe('Lifetime.timeout', () => {
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
    })

    test('alive when timeout in progress', () => {
        const timeouted = lifetime.timeout(1000);

        jest.advanceTimersByTime(900);

        expect(timeouted.aborted).toBe(false);
    });

    test('aborted when timeout is out', () => {
        const timeouted = lifetime.timeout(1000);

        jest.advanceTimersByTime(1100);

        expect(timeouted.aborted).toBe(true);
    });

    test('aborted when parent lifetime become aborted', () => {
        const timeouted = lifetime.timeout(1000);

        jest.advanceTimersByTime(900);

        controller.abort();

        expect(timeouted.aborted).toBe(true);
    });

    test('aborted when parent lifetime was aborted initially', () => {
        controller.abort();

        const timeouted = lifetime.timeout(1000);

        expect(timeouted.aborted).toBe(true);
    });
});