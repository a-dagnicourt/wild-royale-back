const bcrypt = require('bcrypt');

// Hashes password with a 10 rounds salting
function hashPassword(plainTextPassword) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(plainTextPassword, salt);
  return hash;
}

// Compares provided password from request with the associated hashed one in database
function comparePassword(plainTextPassword, hashedPassword) {
  return bcrypt.compareSync(plainTextPassword, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePassword,
};
