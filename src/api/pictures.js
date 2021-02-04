const express = require('express');
const { valPicture, valPictureForUpdate } = require('../joiSchemas');
const prisma = require('../prismaClient');
const {
  joiValidation,
  checkToken,
  checkRole,
  upload,
} = require('../middlewares');

const { PORT } = process.env;

const router = express.Router();

/**
 * A picture (with id for output display)
 * @typedef {object} DisplayPicture
 * @property {number} id.required - 1
 * @property {string} url - "https://placeholder.com/placeholder.jpg"
 * @property {string} alt - "Lorem ipsum"
 */

/**
 * A picture
 * @typedef {object} PostPicture
 * @property {string} url - "https://placeholder.com/placeholder.jpg"
 * @property {string} alt - "Lorem ipsum"
 *  @property {number} id_property - 1
 */

/**
 * A picture
 * @typedef {object} UpdatePicture
 * @property {string} url - "https://placeholder.com/placeholder.jpg"
 * @property {string} alt - "Lorem ipsum"
 *  @property {number} id_property - 1
 */

// PICTURES UPLOAD
router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(403).json(err);
      // { message: 'Error : file type must be .jpg, .jpeg or .png' });
    }
    return res.status(201).json({
      path: `${req.protocol}://${req.hostname}:${PORT}/${req.file.path}`,
    });
  });
});

/**
 * GET /api/v0/pictures
 * @summary View all pictures
 * @tags picture
 * @return {array<DisplayPicture>} 200 - picture list successfully retrieved
 * @return {object} 400 - Bad request
 * @security bearerAuth
 */
router.get('/', checkToken, async (req, res, next) => {
  try {
    // Gets all pictures with their properties.
    const pictures = await prisma.picture.findMany({
      include: { property: true },
    });
    // Returns a 200 'OK' HTTP code response + all infos JSON
    return res.status(200).json(pictures);
    // Returns a 400 'Bad Request' if any error occurs
  } catch (error) {
    res.status(400);
    // Triggers the error handling middleware
    return next(error);
  }
});

/**
 * GET /api/v0/pictures/{id}
 * @summary View picture by id
 * @tags picture
 * @param {number} id.path - id of wanted picture
 * @return {array<DisplayPicture>} 200 - picture successfully retrieved
 * @return {object} 404 - picture not found
 * @security bearerAuth
 */
router.get('/:id', checkToken, async (req, res, next) => {
  const { id } = req.params;
  try {
    // Gets a unique picture by his id with its properties.
    const picture = await prisma.picture.findUnique({
      where: {
        id: parseInt(id, 10),
      },
      include: { property: true },
    });

    if (!picture) {
      return next();
    }

    return res.status(200).json(picture);
  } catch (error) {
    // Returns a 404 'Not Found' if any error occurs
    res.status(404);
    return next(error);
  }
});

/**
 * POST /api/v0/pictures
 * @summary Create a picture
 * @tags picture
 * @param {PostPicture} request.body.required - picture info
 * @return {array<DisplayPicture>} 201 - picture successfully created
 * @return {object} 422 - Bad data entries
 * @security bearerAuth
 */
router.post(
  '/',
  checkToken,
  // Allows only admin
  checkRole(true),
  joiValidation(valPicture),
  async (req, res, next) => {
    const { url, alt, property } = req.body;
    try {
      // Creates a picture with all infos infos provided by body
      const picture = await prisma.picture.create({
        data: {
          url,
          alt,
          property: {
            connect: { id: property },
          },
        },
        include: {
          property: true,
        },
      });
      // Returns a 201 'Created' HTTP code response + all infos JSON
      return res.status(201).json(picture);
    } catch (error) {
      // Returns a 422 'Bad Request' if any error occurs in creation processus
      res.status(422);
      return next(error);
    }
  }
);

/**
 * DELETE /api/v0/pictures/{id}
 * @summary Delete a picture
 * @tags picture
 * @param {number} id.path - id of wanted picture
 * @return {object} 204 - picture successfully deleted
 * @return {object} 404 - picture not found
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
      // Gets the id provided picture
      const picture = await prisma.picture.delete({
        where: {
          id: parseInt(id, 10),
        },
      });
      // Checks if picture exists, if not jumps to error handling
      if (!picture) {
        return next();
      } // Returns a 204 'Deleted' HTTP code response + all infos JSON
      return res.sendStatus(204);
    } catch (error) {
      res.status(404);
      return next(error);
    }
  }
);

/**
 * PUT /api/v0/pictures/{id}
 * @summary Update a picture
 * @tags picture
 * @param {number} id.path - id of wanted picture
 * @param {UpdatePicture} request.body.required - picture info
 * @return {array<DisplayPicture>} 200 - picture successfully updated
 * @return {object} 404 - picture not found
 * @return {object} 422 - Bad data entries
 * @security bearerAuth
 */
router.put(
  '/:id',
  checkToken,
  // Allows only admin
  checkRole(true),
  joiValidation(valPictureForUpdate),
  async (req, res, next) => {
    const { id } = req.params;
    const { url, alt, property } = req.body;
    try {
      // Updates the picture with body provided infos
      const updatedpicture = await prisma.picture.update({
        where: {
          id: parseInt(id, 10),
        },
        data: {
          url,
          alt,
          property: {
            connect: { id: property },
          },
        },
        include: { property: true },
      });
      return res.status(200).json(updatedpicture);
    } catch (error) {
      res.status(404);
      return next(error);
    }
  }
);

module.exports = router;
