const express = require('express');

const users = require('./users');
const roles = require('./roles');
const companies = require('./companies');
const notifications = require('./notifications');
const products = require('./products');
const auth = require('./auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌎',
  });
});

router.use('/users', users);
router.use('/roles', roles);
router.use('/companies', companies);
router.use('/notifications', notifications);
router.use('/products', products);
router.use('/auth', auth);

module.exports = router;
