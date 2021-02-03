/* eslint-disable camelcase */
const express = require('express');
const { valRes, valResForUpdate } = require('../joiSchemas');
const prisma = require('../prismaClient');
const { joiValidation, checkToken } = require('../middlewares');

const router = express.Router();

/**
 * A reservation (with id for output display)
 * @typedef {object} DisplayReservation
 * @property {number} id.required - 1
 * @property {number} property - 1
 * @property {number} user - 1
 * @property {string} start_date - "2021-01-01T00:00:00.000Z"
 * @property {string} end_date - "2021-01-01T01:00:00.000Z"
 */

/**
 * A reservation
 * @typedef {object} PostReservation
 * @property {number} property - 1
 * @property {number} user - 1
 * @property {string} start_date - "2021-01-01T00:00:00.000Z"
 * @property {string} end_date - "2021-01-01T01:00:00.000Z"
 */

/**
 * A reservation
 * @typedef {object} UpdateReservation
 * @property {number} property - 1
 * @property {number} user - 1
 * @property {string} start_date - "2021-01-01T00:00:00.000Z"
 * @property {string} end_date - "2021-01-01T01:00:00.000Z"
 */

/**
 * GET /api/v0/reservations
 * @summary View all reservations
 * @tags reservation
 * @return {array<DisplayReservation>} 200 - reservation list successfully retrieved
 * @return {object} 400 - Bad request
 * @security bearerAuth
 */
router.get('/', checkToken, async (req, res, next) => {
  try {
    // Gets all reservations with his users and properties infos.
    const reservations = await prisma.reservation.findMany({
      include: { property: true, user: true },
    });
    // Returns a 200 'OK' HTTP code response + all infos JSON
    return res.status(200).json(reservations);
    // Returns a 400 'Bad Request' if any error occurs
  } catch (error) {
    res.status(400);
    // Triggers the error handling middleware
    return next(error);
  }
});

/**
 * GET /api/v0/reservations/{id}
 * @summary View reservation by id
 * @tags reservation
 * @param {number} id.path - id of wanted reservation
 * @return {array<DisplayReservation>} 200 - reservation successfully retrieved
 * @return {object} 404 - reservation not found
 * @security bearerAuth
 */
router.get('/:id', checkToken, async (req, res, next) => {
  const { id } = req.params;
  try {
    // Gets a unique reservation by his id with its users and properties infos.
    const reservation = await prisma.reservation.findUnique({
      where: {
        id: parseInt(id, 10),
      },
      include: { property: true, user: true },
    });

    if (!reservation) {
      return next();
    }

    return res.status(200).json(reservation);
  } catch (error) {
    // Returns a 404 'Not Found' if any error occurs
    res.status(404);
    return next(error);
  }
});

/**
 * POST /api/v0/reservations
 * @summary Create a reservation
 * @tags reservation
 * @param {Postreservation} request.body.required - reservation info
 * @return {array<DisplayReservation>} 201 - reservation successfully created
 * @return {object} 422 - Bad data entries
 * @security bearerAuth
 */
router.post('/', checkToken, joiValidation(valRes), async (req, res, next) => {
  const { property, user, start_date, end_date } = req.body;
  try {
    // Creates a reservation with all infos infos provided by body and connect it to a temporary 'prospect' role and to a company with it's provided SIRET
    const reservation = await prisma.reservation.create({
      data: {
        property: {
          connect: {
            id: property,
          },
        },
        user: {
          connect: {
            id: user,
          },
        },
        start_date,
        end_date,
      },
      include: {
        property: true,
        user: true,
      },
    });
    // Deletes password field from response for security purpose
    delete reservation.password;
    // Returns a 201 'Created' HTTP code response + all infos JSON
    return res.status(201).json(reservation);
  } catch (error) {
    // Returns a 422 'Bad Request' if any error occurs in creation processus
    res.status(422);
    return next(error);
  }
});

/**
 * DELETE /api/v0/reservations/{id}
 * @summary Delete a reservation
 * @tags reservations
 * @param {number} id.path - id of wanted reservation
 * @return {object} 204 - reservation successfully deleted
 * @return {object} 404 - reservation not found
 * @security bearerAuth
 */
router.delete('/:id', checkToken, async (req, res, next) => {
  const { id } = req.params;
  try {
    // Gets the id provided reservation
    const reservation = await prisma.reservation.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });
    // Checks if reservation exists, if not jumps to error handling
    if (!reservation) {
      return next();
    }
    // Deletes reservation from database by its id. As Prisma is unable to handle cascading delete for now, uses Raw SQL instead
    await prisma.$executeRaw`DELETE FROM reservation WHERE id = ${id};`;
    // Returns a 204 'Deleted' HTTP code response + all infos JSON
    return res.sendStatus(204);
  } catch (error) {
    res.status(404);
    return next(error);
  }
});

/**
 * PUT /api/v0/reservations/{id}
 * @summary Update a reservation
 * @tags reservations
 * @param {number} id.path - id of wanted reservation
 * @param {Updatereservation} request.body.required - reservation info
 * @return {array<Displayreservation>} 200 - reservation successfully updated
 * @return {object} 404 - reservation not found
 * @return {object} 422 - Bad data entries
 * @security bearerAuth
 */
router.put(
  '/:id',
  checkToken,
  joiValidation(valResForUpdate),
  async (req, res, next) => {
    const { id } = req.params;
    const { property, user, start_date, end_date } = req.body;
    try {
      // Updates the reservation with body provided infos
      const updatedReservation = await prisma.reservation.update({
        where: {
          id: parseInt(id, 10),
        },
        data: {
          property: {
            connect: {
              id: property,
            },
          },
          user: {
            connect: {
              id: user,
            },
          },
          start_date,
          end_date,
        },
        include: {
          property: true,
          user: true,
        },
      });
      delete updatedReservation.password;
      return res.status(200).json(updatedReservation);
    } catch (error) {
      res.status(404);
      return next(error);
    }
  }
);

module.exports = router;
