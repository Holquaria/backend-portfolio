const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection");
const jestSorted = require('jest-sorted')

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("GET /api/topics", () => {
  test("should respond with an array of all topic objects", () => {
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
    })
  })
  test('articles should be sorted by date in descending order', () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles).toBeSortedBy("created_at", { descending: true })
    });
  })
  test('comment count should match be correct for each article', () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles[0].comment_count).toBe('2')
      expect(articles[5].comment_count).toBe('11')
          });
  })
})


describe('GET /api/articles', () => {
  test('should respond with an array of all articles objects', () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles).toHaveLength(12)
      articles.forEach((article) => {
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String)
          })
        );
      });
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


describe('GET /api/articles/:article_id/comments', () => {
  test('should return all comments for the given article', () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({ body }) => {
      const { comments } = body;
      expect(comments).toHaveLength(11)
      comments.forEach((comment) => {
        expect(comment).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
            body: expect.any(String)
          })
        );
      });
    });
  })
  test('comments should be sorted by most recent', () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({ body }) => {
      const { comments } = body;
      expect(comments).toBeSortedBy('created_at', { descending: true })
    });
  })
  test('should return a 200 when id is present but no comments are found', () => {
    return request(app)
    .get("/api/articles/4/comments")
    .expect(200)
    .then(({ body }) => {
      const { comments } = body;
      expect(comments).toEqual([])
    });
  })
  test('should return a 404 when id is valid but not found', () => {
    return request(app)
    .get("/api/articles/55/comments")
    .expect(404)
    .then(({ body }) => {
      const { message } = body;
      expect(message).toBe('article id not found')
    });
  })
  test('should return a 400 when id is not a valid data type', () => {
    return request(app)
    .get("/api/articles/pug/comments")
    .expect(400)
    .then(({ body }) => {
      const { message } = body;
      expect(message).toBe('invalid id data type')
    });
  })
})

describe('POST /api/articles/:article_id/comments', () => {
  test('will post a new comment and respond with the comment', () => {
    const newComment = { username: 'butter_bridge', body: 'Very insightful' }
    return request(app)
    .post('/api/articles/4/comments')
    .send(newComment)
    .expect(201)
    .then(({ body }) => {
      const { comment } = body
      expect(comment).toEqual(
        expect.objectContaining({
          author: 'butter_bridge',
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          votes: expect.any(Number),
          body: 'Very insightful',
          article_id: 4
        })
      )
    })
  })
  test('will not post to a non existent article', () => {
    const newComment = { username: 'butter_bridge', body: 'Very insightful' }
    return request(app)
    .post('/api/articles/55/comments')
    .send(newComment)
    .expect(404)
    .then(({ body }) => {
      const { message } = body
      expect(message).toBe('article id not found')
    })
  })
  test('should return a 400 when id is not a valid data type', () => {
    return request(app)
    .post("/api/articles/pug/comments")
    .expect(400)
    .then(({ body }) => {
      const { message } = body;
      expect(message).toBe('invalid id data type')
    });
  })
  test('will not post if the username does not exist', () => {
    const newComment = { username: 666, body: 'Very insightful' }
    return request(app)
    .post('/api/articles/4/comments')
    .send(newComment)
    .expect(404)
    .then(({ body }) => {
      const { message } = body
      expect(message).toBe('username does not exist')
    })
  })
  test('will not post when content is missing from the body', () => {
    const newComment = { username: 'butter_bridge' }
    return request(app)
    .post('/api/articles/4/comments')
    .send(newComment)
    .expect(400)
    .then(({ body }) => {
      const { message } = body
      expect(message).toBe('missing body in request')
    })
  })
  test('will not post comments with invalid comment body', () => {
    const newComment = { username: 'butter_bridge', banana: 10 }
    return request(app)
    .post('/api/articles/4/comments')
    .send(newComment)
    .expect(400)
    .then(({ body }) => {
      const { message } = body
      expect(message).toBe('missing body in request')
    })
  })
})