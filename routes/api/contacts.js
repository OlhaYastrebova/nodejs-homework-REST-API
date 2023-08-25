const express = require("express");

const ctrl = require("../../controllers/contacts");
const {schemas}  = require("../../models/contact");
const {
  validateBody,
  isValidId,
  checkBody,
  } = require('../../middlewares');
  
const router = express.Router();

router.get("/", ctrl.listContacts);

router.get("/:contactId", isValidId, ctrl.getById);

router.delete("/:contactId", isValidId, ctrl.removeContact);

router.post("/", checkBody, validateBody(schemas.addSchema), ctrl.addContact);

router.put(
  "/:contactId", checkBody, isValidId, 
  validateBody(schemas.addSchema),
  ctrl.updateContact
);

router.patch(
  "/:contactId/favorite", isValidId,
  validateBody (schemas.updFavoriteSchema), 
  ctrl.updateFavorite
);

module.exports = router;