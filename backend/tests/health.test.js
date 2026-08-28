const request = require('supertest');

const app = require('../src/app');
const pool = require('../src/config/database');

describe('GET /health', () => {
  test('debe responder 200 cuando la aplicación y la base de datos están disponibles', async () => {
    const response = await request(app)
      .get('/health');

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      status: 'ok',
      database: 'connected',
    });
  });
});

afterAll(async () => {
  await pool.end();
});