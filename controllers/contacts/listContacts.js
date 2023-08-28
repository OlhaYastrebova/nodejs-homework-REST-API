const { Contact } = require("../../models");

const listContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const searchParams = { owner };

  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  if (favorite === 'true') {
    searchParams.favorite = true;
  }

  const result = await Contact.find(searchParams, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email");
  res.json(result);
};

module.exports = listContacts;