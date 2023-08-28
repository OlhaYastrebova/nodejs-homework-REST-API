const express = require('express');

const ctrl = require('../../controllers/auth');

const {
    validateBody,
    checkBody,
    authenticate,
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

  router.get('/current', authenticate, ctrl.current);

  router.post('/logout', authenticate, ctrl.logout);

  router.patch(
    "/",
    authenticate,
    validateBody(schemas.updSubscriptionSchema),
    ctrl.updateSubscription
  );

  module.exports = router;