const express = require('express');
const { valProperty, valPropertyForUpdate } = require('../joiSchemas');
const { joiValidation, checkToken, checkRole } = require('../middlewares');
const prisma = require('../prismaClient');

const router = express.Router();

/**
 * A property (with id for output display)
 * @typedef {object} DisplayProperty
 * @property {number} id.required - 1
 * @property {string} label - "Outstanding castle"
 * @property {string} lat - "100.0000"
 * @property {string} long - "-10.0000"
 * @property {string} pictureUrl - "https://upload.wikimedia.org/wikipedia/commons/a/ae/Castle_Neuschwanstein.jpg",
 * @property {string} pictureAlt - "Wow castle"
 */

/**
 * A property
 * @typedef {object} Property
 * @property {string} label - "Outstanding castle"
 * @property {string} lat - "100.0000"
 * @property {string} long - "-10.0000"
 * @property {string} pictureUrl - "https://upload.wikimedia.org/wikipedia/commons/a/ae/Castle_Neuschwanstein.jpg",
 * @property {string} pictureAlt - "Wow castle"
 */

/**
 * GET /api/v0/properties/
 * @summary View all properties
 * @tags property
 * @return {array<DisplayProperty>} 200 - property list successfully retrieved
 * @return {object} 400 - Bad request
 * @security bearerAuth
 */

router.get('/', checkToken, async (req, res, next) => {
  const { name } = req.query;

  try {
    // Gets all properties with their pictures and reservations.
    const properties = await prisma.property.findMany({
      where: {
        label: name,
      },
      include: { picture: true, reservation: true },
    });
    // Returns a 200 'OK' HTTP code response + all infos JSON
    return res.status(200).json(properties);
    // Returns a 400 'Bad Request' if any error occurs
  } catch (error) {
    res.status(400);
    // Triggers the error handling middleware
    return next(error);
  }
});

/**
 * GET /api/v0/properties/{propertyId}
 * @summary View property by id
 * @tags property
 * @param {number} propertyId.path - id of wanted property
 * @return {array<DisplayProperty>} 200 - property successfully retrieved
 * @return {object} 404 - Not found
 * @security bearerAuth
 */
router.get('/:id', checkToken, async (req, res, next) => {
  const { id } = req.params;

  try {
    // Gets a unique property by its id with its pictures and reservations.
    const properties = await prisma.property.findUnique({
      where: {
        id: parseInt(id, 10),
      },
      include: { picture: true, reservation: true },
    });

    if (!properties) {
      return next();
    }
    return res.status(200).json(properties);
  } catch (error) {
    // Returns a 404 'Not Found' if any error occurs
    res.status(404);
    return next(error);
  }
});

/**
 * POST /api/v0/properties
 * @summary Create a property
 * @tags property
 * @param {property} request.body.required - property info
 * @return {array<DisplayProperty>} 201 - property successfully created
 * @return {object} 422 - Bad data entries
 * @security bearerAuth
 */

router.post(
  '/',
  checkToken,
  // Allows only admin
  checkRole(true),
  joiValidation(valProperty),
  async (req, res, next) => {
    const { label, lat, long, pictureUrl, pictureAlt } = req.body;

    try {
      // Creates a property with all infos infos provided by body
      const property = await prisma.property.create({
        data: {
          label,
          lat,
          long,
          picture: {
            create: {
              url: pictureUrl,
              alt: pictureAlt,
            },
          },
        },
      });
      // Returns a 201 'Created' HTTP code response + all infos JSON
      return res.status(201).json(property);
    } catch (error) {
      // Returns a 422 'Bad Request' if any error occurs in creation processus
      res.status(422);
      return next(error);
    }
  }
);

/**
 * DELETE /api/v0/properties/{propertyId}
 * @summary Delete a property
 * @tags property
 * @param {number} propertyId.path - id of wanted property
 * @return {object} 204 - property successfully deleted
 * @return {object} 404 - property not found
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
      // Gets the id provided property
      const property = await prisma.property.findUnique({
        where: {
          id: parseInt(id, 10),
        },
      });
      // Checks if property exists, if not jumps to error handling
      if (!property) {
        return next();
      }
      // Deletes property from database by its id. As Prisma is unable to handle cascading delete for now, uses Raw SQL instead
      await prisma.$executeRaw`DELETE FROM property WHERE id = ${id};`;
      // Returns a 204 'Deleted' HTTP code response + all infos JSON
      return res.sendStatus(204);
    } catch (error) {
      res.status(404);
      return next(error);
    }
  }
);

/**
 * PUT /api/v0/properties/{propertyId}
 * @summary Update a property
 * @tags property
 * @param {number} propertyId.path - id of wanted property
 * @param {Property} request.body.required - property info
 * @return {array<DisplayProperty>} 200 - property successfully updated
 * @return {object} 404 - property not found
 * @return {object} 422 - Bad data entries
 * @security bearerAuth
 */
router.put(
  '/:id',
  checkToken,
  // Allows only admin
  checkRole(true),
  joiValidation(valPropertyForUpdate),
  async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;

    try {
      // Updates the id provided property
      const updateProperty = await prisma.property.update({
        where: {
          id: parseInt(id, 10),
        },
        data: { ...data },
      });

      return res.status(200).json(updateProperty);
    } catch (error) {
      res.status(404);
      return next(error);
    }
  }
);

module.exports = router;
