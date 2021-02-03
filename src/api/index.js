const express = require('express');

const users = require('./users');
const pictures = require('./pictures');
const properties = require('./properties');
const families = require('./families');
const auth = require('./auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌎',
  });
});

router.use('/users', users);
router.use('/pictures', pictures);
router.use('/properties', properties);
router.use('/families', families);
router.use('/auth', auth);

module.exports = router;
