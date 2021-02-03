require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const expressJSDocSwagger = require('express-jsdoc-swagger');

const swaggerOptions = require('./swaggerOptions');
const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

// Documentation init
if (process.env.NODE_ENV !== 'test') {
  expressJSDocSwagger(app)(swaggerOptions);
  app.use(morgan('dev'));
}
app.use(helmet());
app.use(cors());
app.use(express.json());

// Checks root route with a JSON message
app.get('/', (req, res) => {
  return res.json({
    message: '👋🌎',
  });
});

// Sets API routes to /api/v0
app.use('/api/v0', api);

// Initialize 404, 401 and general error handler middlewares in whole app
app.use(middlewares.notFound);
app.use(middlewares.badRequest);
app.use(middlewares.errorHandler);

module.exports = app;
