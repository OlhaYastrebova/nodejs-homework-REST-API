const express = require("express");

const ctrl = require("../../controllers/contacts");
const { validateBody } = require("../../middlewares/validateBody");
const { addSchema } = require("../../models/contact");
// const { isValidId } = require("../../middlewares/isValidId");

const router = express.Router();

router.get("/", ctrl.listContacts);

router.get("/:contactId", ctrl.getById);

router.delete("/:contactId", ctrl.removeContact);

router.post("/", validateBody(addSchema), ctrl.addContact);

router.put(
  "/:contactId",
  
  validateBody(addSchema),
  ctrl.updateContact
);

router.patch(
  "/:contactId/favorite",
  
  validateBody(addSchema),
  ctrl.updateFavorite
);

module.exports = router;