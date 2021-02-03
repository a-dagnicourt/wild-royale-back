/* eslint-disable camelcase */
const express = require('express');
const { valNotif } = require('../joiSchemas');
const { joiValidation, checkToken, checkRole } = require('../middlewares');
const prisma = require('../prismaClient');

const router = express.Router();

router.use(checkToken);
// Allow every role except prospect
router.use(checkRole('superadmin' || 'admin' || 'user'));

/**
 * A notification (with id for output display)
 * @typedef {object} DisplayNotification
 * @property {number} id.required - 1
 * @property {string} zone - "Lille"
 * @property {string} vertical_trade - "Market data"
 * @property {boolean} sms - false
 * @property {boolean} email - true
 * @property {number} id_user - "1"

 */

/**
 * A notification
 * @typedef {object} Notification
 * @property {string} zone - "Lille"
 * @property {string} vertical_trade - "Market data"
 * @property {boolean} sms - false
 * @property {boolean} email - true
 * @property {number} id_user - "1"
 */

/**
 * GET /api/v0/notifications
 * @summary View all notifications
 * @tags notifications
 * @return {array<Notification>} 200 - Notifications list successfully retrieved
 * @return {object} 400 - Bad request
 * @security bearerAuth
 */

router.get('/', async (req, res, next) => {
  const { type } = req.query;
  try {
    // Gets all notifications preferences with their connected users.
    const notifications = await prisma.notification.findMany({
      where: {
        vertical_trade: type,
      },
      include: {
        user: true,
      },
    });
    // Returns a 200 'OK' HTTP code response + all infos JSON
    return res.status(200).json(notifications);
    // Returns a 400 'Bad Request' if any error occurs
  } catch (error) {
    res.status(400);
    // Triggers the error handling middleware
    return next(error);
  }
});

/**
 * GET /api/v0/notifications/{notifId}
 * @summary Get notification by ID
 * @tags notifications
 * @param {number} notifId.path - id of wanted notification
 * @return {array<DisplayNotification>} 200 - Notification successfully retrieved
 * @return {object} 404 - Notification not found
 * @security bearerAuth
 */
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    // Gets a unique notification preference with its connected users.
    const notification = await prisma.notification.findUnique({
      where: {
        id: parseInt(id, 10),
      },
      include: {
        user: true,
      },
    });
    if (!notification) {
      next();
    }

    return res.status(200).json(notification);
  } catch (error) {
    res.status(404);
    // Returns a 404 'Not Found' if any error occurs
    return next(error);
  }
});

/**
 * POST /api/v0/notifications/
 * @summary Create a notification
 * @tags notifications
 * @param {Notification} request.body.required - Notification info
 * @return {array<DisplayNotification>} 201 - Notification successfully created
 * @return {object} 422 - Bad data entries
 * @security bearerAuth
 */
router.post('/', joiValidation(valNotif), async (req, res, next) => {
  const { zone, vertical_trade, sms, email, id_user } = req.body;
  try {
    // Creates a notification preference with all infos infos provided by body
    const notification = await prisma.notification.create({
      data: {
        zone,
        vertical_trade,
        sms,
        email,

        user: { connect: { id: parseInt(id_user, 10) } },
      },
    });
    // Returns a 201 'Created' HTTP code response + all infos JSON
    return res.status(201).json(notification);
  } catch (error) {
    // Returns a 422 'Bad Request' if any error occurs in creation processus
    res.status(422);
    return next(error);
  }
});

/**
 * DELETE /api/v0/notifications/{notifId}
 * @summary Delete a notification
 * @tags notifications
 * @param {number} notifId.path.required - id of wanted notification
 * @return {object} 204 - Notification successfully deleted
 * @return {object} 404 - Notification not found
 * @security bearerAuth
 */
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    // Deletes a notification preference from database by its id
    await prisma.notification.delete({
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
});

/**
 * PUT /api/v0/notifications/{notifId}
 * @summary Update a notification
 * @tags notifications
 * @param {number} id.path - id of wanted notification
 * @param {Notification} request.body.required - Notification info
 * @return {array<DisplayNotification>} 200 - Notification successfully updated
 * @return {object} 404 - Notification not found
 * @return {object} 422 - Bad data entries
 * @security bearerAuth
 */

router.put('/:id', joiValidation(valNotif), async (req, res, next) => {
  const { id } = req.params;
  const { zone, vertical_trade, sms, email, id_user } = req.body;

  try {
    // Updates the id provided notification preference
    const updatedNotif = await prisma.notification.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        zone,
        vertical_trade,
        sms,
        email,

        user: { connect: { id: parseInt(id_user, 10) } },
      },
    });

    return res.status(200).json(updatedNotif);
  } catch (error) {
    res.status(404);

    return next(error);
  }
});
module.exports = router;
