const express = require('express');
const { valCompany } = require('../joiSchemas');
const { joiValidation, checkToken, checkRole } = require('../middlewares');
const prisma = require('../prismaClient');

const router = express.Router();

/**
 * A company (with id for output display)
 * @typedef {object} DisplayCompany
 * @property {number} id.required - 1
 * @property {string} label - "Follow The Market"
 * @property {string} SIRET_number - "12345678912345"
 * @property {string} VAT_number - "FR12123456789"
 * @property {string} city - "Lille"
 * @property {number} zip_code - "59000"
 * @property {string} street - "165 avenue de Bretagne Euratechnologies"
 * @property {string} country - "France"
 */

/**
 * A company
 * @typedef {object} Company
 * @property {string} label - Company name
 * @property {string} SIRET_number - Siret number
 * @property {string} VAT_number - "FR12123456789"
 * @property {string} city - "Lille"
 * @property {number} zip_code - "59000"
 * @property {string} street - "165 avenue de Bretagne Euratechnologies"
 * @property {string} country - "France"
 */

/**
 * GET /api/v0/companies/
 * @summary View all companies
 * @tags company
 * @return {array<DisplayCompany>} 200 - Company list successfully retrieved
 * @return {object} 400 - Bad request
 * @security bearerAuth
 */

router.get(
  '/',
  checkToken,
  // Allows every role except prospect
  checkRole('superadmin' || 'admin' || 'user'),
  async (req, res, next) => {
    const { name } = req.query;

    try {
      // Gets all companies with their users.
      const companies = await prisma.company.findMany({
        where: {
          label: name,
        },
        include: {
          user: true,
        },
      });
      // Returns a 200 'OK' HTTP code response + all infos JSON
      return res.status(200).json(companies);
      // Returns a 400 'Bad Request' if any error occurs
    } catch (error) {
      res.status(400);
      // Triggers the error handling middleware
      return next(error);
    }
  }
);

/**
 * GET /api/v0/companies/{companyId}
 * @summary View company by id
 * @tags company
 * @param {number} companyId.path - id of wanted company
 * @return {array<DisplayCompany>} 200 - Company successfully retrieved
 * @return {object} 404 - Not found
 * @security bearerAuth
 */
router.get(
  '/:id',
  checkToken,
  // Allows every role except prospect
  checkRole('superadmin' || 'admin' || 'user'),
  async (req, res, next) => {
    const { id } = req.params;

    try {
      // Gets a unique company by its id with its users.
      const companies = await prisma.company.findUnique({
        where: {
          id: parseInt(id, 10),
        },
        include: {
          user: true,
        },
      });

      if (!companies) {
        return next();
      }
      return res.status(200).json(companies);
    } catch (error) {
      // Returns a 404 'Not Found' if any error occurs
      res.status(404);
      return next(error);
    }
  }
);

/**
 * GET /api/v0/companies/{companyId}/users
 * @summary View all users in a company
 * @tags company
 * @param {number} companyId.path - id of wanted company
 * @return {array<ShortDisplayUser>} 200 - Users successfully retrieved
 * @return {object} 404 - Not found
 * @security bearerAuth
 */
router.get(
  '/:id/users',
  checkToken,
  // Allows only superadmin and admin
  checkRole('superadmin' || 'admin'),
  async (req, res, next) => {
    const { id } = req.params;
    try {
      // Gets all users with their role, products owned and notifications preferences from a specific company identified by its id.
      const users = await prisma.user.findMany({
        where: {
          company: {
            every: {
              id: parseInt(id, 10),
            },
          },
        },
        include: {
          role: true,
          productsOwned: true,
          notification: true,
        },
      });

      if (!users) {
        return next();
      }

      return res.status(200).json(users);
    } catch (error) {
      res.status(404);
      return next(error);
    }
  }
);

/**
 * POST /api/v0/companies
 * @summary Create a company
 * @tags company
 * @param {Company} request.body.required - Company info
 * @return {array<DisplayCompany>} 201 - Company successfully created
 * @return {object} 422 - Bad data entries
 * @security bearerAuth
 */

// Open route for signup purpose
router.post('/', joiValidation(valCompany), async (req, res, next) => {
  const data = req.body;

  try {
    // Creates a company with all infos infos provided by body
    const company = await prisma.company.create({
      data: { ...data },
    });
    // Returns a 201 'Created' HTTP code response + all infos JSON
    return res.status(201).json(company);
  } catch (error) {
    // Returns a 422 'Bad Request' if any error occurs in creation processus
    res.status(422);
    return next(error);
  }
});

/**
 * DELETE /api/v0/companies/{companyId}
 * @summary Delete a company
 * @tags company
 * @param {number} companyId.path - id of wanted company
 * @return {object} 204 - Company successfully deleted
 * @return {object} 404 - Company not found
 * @security bearerAuth
 */
router.delete(
  '/:id',
  checkToken,
  // Allows only superadmin and admin
  checkRole('superadmin' || 'admin'),
  async (req, res, next) => {
    const { id } = req.params;

    try {
      // Deletes company from database by its id
      await prisma.company.delete({
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
 * PUT /api/v0/companies/{companyId}
 * @summary Update a company
 * @tags company
 * @param {number} companyId.path - id of wanted company
 * @param {Company} request.body.required - Company info
 * @return {array<DisplayCompany>} 200 - Company successfully updated
 * @return {object} 404 - Company not found
 * @return {object} 422 - Bad data entries
 * @security bearerAuth
 */
router.put(
  '/:id',
  checkToken,
  // Allows only superadmin and admin
  checkRole('superadmin' || 'admin'),
  joiValidation(valCompany),
  async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;

    try {
      // Updates the id provided company
      const updateCompany = await prisma.company.update({
        where: {
          id: parseInt(id, 10),
        },
        data: { ...data },
      });

      return res.status(200).json(updateCompany);
    } catch (error) {
      res.status(404);
      return next(error);
    }
  }
);

module.exports = router;
