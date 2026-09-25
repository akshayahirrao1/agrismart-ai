import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

// Mock the ML service call so this test doesn't depend on a live Flask
// service being reachable in CI — we're testing the Node route/controller
// logic here, not the actual trained model.
vi.mock('../src/services/ml.service.js', () => ({
    predictCrop: vi.fn().mockResolvedValue({
        success: true,
        data: { crop: 'rice', confidence: 88.9 },
    }),
    predictSoilMoisture: vi.fn(),
}));

// Import app AFTER the mock is set up
const { default: app } = await import('../src/app.js');

const testUser = {
    name: 'Test Farmer',
    email: 'crop.test@example.com',
    password: 'SecurePass123',
};

const validCropInput = {
    N: 90,
    P: 42,
    K: 43,
    temperature: 20.87,
    humidity: 82.0,
    ph: 6.5,
    rainfall: 202.9,
};

async function getAuthToken() {
    const res = await request(app).post('/api/auth/register').send(testUser);
    return res.body.data.token;
}

describe('POST /api/crop/predict', () => {
    it('rejects requests without a token', async () => {
        const res = await request(app).post('/api/crop/predict').send(validCropInput);
        expect(res.status).toBe(401);
    });

    it('rejects requests missing required fields', async () => {
        const token = await getAuthToken();
        const res = await request(app)
            .post('/api/crop/predict')
            .set('Authorization', `Bearer ${token}`)
            .send({ N: 90 }); // missing everything else

        expect(res.status).toBe(400);
    });

    it('returns a prediction and saves it, given valid input and auth', async () => {
        const token = await getAuthToken();
        const res = await request(app)
            .post('/api/crop/predict')
            .set('Authorization', `Bearer ${token}`)
            .send(validCropInput);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.prediction.predictedCrop).toBe('rice');
        expect(res.body.data.prediction.id).toBeTruthy();
    });
});