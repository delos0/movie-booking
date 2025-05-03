// tests/session.integration.test.ts
import request from 'supertest';
import app from '../app';
import { sequelize } from '../config/database';

beforeAll(async () => {
  // Recreate all tables
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Sessions API', () => {
  it('should create, fetch, update, and delete a session', async () => {
    // 1) Create a Movie dependency
    const movieRes = await request(app)
      .post('/movies')
      .send({
        title: "Interstellar",
        description: "Sci-fi epic",
        duration: 169,
        posterUrl: "http://example.com/interstellar.jpg"
      })
      .expect(201);
    const movieId = movieRes.body.id;
    expect(movieRes.body.message).toBe('Movie created successfully');

    // 2) Create a Hall dependency
    const hallRes = await request(app)
      .post('/halls')
      .send({
        name: "IMAX Screen",
        rows: 15,
        seatsPerRow: 30
      })
      .expect(201);
    const hallId = hallRes.body.id;
    expect(hallRes.body.message).toBe('Hall created successfully');

    // 3) Create Session
    const startTime = new Date(Date.now() + 86400000).toISOString(); // tomorrow
    const createRes = await request(app)
      .post('/sessions')
      .send({
        movieId,
        hallId,
        startTime,
        price: 12
      })
      .expect(201);
    expect(createRes.body.message).toBe('Session created successfully');
    const sessionId = createRes.body.id;

    // 4) Fetch all
    const listRes = await request(app)
      .get('/sessions')
      .expect(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBe(1);
    expect(listRes.body[0].id).toBe(sessionId);

    // 5) Fetch one
    const oneRes = await request(app)
      .get(`/sessions/${sessionId}`)
      .expect(200);
    expect(oneRes.body.id).toBe(sessionId);
    expect(oneRes.body.movieId).toBe(movieId);
    expect(oneRes.body.hallId).toBe(hallId);

    // 6) Update
    const newStart = new Date(Date.now() + 2 * 86400000).toISOString(); // day after tomorrow
    const updateRes = await request(app)
      .put(`/sessions/${sessionId}`)
      .send({
        startTime: newStart,
        price: 15
      })
      .expect(200);
    expect(updateRes.body.message).toBe('Session updated successfully');

    // Confirm update
    const afterUpdate = await request(app)
      .get(`/sessions/${sessionId}`)
      .expect(200);
    expect(new Date(afterUpdate.body.startTime).toISOString()).toBe(newStart);
    expect(afterUpdate.body.price).toBe(15);

    // 7) Delete
    const deleteRes = await request(app)
      .delete(`/sessions/${sessionId}`)
      .expect(200);
    expect(deleteRes.body.message).toBe('Session deleted successfully');

    // Confirm deletion
    await request(app)
      .get(`/sessions/${sessionId}`)
      .expect(404);
  });
});
