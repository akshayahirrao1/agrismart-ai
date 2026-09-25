import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { beforeAll, afterAll, afterEach } from 'vitest';

let mongoServer;

beforeAll(async () => {
    // Windows especially can be slow on first run since mongodb-memory-server
    // downloads a real MongoDB binary the first time — the library's own
    // default launchTimeout (10s) is too short for that, separate from
    // Vitest's own hookTimeout in vitest.config.js.
    mongoServer = await MongoMemoryServer.create({
        instance: {
            launchTimeout: 120000,
        },
    });
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

// Keep test data isolated between test files by clearing all collections
afterEach(async () => {
    if (mongoose.connection.readyState !== 1) return;
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    // Guard against mongoServer being undefined if beforeAll itself failed —
    // otherwise this throws a second, more confusing error on top of the real one.
    if (mongoServer) {
        await mongoServer.stop();
    }
});