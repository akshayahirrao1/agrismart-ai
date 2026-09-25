import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

const testUser = {
    name: 'Test Farmer',
    email: 'test.farmer@example.com',
    password: 'SecurePass123',
};

describe('Auth flow', () => {
    it('registers a new user and returns a token', async () => {
        const res = await request(app).post('/api/auth/register').send(testUser);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.token).toBeTruthy();
        expect(res.body.data.user.email).toBe(testUser.email);
        // Password must never be echoed back
        expect(res.body.data.user.password).toBeUndefined();
    });

    it('rejects registering the same email twice', async () => {
        await request(app).post('/api/auth/register').send(testUser);
        const res = await request(app).post('/api/auth/register').send(testUser);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('logs in with correct credentials', async () => {
        await request(app).post('/api/auth/register').send(testUser);

        const res = await request(app).post('/api/auth/login').send({
            email: testUser.email,
            password: testUser.password,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.token).toBeTruthy();
    });

    it('rejects login with wrong password', async () => {
        await request(app).post('/api/auth/register').send(testUser);

        const res = await request(app).post('/api/auth/login').send({
            email: testUser.email,
            password: 'WrongPassword',
        });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it('rejects /me without a token', async () => {
        const res = await request(app).get('/api/auth/me');
        expect(res.status).toBe(401);
    });

    it('returns the current user for a valid token', async () => {
        const registerRes = await request(app).post('/api/auth/register').send(testUser);
        const token = registerRes.body.data.token;

        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data.email).toBe(testUser.email);
    });
});