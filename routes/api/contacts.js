const express = require("express");

const ctrl = require("../../controllers/contacts");
const {schemas}  = require("../../models/contact");
const {
  validateBody,
  isValidId,
  checkBody,
  authenticate,
  } = require('../../middlewares');
  
const router = express.Router();

router.get("/", authenticate, ctrl.listContacts);

router.get("/:contactId", authenticate, isValidId, ctrl.getById);

router.delete("/:contactId", authenticate, isValidId, ctrl.removeContact);

router.post("/", checkBody, authenticate, validateBody(schemas.addSchema), ctrl.addContact);

router.put(
  "/:contactId", authenticate, checkBody, isValidId, 
  validateBody(schemas.addSchema),
  ctrl.updateContact
);

router.patch(
  "/:contactId/favorite", authenticate, isValidId,
  validateBody (schemas.updFavoriteSchema), 
  ctrl.updateFavorite
);

module.exports = router;