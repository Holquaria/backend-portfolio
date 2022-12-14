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
      expect(article).toMatchObject({
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: '2020-07-09T20:11:00.000Z',
        votes: 100,
        article_id: 1,
      })
    });
  })
  test('should return a comment count for a specific article', () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({ body }) => {
      const { article } = body;
      expect(article.comment_count).toEqual('11')
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
      expect(message).toBe('invalid input data type')
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
    test('should respond with all articles of given topic', () => {
      return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(11)
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: 'mitch',
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String)
            })
          );
        });
      });
    })
    test('should respond an empty array if there are no articles of the given topic', () => {
      return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array)
        expect(articles).toHaveLength(0)
      });
    })
    test('should sort by given column when valid', () => {
      return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy('title', { descending: true })
      });
    })
    test('should be in ascending order when given', () => {
      return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy('title', { ascending: true })
      });
    })
    test('should respond with 400 bad request when sort_by is not a valid column', () => {
      return request(app)
      .get("/api/articles?sort_by=banana")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe('bad request')
      });
    })
    test('should respond with 400 bad request when order is not asc or desc', () => {
      return request(app)
      .get("/api/articles?order=banana")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe('bad request')
      });
    })
    test('should respond with 404 when topic does not exist', () => {
      return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe('topic not found')
      });
    })
  })
  
    
    
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
        expect(message).toBe('invalid input data type')
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
      expect(message).toBe('invalid input data type')
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
      expect(message).toBe('invalid input in request')
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
      expect(message).toBe('invalid input in request')
    })
  })
})

describe('PATCH /api/articles/:article_id', () => {
  test('will update an article with the given number of votes', () => {
    const votes = { inc_votes: 5 }
    return request(app)
    .patch('/api/articles/5')
    .send(votes)
    .expect(200)
    .then(({ body }) => {
      const { article } = body
      expect(article).toEqual({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 5,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: 5,
        }
      );
    })
  })
  test('will not update a non-existent article', () => {
    const votes = { inc_votes: 5 }
    return request(app)
    .patch('/api/articles/55')
    .send(votes)
    .expect(404)
    .then(({ body }) => {
      const { message } = body
      expect(message).toBe('article id not found')
    })
  })
  test('should return a 400 when id is not a valid data type', () => {
    const votes = { inc_votes: 5 }
    return request(app)
    .patch("/api/articles/pug")
    .send(votes)
    .expect(400)
    .then(({ body }) => {
      const { message } = body;
      expect(message).toBe('invalid input data type')
    });
  })
  test('will return a 400 when votes is an invalid input data type', () => {
    const votes = { inc_votes: 'steve' }
    return request(app)
    .patch('/api/articles/5')
    .send(votes)
    .expect(400)
    .then(({ body }) => {
      const { message } = body
      expect(message).toBe('invalid input data type')
    })
  })
  test('will return a 400 when attempting to change any other value', () => {
    const newTitle = { title: 'steve' }
    return request(app)
    .patch('/api/articles/5')
    .send(newTitle)
    .expect(400)
    .then(({ body }) => {
      const { message } = body
      expect(message).toBe('invalid input in request')
    })
  })
})


describe('GET /api/users', () => {
  test('responds with an array of users', () => {
    return request(app)
    .get('/api/users')
    .expect(200)
    .then(({ body }) => {
      const { users } = body;
      expect(users).toHaveLength(4)
      users.forEach((user) => {
        expect(user).toEqual(
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          })
        );
      });
    })
  })
})

describe('DELETE /api/comments/:comment_id', () => {
  test('should delete a comment from the database', () => {
    return request(app)
    .delete('/api/comments/1')
    .expect(204)
  })
  test('should respond with a 404 if the comment does not exist', () => {
    return request(app)
    .delete('/api/comments/666')
    .expect(404)
    .then(({ body }) => {
      const { message } = body
      expect(message).toBe('comment not found')
    })
  })
  test('should respond with a 400 if the comment id is not valid', () => {
    return request(app)
    .delete('/api/comments/pug')
    .expect(400)
    .then(({ body }) => {
      const { message } = body
      expect(message).toBe('invalid input data type')
    })
  })
})

