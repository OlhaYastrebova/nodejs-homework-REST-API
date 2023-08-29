const isValidId = require("./isValidId");
const validateBody = require("./validateBody");
const checkBody = require('./checkBody');
const authenticate = require('./authenticate');
const upload = require("./upload");

module.exports = {
  isValidId,
  checkBody,
  validateBody,
  authenticate, 
  upload,
};