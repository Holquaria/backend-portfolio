const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("GET /api/topics", () => {
  test("should return an array of all topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3)
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});


describe('GET /api/articles/:article_id', () => {
  test('should retrieve a specific article when fed its id', () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({ body }) => {
      const { article } = body;
      expect(article).toEqual({
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: '2020-07-09T20:11:00.000Z',
        votes: 100,
        article_id: 1
      })
    });
  })
  test('should return a 404 when id is valid but not found', () => {
    return request(app)
    .get("/api/articles/55")
    .expect(404)
    .then(({ body }) => {
      const { message } = body;
      expect(message).toBe('article id not found')
    });
  })
  test('should return a 400 when id is not a valid data type', () => {
    return request(app)
    .get("/api/articles/pug")
    .expect(400)
    .then(({ body }) => {
      const { message } = body;
      expect(message).toBe('invalid id data type')
    });
  })
})

describe("Errors", () => {
  test("should give a custom message for an invalid path", () => {
    return request(app)
      .get("/api/tobiics")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("path not found");
      });
  });
});

