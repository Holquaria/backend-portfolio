const request = require('supertest')
const app = require('../app')
const testData = require('../db/data/test-data')
const seed = require('../db/seeds/seed.js');
const db = require('../db/connection')


afterAll(() => db.end())
beforeEach(() => seed(testData))

describe('GET /api/topics', () => {
    test('should return an array of all topic objects', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics).toBeInstanceOf(Array);
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    })
})