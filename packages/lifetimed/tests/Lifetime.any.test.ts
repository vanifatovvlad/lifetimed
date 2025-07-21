import { describe, expect, test } from "@jest/globals";
import { Lifetime, LifetimeController } from "../src";

describe('Lifetime.any', () => {
    test('alive when all lifetimes alive', () => {
        const lc1 = new LifetimeController();
        const lc2 = new LifetimeController();

        const any = Lifetime.any([lc1.getLifetime(), lc2.getLifetime()]);

        expect(any.aborted).toBe(false);
    });

    test('aborted when any of the lifetimes aborted', () => {
        const lc1 = new LifetimeController();
        const lc2 = new LifetimeController();

        const any = Lifetime.any([lc1.getLifetime(), lc2.getLifetime()]);

        lc1.abort();

        expect(any.aborted).toBe(true);
    });

    test('aborted when any of the lifetimes was aborted initially', () => {
        const lc1 = new LifetimeController();
        const lc2 = new LifetimeController();

        lc1.abort();

        const any = Lifetime.any([lc1.getLifetime(), lc2.getLifetime()]);

        expect(any.aborted).toBe(true);
    });

});