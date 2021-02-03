/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
const express = require('express');
const { valFamily, valFamilyForPutRoute } = require('../joiSchemas');
const prisma = require('../prismaClient');
const { joiValidation, checkToken, checkRole } = require('../middlewares');

const router = express.Router();

/**
 * A family (with id for output display)
 * @typedef {object} DisplayFamily
 * @property {number} id.required - 1
 * @property {string} email - "jmoconnor@ftm.com"
 * @property {string} password - "P@ssw0rd"
 * @property {string} firstname - "Jean-Michel"
 * @property {string} lastname - "O'Connor de la Tour"
 * @property {boolean} isAdmin - false
 */

/**
 * A family
 * @typedef {object} PostFamily
 * @property {string} email - "jmoconnor@ftm.com"
 * @property {string} password - "P@ssw0rd"
 * @property {string} firstname - "Jean-Michel"
 * @property {string} lastname - "O'Connor de la Tour"
 * @property {boolean} isAdmin - false
 */

/**
 * A family
 * @typedef {object} UpdateFamily
 * @property {string} email - "jmoconnor@ftm.com"
 * @property {string} password - "P@ssw0rd"
 * @property {string} firstname - "Jean-Michel"
 * @property {string} lastname - "O'Connor de la Tour"
 * @property {boolean} isAdmin - false
 */

/**
 * GET /api/v0/families
 * @summary View all families
 * @tags family
 * @return {array<DisplayFamily>} 200 - family list successfully retrieved
 * @return {object} 400 - Bad request
 * @security bearerAuth
 */
router.get('/', checkToken, async (req, res, next) => {
  try {
    // Gets all families with their role, companies, products owned and notifications preferences.
    const families = await prisma.family.findMany();
    // Returns a 200 'OK' HTTP code response + all infos JSON
    return res.status(200).json(families);
    // Returns a 400 'Bad Request' if any error occurs
  } catch (error) {
    res.status(400);
    // Triggers the error handling middleware
    return next(error);
  }
});

/**
 * GET /api/v0/families/{id}
 * @summary View family by id
 * @tags family
 * @param {number} id.path - id of wanted family
 * @return {array<DisplayFamily>} 200 - family successfully retrieved
 * @return {object} 404 - family not found
 * @security bearerAuth
 */
router.get('/:id', checkToken, async (req, res, next) => {
  const { id } = req.params;
  try {
    // Gets a unique family by his id with his role, companies, products owned and notifications preferences.
    const family = await prisma.family.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });

    if (!family) {
      return next();
    }

    return res.status(200).json(family);
  } catch (error) {
    // Returns a 404 'Not Found' if any error occurs
    res.status(404);
    return next(error);
  }
});

/**
 * POST /api/v0/families
 * @summary Create a family
 * @tags family
 * @param {PostFamily} request.body.required - family info
 * @return {array<DisplayFamily>} 201 - family successfully created
 * @return {object} 422 - Bad data entries
 * @security bearerAuth
 */
// Open route for signup purpose
router.post('/', joiValidation(valFamily), async (req, res, next) => {
  const data = req.body;
  try {
    // Creates a family with all infos infos provided by body and connect it to a temporary 'prospect' role and to a company with it's provided SIRET
    const family = await prisma.family.create({
      data,
    });
    // Deletes password field from response for security purpose
    delete family.password;
    // Returns a 201 'Created' HTTP code response + all infos JSON
    return res.status(201).json(family);
  } catch (error) {
    // Returns a 422 'Bad Request' if any error occurs in creation processus
    res.status(422);
    return next(error);
  }
});

/**
 * DELETE /api/v0/families/{id}
 * @summary Delete a family
 * @tags family
 * @param {number} id.path - id of wanted family
 * @return {object} 204 - family successfully deleted
 * @return {object} 404 - family not found
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
      // Gets the id provided family
      const family = await prisma.family.findUnique({
        where: {
          id: parseInt(id, 10),
        },
      });
      // Checks if family exists, if not jumps to error handling
      if (!family) {
        return next();
      }
      // Deletes family from database by its id. As Prisma is unable to handle cascading delete for now, uses Raw SQL instead
      await prisma.$executeRaw`DELETE FROM family WHERE id = ${id};`;
      // Returns a 204 'Deleted' HTTP code response + all infos JSON
      return res.sendStatus(204);
    } catch (error) {
      res.status(404);
      return next(error);
    }
  }
);

/**
 * PUT /api/v0/families/{id}
 * @summary Update a family
 * @tags family
 * @param {number} id.path - id of wanted family
 * @param {UpdateFamily} request.body.required - family info
 * @return {array<Displayfamily>} 200 - family successfully updated
 * @return {object} 404 - family not found
 * @return {object} 422 - Bad data entries
 * @security bearerAuth
 */
router.put(
  '/:id',
  checkToken,
  // Allows only admin
  checkRole(true),
  joiValidation(valFamilyForPutRoute),
  async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;
    try {
      // Updates the family with body provided infos
      const updatedfamily = await prisma.family.update({
        where: {
          id: parseInt(id, 10),
        },
        data,
      });
      delete updatedfamily.password;
      return res.status(200).json(updatedfamily);
    } catch (error) {
      res.status(404);
      return next(error);
    }
  }
);

module.exports = router;
