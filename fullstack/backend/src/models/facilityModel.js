const { getCollection, updateCollection } = require("../data/store");

function findAll() {
  return getCollection("facilities");
}

function findById(id) {
  return findAll().find((facility) => facility.id === id);
}

function create(facility) {
  updateCollection("facilities", (current) => [facility, ...current]);
  return facility;
}

function update(id, payload) {
  const current = findById(id);
  if (!current) return null;
  const updated = { ...current, ...payload, id: current.id };
  updateCollection("facilities", (items) => items.map((item) => (item.id === id ? updated : item)));
  return updated;
}

function remove(id) {
  const current = findById(id);
  if (!current) return null;
  updateCollection("facilities", (items) => items.filter((item) => item.id !== id));
  return current;
}

module.exports = {
  create,
  findAll,
  findById,
  remove,
  update,
};
