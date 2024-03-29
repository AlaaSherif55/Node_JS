const jwt = require('jsonwebtoken');
const CustomError = require('../lib/customError');

const secretKey = process.env.key || 'sdsdsdsdsds';

const validateUser = (req, res, next) => {
  try {
    const adminId = process.env.admin;
    const token = req.get('authorization');
    const verified = jwt.verify(token, secretKey);
    // bonus
    if (adminId === verified.id) {
      req.isAdmin = true;
    }
    if (verified) {
      // eslint-disable-next-line no-underscore-dangle
      req.user = verified.id;
      return next();
    }
    throw new CustomError('UNAUTHORIZED', 403);
  } catch (error) {
    throw new CustomError('Invalid token', 403);
  }
};
module.exports = {
  validateUser,
};
