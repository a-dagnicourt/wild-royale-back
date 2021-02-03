const express = require('express');
const { valRole } = require('../joiSchemas');
const { joiValidation, checkToken, checkRole } = require('../middlewares');
const prisma = require('../prismaClient');

const router = express.Router();

router.use(checkToken);

/**
 * A role (with id for output display)
 * @typedef {object} DisplayRole
 * @property {number} id.required - 1
 * @property {string} label - "admin"
 */

/**
 * A role
 * @typedef {object} Role
 * @property {string} label - "admin"
 */

/**
 * GET /api/v0/roles
 * @summary View all roles
 * @tags roles
 * @return {array<DisplayRole>} 200 - Role list successfully retrieved
 * @return {object} 400 - Bad request
 * @security bearerAuth
 * */
router.get(
  '/',
  // Allows every role except prospect
  checkRole('superadmin' || 'admin' || 'user'),
  async (req, res, next) => {
    const { role } = req.query;
    try {
      // Gets all roles with their connected users.
      const roles = await prisma.role.findMany({
        where: {
          label: role,
        },
        include: {
          user: true,
        },
      });
      // Returns a 200 'OK' HTTP code response + all infos JSON
      return res.status(200).json(roles);
      // Returns a 400 'Bad Request' if any error occurs
    } catch (error) {
      res.status(400);
      // Triggers the error handling middleware
      return next(error);
    }
  }
);

/**
 * GET /api/v0/roles/{roleId}
 * @summary View role by id
 * @tags roles
 * @param {number} roleId.path - id of wanted role
 * @return {array<DisplayRole>} 200 - Role successfully retrieved
 * @return {object} 404 - Role not found
 * @security bearerAuth
 * */
router.get(
  '/:id',
  // Allows every role except prospect
  checkRole('superadmin' || 'admin' || 'user'),
  async (req, res, next) => {
    const { id } = req.params;
    try {
      // Gets a unique role by its id with its connected users.
      const role = await prisma.role.findUnique({
        where: {
          id: parseInt(id, 10),
        },
        include: {
          user: true,
        },
      });

      if (!role) {
        return next();
      }

      return res.status(200).json(role);
    } catch (error) {
      // Returns a 404 'Not Found' if any error occurs
      res.status(404);
      return next(error);
    }
  }
);

/**
 * POST /api/v0/roles/
 * @summary Create a role
 * @tags roles
 * @param {Role} request.body.required - Role info
 * @return {array<DisplayRole>} 201 - Role successfully created
 * @return {object} 422 - Bad data entries
 * @security bearerAuth
 * */
router.post(
  '/',
  // Allows only superadmin
  checkRole('superadmin'),
  joiValidation(valRole),
  async (req, res, next) => {
    const { label } = req.body;
    try {
      // Creates a role with all infos infos provided by body
      const role = await prisma.role.create({
        data: {
          label,
        },
      });
      // Returns a 201 'Created' HTTP code response + all infos JSON
      return res.status(201).json(role);
    } catch (error) {
      // Returns a 422 'Bad Request' if any error occurs in creation processus
      res.status(422);
      return next(error);
    }
  }
);

/**
 * DELETE /api/v0/roles/{roleId}
 * @summary Delete role
 * @tags roles
 * @param {number} roleId.path - id of wanted role
 * @return {object} 204 - Role successfully deleted
 * @return {object} 404 - Role not found
 * @security bearerAuth
 * */
router.delete(
  '/:id',
  // Allows only superadmin
  checkRole('superadmin'),
  async (req, res, next) => {
    const { id } = req.params;
    try {
      // Deletes role from database by its id
      await prisma.role.delete({
        where: {
          id: parseInt(id, 10),
        },
      });
      // Returns a 204 'Deleted' HTTP code response + all infos JSON
      return res.sendStatus(204);
    } catch (error) {
      res.status(404);
      return next(error);
    }
  }
);

/**
 * PUT /api/v0/roles/{roleId}
 * @summary Update role
 * @tags roles
 * @param {number} roleId.path - id of wanted role
 * @param {roles} request.body.required - Role info
 * @return {array<DisplayRole>} 200 - Role successfully updated
 * @return {object} 404 - Role not found
 * @return {object} 422 - Bad data entries
 * @security bearerAuth
 * */
router.put(
  '/:id',
  // Allows only superadmin
  checkRole('superadmin'),
  joiValidation(valRole),
  async (req, res, next) => {
    const { id } = req.params;
    const { label } = req.body;

    try {
      // Updates the id provided role
      const updatedRole = await prisma.role.update({
        where: {
          id: parseInt(id, 10),
        },
        data: {
          label,
        },
      });

      return res.status(200).json(updatedRole);
    } catch (error) {
      res.status(404);

      return next(error);
    }
  }
);

module.exports = router;
