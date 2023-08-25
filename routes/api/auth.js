const express = require('express');

const ctrl = require('../../controllers/auth');

const {
    validateBody,
    checkBody,
    // authenticate,
    // upload,
  } = require('../../middlewares');
  
  const router = express.Router();
  
  const { schemas } = require('../../models/user');
  
  router.post(
    '/register',
    checkBody,
    validateBody(schemas.registerSchema),
    ctrl.register
  );
  router.post('/login', checkBody, validateBody(schemas.loginSchema), ctrl.login);



  module.exports = router;