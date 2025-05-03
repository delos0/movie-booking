import request from 'supertest';
import app from '../app';
import { sequelize } from '../config/database';

beforeAll (async () => {
	await sequelize.sync({force: true});
});

afterAll(async () => {
	await sequelize.close();
});

describe('Movies API', () => {
	it('should create, fetch, update, and delete a movie', async() => {
		// Create
		const createResponse = await request(app)
			.post('/movies')
			.send({
    			"title": "Inception",
    			"description": "A mind-bending thriller",
    			"duration": 148,
    			"posterUrl": "http://example.com/inception.jpg"})
			.expect(201);
		const movieId = createResponse.body.id;
		expect(createResponse.body.message).toBe('Movie created successfully');

		// Fetch all
		const listResponse = await request(app)
			.get('/movies').expect(200);
		expect(Array.isArray(listResponse.body)).toBe(true);
		expect(listResponse.body[0].title).toBe('Inception');

		// Fetch one
		const oneResponse = await request(app).get(`/movies/${movieId}`).expect(200);
		expect(oneResponse.body.id).toBe(movieId);

		// Update
		const updateResponse = await request(app)
			.put(`/movies/${movieId}`)
			.send({
				"title": "Inception Updated",
				"description": "Updated description",
				"duration": 150,
				"posterUrl": "http://example.com/inception-updated.jpg"
			})
			.expect(200)
			
		expect(updateResponse.body.message).toBe('Movie updated successfully');

		// Delete
		const deleteResponce = await request(app)
			.delete(`/movies/${movieId}`)
			.expect(200);
		expect(deleteResponce.body.message).toBe('Movie deleted successfully');
	});
});

