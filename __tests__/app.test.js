const endpointsJson = require("../endpoints.json");
const app = require("../app");
const db = require("../../be-nc-news/db/connection");
const seed = require("../../be-nc-news/db/seeds/seed");
const request = require("supertest");
const testData = require("../db/data/test-data");
require("jest-sorted");

/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("app", () => {
  test("status 404 for invalid endpoint", () => {
    return request(app)
      .get("/api/banana")
      .expect(404)
      .then((response) => {
        console.log(response);
        expect(response.body.msg).toBe("Path Not Found");
      });
  });

  describe("GET /api", () => {
    test("200: Responds with an object detailing the documentation for each endpoint", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          expect(endpoints).toEqual(endpointsJson);
        });
    });
  });

  describe("GET /api/topics", () => {
    test("200: Responds with an array of topic objects, each of which should have the following properties, slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3);
          expect(topics).toBeInstanceOf(Array);
          topics.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });

  // /api/banana
  describe("GET /api/articles/:articles_id", () => {
    test("Should respond with the status 200 and an article of objects, which should have the right properties", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });

    test("Should respond with the status 400 when the request is not valid", () => {
      const articles_id = "chocolate";
      return request(app)
        .get(`/api/articles/${articles_id}`)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe(`Bad Request`);
        });
    });

    test("Should respond with the status 404 when the article id doesnt exists", () => {
      return request(app)
        .get("/api/articles/9939")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article Not Found");
        });
    });
  });

  describe("GET /api/articles", () => {
    test("200: responds with an array of articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeInstanceOf(Array);
          expect(articles.length).toBeGreaterThan(0);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
            expect(article).not.toHaveProperty("body");
          });
        });
    });

    test("Should show that the articles are sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });

    test("Should respond with an error of 404 for non-existent path", () => {
      return request(app)
        .get("/api/artiNhsj")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Path Not Found");
        });
    });
  });

  describe("GET /api/articles/:article_id/comments", () => {
    test("Should respond with an array of comments for a given article_id ", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments} }) => {
          expect(comments).toBeInstanceOf(Array)
          expect(comments).toHaveLength(11)
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              article_id: 1,
              created_at: expect.any(String),
            });
          });
        });
    });
    test("Should return status 200 when the comments are sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeSortedBy('created_at', { descending: true })
          expect(comments).toHaveLength(11)
        });
    });
  });

  test("Should return a status of 200 when there is an empty array with an article with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments") 
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array)
        expect(comments).toHaveLength(0)
      });
  });

     test("404: responds with error for non-existent article_id", () => {
        return request(app)
          .get("/api/articles/828/comments")
          .expect(404)
          .then(({ body: { msg } }) => {
           expect(msg).toBe("Article Not Found")
      });
  });

     test("Should respond with the status 400 when the request is not valid", () => {
      return request(app)
      .get("/api/articles/nohrwjd/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request")
      });
  });


 ////// 7_POST /api/articles/:article_id/comments
  describe("POST /api/articles/:article_id/comments", () => {
    test("Should addd a comment to an article and responds with the posted comment giving us an error of 200", () =>{
      const newCommentArId = {
        username: "butter_bridge",
        body: "Comment added"
      }
        return request(app)
         .post("/api/articles/1/comments")
         .send(newCommentArId )
         .expect(200)
         .then(({ body: { comment } }) =>{
            expect(comment).toMatchObject({
         comment_id: expect.any(Number),
         body: "Comment added",
         article_id: 1,
         author: "butter_bridge",
         votes: 0,
         created_at:expect.any(String)
       });
     });
   });
   
   test("Should respond with an error when article_id is not valid, with status 400", () => {
    const newCommentArId = {
      username: "butter_bridge",
      body: "Comment added"
    };
    return request(app)
      .post("/api/articles/banana/comments")
      .send(newCommentArId )
      .expect(400)
      .then(({ body: { msg }}) =>{
       expect(msg).toBe("Bad Request")
      });
  });

  test("Should respond with an error when the article does not exist, and have a status of 404", () =>{
    const newCommentArId ={
     username: "butter_bridge",
      body: "Comment added"
   }
    return request(app)
      .post("/api/articles/828/comments")
      .send(newCommentArId)
      .expect(404)
      .then(({ body: { msg } }) =>{
      expect(msg).toBe("Article Not Found");
      });
  });

  test("404: responds with error when username does not exist", () =>{
    const newCommentArId = {
      username: "yu-gi-oh",
      body: "Comment added"
   }
    return request(app)
      .post("/api/articles/1/comments")
      .send(newCommentArId)
      .expect(404)
      .then(({ body: { msg } }) =>{
       expect(msg).toBe("User Not Found")
      });
  });
});
});

