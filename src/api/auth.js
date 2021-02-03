require('dotenv').config();
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');
const { comparePassword } = require('../util');

const { PRIVATE_KEY } = process.env;

/**
 * Auth
 * @typedef {object} Auth
 * @property {string} email - Email
 * @property {string} password - Password
 */

/**
 * POST /api/v0/auth/login
 * @summary Log in
 * @tags auth
 * @param {Auth} request.body.required - User info
 * @return {array<Auth>} 200 - Successfully logged in
 * @return {object} 404 - User not found
 * @return {object} 401 - Incorrect password
 */

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Checks if user exists verifying his email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      // Includes all datas related to the user
      include: {
        role: true,
        company: true,
        notification: true,
        productsOwned: true,
      },
    });

    // If user isn't found, throw a 404 error
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // If the user's email OR password are missing, throw a 422 error
    if (!email || !password) {
      res.status(422);
      throw new Error('Fields are missing');
    }

    // Checks if the password provided in login is the user's one
    const doesPasswordsMatch = comparePassword(password, user.password);

    // If passwords aren't matching, throw a 401 error
    if (!doesPasswordsMatch) {
      res.status(401);
      throw new Error('Incorrect password');
    }

    // If everything is valid, creates a new token
    const token = jwt.sign(
      {
        email: user.email,
        role: user.role[0].label,
      },
      PRIVATE_KEY,
      {
        expiresIn: '1d',
      }
    );

    // Deletes password filed from response
    delete user.password;

    // Sends a response with token and users + data related in a JSON object
    res.status(200).json({
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
