const { getCollection, updateCollection } = require("../data/store");

function findAll() {
  return getCollection("doctors");
}

function findById(id) {
  return findAll().find((doctor) => doctor.id === id);
}

function create(doctor) {
  updateCollection("doctors", (current) => [doctor, ...current]);
  return doctor;
}

function update(id, payload) {
  const current = findById(id);
  if (!current) return null;
  const updated = { ...current, ...payload, id: current.id };
  updateCollection("doctors", (items) => items.map((item) => (item.id === id ? updated : item)));
  return updated;
}

function remove(id) {
  const current = findById(id);
  if (!current) return null;
  updateCollection("doctors", (items) => items.filter((item) => item.id !== id));
  return current;
}

module.exports = {
  create,
  findAll,
  findById,
  remove,
  update,
};
