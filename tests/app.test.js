const request = require('supertest');
const app = require('../app'); // Assuming this is your Express app instance

describe('GET /api/v1/bahgavad_gita/shloka', () => {
  test('should return 400 if chapter or verse is not provided', async () => {
    const response = await request(app).get('/api/v1/bahgavad_gita/shloka');
    expect(response.statusCode).toBe(400);
  });

  test('should return 400 if an invalid chapter or verse is provided', async () => {
    const response = await request(app).get('/api/v1/bahgavad_gita/shloka?chapter=20&verse=1');
    expect(response.statusCode).toBe(400);
  });

  test('should return 200 and the shloka data for a valid chapter and verse', async () => {
    const response = await request(app).get('/api/v1/bahgavad_gita/shloka?chapter=1&verse=1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("Chapter");
    expect(response.body).toHaveProperty("Verse No");
    expect(response.body).toHaveProperty("English Translation");
    expect(response.body).toHaveProperty("Explanation");
    // Add more assertions to check the response body as per your data structure
  });

  // Add more test cases to cover different scenarios
});

describe('GET /api/bahgavad_gita/all', () => {
  test('should return 400 if an invalid chapter is provided', async () => {
    const response = await request(app).get('/api/v1/bahgavad_gita/all?chapter=20');
    expect(response.statusCode).toBe(400);
  });

  test('should return 200 and the shloka data for a valid chapter', async () => {
    const response = await request(app).get('/api/v1/bahgavad_gita/all?chapter=1');
    expect(response.statusCode).toBe(200);
    // Add more assertions to check the response body as per your data structure
  });

  // Add more test cases to cover different scenarios
});

describe('GET /api/bahgavad_gita/random', () => {
  test('should return 200 and a random shloka', async () => {
    const response = await request(app).get('/api/v1/bahgavad_gita/random');
    expect(response.statusCode).toBe(200);
    // Add more assertions to check the response body as per your data structure
  });

  // Add more test cases to cover different scenarios
});

describe('GET /api/bahgavad_gita/random/by', () => {
  test('should return 400 if chapter is not provided', async () => {
    const response = await request(app).get('/api/v1/bahgavad_gita/random/by');
    expect(response.statusCode).toBe(400);
  });

  test('should return 400 if an invalid chapter is provided', async () => {
    const response = await request(app).get('/api/v1/bahgavad_gita/random/by?chapter=20');
    expect(response.statusCode).toBe(400);
  });

  test('should return 200 and a random shloka for a valid chapter', async () => {
    const response = await request(app).get('/api/v1/bahgavad_gita/random/by?chapter=1');
    expect(response.statusCode).toBe(200);
    // Add more assertions to check the response body as per your data structure
  });

  // Add more test cases to cover different scenarios
});
