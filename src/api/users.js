/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
const express = require('express');
const { valUser, valUserForPutRoute } = require('../joiSchemas');
const prisma = require('../prismaClient');
const { hashPassword } = require('../util');
const { joiValidation, checkToken, checkRole } = require('../middlewares');

const router = express.Router();

/**
 * A user (with id for output display)
 * @typedef {object} DisplayUser
 * @property {number} id.required - 1
 * @property {string} email - "jmoconnor@ftm.com"
 * @property {string} password - "P@ssw0rd"
 * @property {string} firstname - "Jean-Michel"
 * @property {string} lastname - "O'Connor de la Tour"
 * @property {boolean} isAdmin - false
 */

/**
 * A user
 * @typedef {object} PostUser
 * @property {string} email - "jmoconnor@ftm.com"
 * @property {string} password - "P@ssw0rd"
 * @property {string} firstname - "Jean-Michel"
 * @property {string} lastname - "O'Connor de la Tour"
 * @property {boolean} isAdmin - false
 */

/**
 * A user
 * @typedef {object} UpdateUser
 * @property {string} email - "jmoconnor@ftm.com"
 * @property {string} password - "P@ssw0rd"
 * @property {string} firstname - "Jean-Michel"
 * @property {string} lastname - "O'Connor de la Tour"
 * @property {boolean} isAdmin - false
 */

/**
 * GET /api/v0/users
 * @summary View all users
 * @tags users
 * @return {array<DisplayUser>} 200 - User list successfully retrieved
 * @return {object} 400 - Bad request
 * @security bearerAuth
 */
router.get('/', checkToken, async (req, res, next) => {
  try {
    // Gets all users with their role, companies, products owned and notifications preferences.
    const users = await prisma.user.findMany({
      include: { reservation: true },
    });
    // Returns a 200 'OK' HTTP code response + all infos JSON
    return res.status(200).json(users);
    // Returns a 400 'Bad Request' if any error occurs
  } catch (error) {
    res.status(400);
    // Triggers the error handling middleware
    return next(error);
  }
});

/**
 * GET /api/v0/users/{id}
 * @summary View user by id
 * @tags users
 * @param {number} id.path - id of wanted user
 * @return {array<DisplayUser>} 200 - User successfully retrieved
 * @return {object} 404 - User not found
 * @security bearerAuth
 */
router.get(
  '/:id',
  checkToken,
  // Allows only admin
  checkRole(true),
  async (req, res, next) => {
    const { id } = req.params;
    try {
      // Gets a unique user by his id with his role, companies, products owned and notifications preferences.
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(id, 10),
        },
        include: { reservation: true },
      });

      if (!user) {
        return next();
      }

      return res.status(200).json(user);
    } catch (error) {
      // Returns a 404 'Not Found' if any error occurs
      res.status(404);
      return next(error);
    }
  }
);

/**
 * POST /api/v0/users
 * @summary Create a user
 * @tags users
 * @param {PostUser} request.body.required - User info
 * @return {array<DisplayUser>} 201 - User successfully created
 * @return {object} 422 - Bad data entries
 * @security bearerAuth
 */
// Open route for signup purpose
router.post('/', joiValidation(valUser), async (req, res, next) => {
  const { password, firstname, lastname, email } = req.body;
  try {
    // Creates a user with all infos infos provided by body and connect it to a temporary 'prospect' role and to a company with it's provided SIRET
    const user = await prisma.user.create({
      data: {
        password: hashPassword(password),
        firstname,
        lastname,
        email,
      },
    });
    // Deletes password field from response for security purpose
    delete user.password;
    // Returns a 201 'Created' HTTP code response + all infos JSON
    return res.status(201).json(user);
  } catch (error) {
    // Returns a 422 'Bad Request' if any error occurs in creation processus
    res.status(422);
    return next(error);
  }
});

/**
 * DELETE /api/v0/users/{id}
 * @summary Delete a user
 * @tags users
 * @param {number} id.path - id of wanted user
 * @return {object} 204 - User successfully deleted
 * @return {object} 404 - User not found
 * @security bearerAuth
 */
router.delete(
  '/:id',
  checkToken,
  // Allows only admin
  checkRole(true),
  async (req, res, next) => {
    const { id } = req.params;
    try {
      // Gets the id provided user
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(id, 10),
        },
      });
      // Checks if user exists, if not jumps to error handling
      if (!user) {
        return next();
      }
      // Deletes user from database by its id. As Prisma is unable to handle cascading delete for now, uses Raw SQL instead
      await prisma.$executeRaw`DELETE FROM user WHERE id = ${id};`;
      // Returns a 204 'Deleted' HTTP code response + all infos JSON
      return res.sendStatus(204);
    } catch (error) {
      res.status(404);
      return next(error);
    }
  }
);

/**
 * PUT /api/v0/users/{id}
 * @summary Update a user
 * @tags users
 * @param {number} id.path - id of wanted user
 * @param {UpdateUser} request.body.required - User info
 * @return {array<DisplayUser>} 200 - User successfully updated
 * @return {object} 404 - User not found
 * @return {object} 422 - Bad data entries
 * @security bearerAuth
 */
router.put(
  '/:id',
  checkToken,
  // Allows only admin
  checkRole(true),
  joiValidation(valUserForPutRoute),
  async (req, res, next) => {
    const { id } = req.params;
    const { password, firstname, lastname, email, isAdmin } = req.body;
    try {
      // Updates the user with body provided infos
      const updatedUser = await prisma.user.update({
        where: {
          id: parseInt(id, 10),
        },
        data: {
          password: hashPassword(password),
          firstname,
          lastname,
          email,
          isAdmin,
        },
      });
      delete updatedUser.password;
      return res.status(200).json(updatedUser);
    } catch (error) {
      res.status(404);
      return next(error);
    }
  }
);

module.exports = router;
