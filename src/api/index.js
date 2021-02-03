const express = require('express');

const users = require('./users');
const roles = require('./roles');
const properties = require('./properties');
const notifications = require('./notifications');
const families = require('./families');
const auth = require('./auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌎',
  });
});

router.use('/users', users);
router.use('/roles', roles);
router.use('/properties', properties);
router.use('/notifications', notifications);
router.use('/families', families);
router.use('/auth', auth);

module.exports = router;
