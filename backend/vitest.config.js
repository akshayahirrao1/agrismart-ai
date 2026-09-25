import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        // Required env vars must exist before config/env.js runs its startup
        // validation (see Phase 1) — the actual DB URI used to connect is the
        // real in-memory server URI set up in tests/setup.js; this placeholder
        // just needs to be non-empty to pass that check.
        env: {
            NODE_ENV: 'test',
            MONGODB_URI: 'mongodb://placeholder-overridden-in-setup',
            JWT_SECRET: 'test-only-secret-not-used-in-production',
            FRONTEND_URL: 'http://localhost:8080',
        },
        setupFiles: ['./tests/setup.js'],
        hookTimeout: 150000, // mongodb-memory-server binary download can be slow on first run, especially on Windows
        testTimeout: 15000,
    },
});