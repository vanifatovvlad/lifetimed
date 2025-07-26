import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { Lifetime, LifetimeController } from "../src";

describe('Lifetime.timeout', () => {
    let controller: LifetimeController;
    let lifetime: Lifetime;

    beforeAll(() => {
        vi.useFakeTimers();
    });

    afterAll(() => {
        vi.useRealTimers();
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

        vi.advanceTimersByTime(900);

        expect(timeouted.aborted).toBe(false);
    });

    test('aborted when timeout is out', () => {
        const timeouted = lifetime.timeout(1000);

        vi.advanceTimersByTime(1100);

        expect(timeouted.aborted).toBe(true);
    });

    test('aborted when parent lifetime become aborted', () => {
        const timeouted = lifetime.timeout(1000);

        vi.advanceTimersByTime(900);

        controller.abort();

        expect(timeouted.aborted).toBe(true);
    });

    test('aborted when parent lifetime was aborted initially', () => {
        controller.abort();

        const timeouted = lifetime.timeout(1000);

        expect(timeouted.aborted).toBe(true);
    });
});