describe("GET /api", () => {
  test("should respond with a JSON of all available endpoints and a description of their use", () => {
    return request(app)
    .get('/api')
    .expect(200)
    .then(({ body }) => {
      const { endpoints } = body
      expect(endpoints).toBeInstanceOf(Object)
    })
  })
})

describe("GET /api/users/:username", () => {
  test("should respond with a user when given their username", () => {
    return request(app)
    .get("/api/users/butter_bridge")
    .expect(200)
    .then(({ body }) => {
      const { user } = body
      expect(user).toMatchObject({
        username: "butter_bridge",
        name: "jonny",
        avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
      })
    })
  })
  test("should respond with a 404 when the user does not exist", () => {
    return request(app)
    .get("/api/users/1")
    .expect(404)
    .then(({ body }) => {
      const { message } = body
      expect(message).toBe('user not found')
    })
  })
})

describe("PATCH /api/comments/:comment_id", () => {
  test('should update a comment with the votes specified and return the updated comment', () => {
    const votes = { inc_votes: 10 }
    return request(app)
    .patch("/api/comments/1")
    .send(votes)
    .expect(200)
    .then(({ body }) => {
    const { comment } = body
    expect(comment).toMatchObject({
      author: 'butter_bridge',
      comment_id: 1,
      created_at: "2020-04-06T12:17:00.000Z",
      votes: 26,
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      article_id: 9
      })
    })
  })
  test('will not update a non-existent comment', () => {
    const votes = { inc_votes: 5 }
    return request(app)
    .patch('/api/comments/55')
    .send(votes)
    .expect(404)
    .then(({ body }) => {
      const { message } = body
      expect(message).toBe('comment id not found')
    })
  })
  test('should return a 400 when id is not a valid data type', () => {
    const votes = { inc_votes: 5 }
    return request(app)
    .patch("/api/comments/pug")
    .send(votes)
    .expect(400)
    .then(({ body }) => {
      const { message } = body;
      expect(message).toBe('invalid input data type')
    });
  })
  test('will return a 400 when votes is an invalid input data type', () => {
    const votes = { inc_votes: 'steve' }
    return request(app)
    .patch('/api/comments/5')
    .send(votes)
    .expect(400)
    .then(({ body }) => {
      const { message } = body
      expect(message).toBe('invalid input data type')
    })
  })
  test('will return a 400 when attempting to change any other value', () => {
    const newTitle = { title: 'steve' }
    return request(app)
    .patch('/api/comments/5')
    .send(newTitle)
    .expect(400)
    .then(({ body }) => {
      const { message } = body
      expect(message).toBe('invalid input in request')
    })
  })
})

describe("POST /api/articles", () => {
  test("will post a new article with the given body", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "The wonderful world of pugs",
      body: "Pugs are great, even though they shed hair everywhere",
      topic: "cats"
    }
    return request(app)
    .post('/api/articles')
    .send(newArticle)
    .expect(201)
    .then(({ body }) => {
      const { article } = body
      expect(article).toMatchObject({
        author: "butter_bridge",
        title: "The wonderful world of pugs",
        body: "Pugs are great, even though they shed hair everywhere",
        topic: "cats",
        article_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        comment_count: expect.any(String)
      })
    })
  })
  test("will not post an article if the username does not exist", () => {
    const newArticle = {
      author: "steve_jobs",
      title: "The wonderful world of pugs",
      body: "Pugs are great, even though they shed hair everywhere",
      topic: "cats"
    }
    return request(app)
    .post('/api/articles')
    .send(newArticle)
    .expect(404)
    .then(({ body }) => {
      const { message } = body
      expect(message).toBe('user not found')
    })
  })  
  test("will not post an article if the topic does not exist", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "The wonderful world of pugs",
      body: "Pugs are great, even though they shed hair everywhere",
      topic: "dogs"
    }
    return request(app)
    .post('/api/articles')
    .send(newArticle)
    .expect(404)
    .then(({ body }) => {
      const { message } = body
      expect(message).toBe('topic not found')
    })
  })
  test("will not post an article the body is invalid", () => {
    const newArticle = {
      author: "butter_bridge",
      topic: "cats"
    }
    return request(app)
    .post('/api/articles')
    .send(newArticle)
    .expect(400)
    .then(({ body }) => {
      const { message } = body
      expect(message).toBe('invalid input in request')
    })
  })
})