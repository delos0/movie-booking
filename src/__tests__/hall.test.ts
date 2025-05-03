// tests/hall.integration.test.ts
import request from 'supertest';
import app from '../app';
import { sequelize } from '../config/database';
import { DataTypes, DATE } from 'sequelize';

beforeAll(async () => {
  // reset database
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Halls API', () => {
  it('should create, fetch, update, and delete a hall', async () => {
    // Create
    const createRes = await request(app)
      .post('/halls')
      .send({
        name: "Main Stage",
        rows: 10,
        seatsPerRow: 20,
      })
      .expect(201);

    expect(createRes.body.message).toBe('Hall created successfully');
    const hallId = createRes.body.id;

    // Fetch all
    const listRes = await request(app)
      .get('/halls')
      .expect(200);

    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBe(1);
    expect(listRes.body[0].name).toBe('Main Stage');

    // Fetch one
    const oneRes = await request(app)
      .get(`/halls/${hallId}`)
      .expect(200);

    expect(oneRes.body.id).toBe(hallId);
    expect(oneRes.body.rows).toBe(10);
    expect(oneRes.body.seatsPerRow).toBe(20);

    // Update
    const updateRes = await request(app)
      .put(`/halls/${hallId}`)
      .send({
        name: "Main Stage Renovated",
        rows: 12,
        seatsPerRow: 22
      })
      .expect(200);

    expect(updateRes.body.message).toBe('Hall updated successfully');

    // Fetch again to confirm update
    const afterUpdate = await request(app)
      .get(`/halls/${hallId}`)
      .expect(200);
    expect(afterUpdate.body.name).toBe('Main Stage Renovated');
    expect(afterUpdate.body.rows).toBe(12);
    expect(afterUpdate.body.seatsPerRow).toBe(22);

    // Delete
    const deleteRes = await request(app)
      .delete(`/halls/${hallId}`)
      .expect(200);

    expect(deleteRes.body.message).toBe('Hall deleted successfully');

    // Confirm gone
    await request(app)
      .get(`/halls/${hallId}`)
      .expect(404);
  });
});
