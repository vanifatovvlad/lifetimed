import { describe, expect, test } from 'vitest';
import { Lifetime, LifetimeController } from '../src';

describe('Lifetime.any', () => {
    test('alive when all lifetimes alive', () => {
        const lc1 = new LifetimeController();
        const lc2 = new LifetimeController();

        const any = Lifetime.any([Lifetime.of(lc1), Lifetime.of(lc2)]);

        expect(any.aborted).toBe(false);
    });

    test('aborted when any of the lifetimes aborted', () => {
        const lc1 = new LifetimeController();
        const lc2 = new LifetimeController();

        const any = Lifetime.any([Lifetime.of(lc1), Lifetime.of(lc2)]);

        lc1.abort();

        expect(any.aborted).toBe(true);
    });

    test('aborted when any of the lifetimes was aborted initially', () => {
        const lc1 = new LifetimeController();
        const lc2 = new LifetimeController();

        lc1.abort();

        const any = Lifetime.any([Lifetime.of(lc1), Lifetime.of(lc2)]);

        expect(any.aborted).toBe(true);
    });
});
