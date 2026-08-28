const request = require('supertest');

const app = require('../src/app');
const pool = require('../src/config/database');

describe('Promociones', () => {
  afterAll(async () => {
    await pool.query(`
      DELETE FROM promotions
      WHERE name LIKE 'TEST_%';
    `);

    await pool.end();
  });

  describe('GET /api/promotions', () => {
    test('debe obtener la lista de promociones', async () => {
      const response = await request(app)
        .get('/api/promotions');

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/promotions/:id', () => {
    test('debe obtener una promoción por su ID', async () => {
      const createResponse = await request(app)
        .post('/api/promotions')
        .send({
          name: 'TEST_Buscar por ID',
          product_id: 1,
          category_id: null,
          discount_type: 'PORCENTAJE',
          discount_value: 20,
          start_date: '2026-09-01',
          end_date: '2026-09-10',
        });

      const promotionId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/promotions/${promotionId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(promotionId);
      expect(response.body.name).toBe('TEST_Buscar por ID');
    });

    test('debe devolver 404 cuando la promoción no existe', async () => {
      const response = await request(app)
        .get('/api/promotions/999999');

      expect(response.statusCode).toBe(404);

      expect(response.body.message).toBe(
        'No encontramos una promoción con ese ID.'
      );
    });
  });

  describe('POST /api/promotions', () => {
    test('debe crear una promoción válida', async () => {
      const promotion = {
        name: 'TEST_Promoción válida',
        product_id: 1,
        category_id: null,
        discount_type: 'PORCENTAJE',
        discount_value: 20,
        start_date: '2026-09-01',
        end_date: '2026-09-10',
      };

      const response = await request(app)
        .post('/api/promotions')
        .send(promotion);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('TEST_Promoción válida');
      expect(response.body.status).toBe('PROGRAMADA');
    });

    test('no debe crear una promoción sin nombre', async () => {
      const promotion = {
        name: '',
        product_id: 1,
        category_id: null,
        discount_type: 'PORCENTAJE',
        discount_value: 20,
        start_date: '2026-09-01',
        end_date: '2026-09-10',
      };

      const response = await request(app)
        .post('/api/promotions')
        .send(promotion);

      expect(response.statusCode).toBe(400);

      expect(response.body.message).toBe(
        'Por favor, ingresa un nombre para la promoción.'
      );
    });

    test('no debe crear una promoción sin producto ni categoría', async () => {
      const promotion = {
        name: 'TEST_Sin asociación',
        product_id: null,
        category_id: null,
        discount_type: 'PORCENTAJE',
        discount_value: 20,
        start_date: '2026-09-01',
        end_date: '2026-09-10',
      };

      const response = await request(app)
        .post('/api/promotions')
        .send(promotion);

      expect(response.statusCode).toBe(400);

      expect(response.body.message).toBe(
        'Selecciona un producto o una categoría para la promoción.'
      );
    });

    test('no debe permitir producto y categoría al mismo tiempo', async () => {
      const promotion = {
        name: 'TEST_Producto y categoría',
        product_id: 1,
        category_id: 1,
        discount_type: 'PORCENTAJE',
        discount_value: 20,
        start_date: '2026-09-01',
        end_date: '2026-09-10',
      };

      const response = await request(app)
        .post('/api/promotions')
        .send(promotion);

      expect(response.statusCode).toBe(400);

      expect(response.body.message).toBe(
        'Selecciona solo un producto o una categoría, no ambos.'
      );
    });

    test('no debe permitir un porcentaje mayor a 100', async () => {
      const promotion = {
        name: 'TEST_Porcentaje mayor',
        product_id: 1,
        category_id: null,
        discount_type: 'PORCENTAJE',
        discount_value: 101,
        start_date: '2026-09-01',
        end_date: '2026-09-10',
      };

      const response = await request(app)
        .post('/api/promotions')
        .send(promotion);

      expect(response.statusCode).toBe(400);

      expect(response.body.message).toBe(
        'El porcentaje de descuento debe estar entre 1 y 100.'
      );
    });

    test('no debe permitir un porcentaje menor a 1', async () => {
      const promotion = {
        name: 'TEST_Porcentaje menor',
        product_id: 1,
        category_id: null,
        discount_type: 'PORCENTAJE',
        discount_value: 0.5,
        start_date: '2026-09-01',
        end_date: '2026-09-10',
      };

      const response = await request(app)
        .post('/api/promotions')
        .send(promotion);

      expect(response.statusCode).toBe(400);

      expect(response.body.message).toBe(
        'El porcentaje de descuento debe estar entre 1 y 100.'
      );
    });

    test('no debe permitir una fecha de fin anterior a la fecha de inicio', async () => {
      const promotion = {
        name: 'TEST_Fecha incorrecta',
        product_id: 1,
        category_id: null,
        discount_type: 'PORCENTAJE',
        discount_value: 20,
        start_date: '2026-09-10',
        end_date: '2026-09-01',
      };

      const response = await request(app)
        .post('/api/promotions')
        .send(promotion);

      expect(response.statusCode).toBe(400);

      expect(response.body.message).toBe(
        'La fecha de fin debe ser posterior a la fecha de inicio.'
      );
    });
  });

  describe('PATCH /api/promotions/:id/status', () => {
    let promotionId;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/promotions')
        .send({
          name: 'TEST_Estados',
          product_id: 1,
          category_id: null,
          discount_type: 'PORCENTAJE',
          discount_value: 10,
          start_date: '2026-09-01',
          end_date: '2026-09-10',
        });

      promotionId = response.body.id;
    });

    test('debe cambiar una promoción de PROGRAMADA a ACTIVA', async () => {
      const response = await request(app)
        .patch(`/api/promotions/${promotionId}/status`)
        .send({
          status: 'ACTIVA',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('ACTIVA');
    });

    test('debe cambiar una promoción de ACTIVA a FINALIZADA', async () => {
      const response = await request(app)
        .patch(`/api/promotions/${promotionId}/status`)
        .send({
          status: 'FINALIZADA',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('FINALIZADA');
    });

    test('no debe permitir cambiar una promoción FINALIZADA a ACTIVA', async () => {
      const response = await request(app)
        .patch(`/api/promotions/${promotionId}/status`)
        .send({
          status: 'ACTIVA',
        });

      expect(response.statusCode).toBe(400);

      expect(response.body.message).toBe(
        'No puedes cambiar una promoción de FINALIZADA a ACTIVA.'
      );
    });

    test('no debe permitir pasar directamente de PROGRAMADA a FINALIZADA', async () => {
      const response = await request(app)
        .post('/api/promotions')
        .send({
          name: 'TEST_Transición inválida',
          product_id: 2,
          category_id: null,
          discount_type: 'PORCENTAJE',
          discount_value: 15,
          start_date: '2026-09-01',
          end_date: '2026-09-10',
        });

      const newPromotionId = response.body.id;

      const statusResponse = await request(app)
        .patch(`/api/promotions/${newPromotionId}/status`)
        .send({
          status: 'FINALIZADA',
        });

      expect(statusResponse.statusCode).toBe(400);

      expect(statusResponse.body.message).toBe(
        'No puedes cambiar una promoción de PROGRAMADA a FINALIZADA.'
      );
    });
  });

  describe('DELETE /api/promotions/:id', () => {
    test('debe eliminar una promoción PROGRAMADA', async () => {
      const createResponse = await request(app)
        .post('/api/promotions')
        .send({
          name: 'TEST_Eliminar programada',
          product_id: 1,
          category_id: null,
          discount_type: 'PORCENTAJE',
          discount_value: 10,
          start_date: '2026-09-01',
          end_date: '2026-09-10',
        });

      const promotionId = createResponse.body.id;

      const response = await request(app)
        .delete(`/api/promotions/${promotionId}`);

      expect(response.statusCode).toBe(200);

      expect(response.body.message).toBe(
        'La promoción se eliminó correctamente.'
      );
    });

    test('no debe eliminar una promoción ACTIVA', async () => {
      const createResponse = await request(app)
        .post('/api/promotions')
        .send({
          name: 'TEST_No eliminar activa',
          product_id: 1,
          category_id: null,
          discount_type: 'PORCENTAJE',
          discount_value: 10,
          start_date: '2026-09-01',
          end_date: '2026-09-10',
        });

      const promotionId = createResponse.body.id;

      await request(app)
        .patch(`/api/promotions/${promotionId}/status`)
        .send({
          status: 'ACTIVA',
        });

      const response = await request(app)
        .delete(`/api/promotions/${promotionId}`);

      expect(response.statusCode).toBe(400);

      expect(response.body.message).toBe(
        'No puedes eliminar una promoción que está ACTIVA.'
      );
    });

    test('no debe eliminar una promoción FINALIZADA', async () => {
      const createResponse = await request(app)
        .post('/api/promotions')
        .send({
          name: 'TEST_No eliminar finalizada',
          product_id: 1,
          category_id: null,
          discount_type: 'PORCENTAJE',
          discount_value: 10,
          start_date: '2026-09-01',
          end_date: '2026-09-10',
        });

      const promotionId = createResponse.body.id;

      await request(app)
        .patch(`/api/promotions/${promotionId}/status`)
        .send({
          status: 'ACTIVA',
        });

      await request(app)
        .patch(`/api/promotions/${promotionId}/status`)
        .send({
          status: 'FINALIZADA',
        });

      const response = await request(app)
        .delete(`/api/promotions/${promotionId}`);

      expect(response.statusCode).toBe(400);

      expect(response.body.message).toBe(
        'No puedes eliminar una promoción que está FINALIZADA.'
      );
    });
  });

  describe('GET /api/promotions/summary', () => {
    test('debe obtener el resumen de promociones', async () => {
      const response = await request(app)
        .get('/api/promotions/summary');

      expect(response.statusCode).toBe(200);

      expect(response.body).toHaveProperty('programadas');
      expect(response.body).toHaveProperty('activas');
      expect(response.body).toHaveProperty('finalizadas');
      expect(response.body).toHaveProperty('vigentesHoy');

      expect(typeof response.body.programadas).toBe('number');
      expect(typeof response.body.activas).toBe('number');
      expect(typeof response.body.finalizadas).toBe('number');
      expect(typeof response.body.vigentesHoy).toBe('number');
    });
  });
});