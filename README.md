# Northcoders News API

## My Link
The API is live at: https://solo-project-4fr3.onrender.com



## Description
NC News is a RESTful API service that provides access to news articles, comments, and user data. It's built with Node.js, PostgreSQL and Express, following MVC architecture. 



## Key Features:

# Article Management
- Retrieve a curated list of articles with sorting and filtering
- Filter articles by specific topics 
- Sort articles by various criteria (date, votes, comment count, users)
- Access detailed information for individual articles


# Interactive Features
- Post new comments on articles
- Delete existing comments
- Update article votes 
- Tracking comment counts for each article

# Versions Needed
- Node.js (v20.x or higher)
- PostgreSQL (v14.x or higher)

# Available endpoints include:
- GET /api/topics
- GET /api/articles
- GET /api/articles/:article_id
- GET /api/articles/:article_id/comments
- POST /api/articles/:article_id/comments
- PATCH /api/articles/:article_id
- DELETE /api/comments/:comment_id
- GET /api/users

### Installation Instructions
1. Clone the repository : https://github.com/t0mmYch/solo-project.git

2. Install dependencies 
- npm install

3. Set up environment variables
Create two .env files in the root directory:
- .env.test => PGDATABASE=nc_news_test
- .env.development => PGDATABASE=nc_news

4. Set up the data base
- npm run seed
- npm run setup-dbs

5. Run the tests
- npm test app



This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
