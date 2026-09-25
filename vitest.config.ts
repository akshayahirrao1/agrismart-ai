import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        globals: true,
        // Vitest's default include pattern would otherwise also pick up
        // backend/tests/*.test.js, which needs Node env + a different
        // environment entirely (it has its own vitest.config.js).
        exclude: [...configDefaults.exclude, 'backend/**'],
        // Node 22.4+ (and especially 25+) ships its own experimental global
        // localStorage/sessionStorage that shadows jsdom's working versions,
        // breaking any code that touches localStorage (AuthContext, i18n, etc.)
        // with "Cannot read properties of undefined". This disables Node's
        // version so jsdom's actually gets used. See:
        // https://nodejs.org/api/cli.html#--no-experimental-webstorage
        poolOptions: {
            forks: { execArgv: ['--no-experimental-webstorage'] },
            threads: { execArgv: ['--no-experimental-webstorage'] },
        },
    },
});