# News Database API

## This project is an api to query a database via various endpoints
#

Link to the hosted version: https://news-query-service.onrender.com/api

This project contains a seed function that will seed four databases with news articles, comments on those articles, topics that they are related to and the users who write the comments and articles.

The api then contains various endpoints to query information including all articles, users, comments and topics, as well as articles and comments by ID number, and advanced queries for articles such as sorting by a chosen column or selecting all articles on a given topic.

A summary of the endpoints and their uses can be found in the endpoints.json file and can also be found by sending a get request to /api

## Cloning and creating a build
#

To clone this repository please run the following command

```
git clone https://github.com/Holquaria/backend-portfolio
```

To install dependencies please run the following command

```
npm install
```

To seed local databases please run the following command

```
npm run seed
```

To run all tests please run the following command

```
npm test
```

To run the server locally please run the following command

```
npm start
```


## Environment Variables

To create environment variables for this project, please make two .env files with the following titles and content

.env.development

```
PGDATABASE=nc_news
```

.env.test

```
PGDATABASE=nc_news_test
```

## Minimum version information
#

Node: v19.0.0

PostgreSQL: 14.6 (Homebrew)