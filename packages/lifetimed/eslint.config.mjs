// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        name: 'global-ignores',
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/scripts/**'
        ],
    },
    eslint.configs.recommended,
    tseslint.configs.recommended,
);