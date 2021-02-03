require('dotenv').config();
const jwt = require('jsonwebtoken');

const { PRIVATE_KEY } = process.env;

// Initializes role from jwt auth
let jwtRole;

// Checks token function
function checkToken(req, res, next) {
  try {
    const { authorization } = req.headers;
    // If token isn't provided in auth headers throw a 401 error
    if (!authorization) {
      res.status(401);
      throw new Error('Please provide a token');
    }

    // Splits token and bearer to get datas
    const [bearer, token] = authorization.split(' ');

    // Checks if token format is valid, if not throw a 401 error
    if (bearer !== 'Bearer') {
      res.status(401);
      throw new Error("Please respect the 'Bearer token' format");
    }

    // Checks integrity of token
    jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
      // If invalid, throw an error that will be handled by error middleware
      if (err) {
        throw err;
      }
      req.user = {
        ...decoded,
      };
      // extract role from user req for role check function
      jwtRole = decoded.role;
      next();
    });
  } catch (error) {
    next(error);
  }
}

// Checks role of logged user
function checkRole(role) {
  return (req, res, next) => {
    try {
      // Checks if logged role matchs role passed as parameter
      if (role !== jwtRole) {
        // If fails, throw an error
        throw new Error("Your role doesn't allow you to do that");
      }
      return next();
    } catch (error) {
      res.status(401);
      return next(error);
    }
  };
}

// Handles 404 errors from requests
function notFound(req, res, next) {
  res.status(404);
  const err = new Error('Not Found');
  next(err);
}

// Handles 400 errors from requests
function badRequest(req, res, next) {
  res.status(400);
  const err = new Error('Bad Request');
  next(err);
}

// General erro handler
/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  // If status code isn't 200, sets status as provided code, if no one is provided automatically sets it as 500 error
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    // If environnement is dev, provides a detailled stack of the error
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
}

// Data entry validations
const joiValidation = (schema) => async (req, res, next) => {
  try {
    // Tries to validate data entry with associated schema
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    // If fails, throw a 422 error
    res.status(422);
    next(err);
  }
};

module.exports = {
  notFound,
  badRequest,
  errorHandler,
  joiValidation,
  checkToken,
  checkRole,
};
