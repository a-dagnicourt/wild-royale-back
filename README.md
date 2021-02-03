# API Wild Royale

This application provides a simple API for the Wild Code School final checkpoint quest : Wild Royale !

Follow the instructions below!

## Getting started

```sh
git clone repo
cd repo
npm install
npm run coldstart # runs migrations and seed for the first launch of the project

npm run dev
```

## Create and edit the `.env` file

This application uses [dotenv](https://www.npmjs.com/package/dotenv), which allows to load variables from a specific file: `.env`. This is where sensitive data, such as database settings, JWT secret key, API keys, etc. are stored.

This file is **not** provided here, because it should **never** be committed! Use the example below, the quickly create your .env file.

_Example:_

```
# General settings
PORT=5000
PRIVATE_KEY=anySecretK3y

# Database settings
NODE_ENV=dev
DATABASE_URL=mysql://user:password@localhost:3306/db
```

## We use in this project

**Includes API Server utilities:**

- [morgan](https://www.npmjs.com/package/morgan)
  - HTTP request logger middleware for node.js
- [helmet](https://www.npmjs.com/package/helmet)
  - Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
- [dotenv](https://www.npmjs.com/package/dotenv)
  - Dotenv is a zero-dependency module that loads environment variables from a `.env` file into `process.env`
- [express-jsdoc-swagger](https://www.npmjs.com/package/express-jsdoc-swagger)
  - With this library, you can document your express endpoints using swagger OpenAPI 3 Specification without writing YAML or JSON.
- [joi](https://www.npmjs.com/package/joi)
  - The most powerful schema description language and data validator for JavaScript.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
  - An implementation of JSON Web Tokens.
- [bcrypt](https://www.npmjs.com/package/bcrypt)
  - A library to help you hash passwords.

**Development utilities:**

- [prisma](https://www.npmjs.com/package/@prisma/cli)
  - Prisma helps app developers build faster and make fewer errors with an open source ORM for PostgreSQL, MySQL and SQLite.
- [nodemon](https://www.npmjs.com/package/nodemon)
  - nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.
- [eslint](https://www.npmjs.com/package/eslint)
  - ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
- [prettier](https://www.npmjs.com/package/prettier)
  - Prettier is an opinionated code formatter.
- [jest](https://www.npmjs.com/package/jest)
  - Complete and ready to set-up JavaScript testing solution. Works out of the box for any React project.
- [supertest](https://www.npmjs.com/package/supertest)
  - HTTP assertions made easy via superagent.
- [husky](https://www.npmjs.com/package/husky)
  - Husky can prevent bad git commit, git push and more.

## Scripts:

- Start Dev server
  - `npm run dev`
- Start tests
  - `npm run test`
- Generate Prisma schema
  - `npm run generate`
- Migrate Prisma schema to update database
  - `npm run migrate:dev`
- Reset your database and add seeds
  - `npm run seeds`

## Documentation:

**You can access a Swagger generated documentation of the API with** `/api-docs/`

_Schema_ section will give you examples of fields format

_Routes_ will give you a preview of responses and requests body schemas

**For more detailled format information please refer to** `src/joiSchemas.js`
