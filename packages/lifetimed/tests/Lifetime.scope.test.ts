import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import { Lifetime, LifetimeController } from "../src";

describe('Lifetime.scope', () => {
    let controller: LifetimeController;
    let lifetime: Lifetime;

    beforeEach(() => {
        controller = new LifetimeController();
        lifetime = controller.getLifetime();
    });

    afterEach(() => {
        controller.abort();
    });

    test('alive when parent lifetime is alive', () => {
        const { lifetime: scopeLifetime } = lifetime.scope();

        expect(lifetime.alive).toBe(true);
        expect(scopeLifetime.alive).toBe(true);
    });

    test('aborted when parent lifetime is aborted', () => {
        const { lifetime: scopeLifetime } = lifetime.scope();

        controller.abort();

        expect(lifetime.alive).toBe(false);
        expect(scopeLifetime.alive).toBe(false);
    });

    test('aborted on `abort` call', () => {
        const { lifetime: scopeLifetime, abort } = lifetime.scope();

        abort();

        expect(lifetime.alive).toBe(true);
        expect(scopeLifetime.alive).toBe(false);
    });
});