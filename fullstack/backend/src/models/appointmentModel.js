const { getCollection, updateCollection } = require("../data/store");

function findAll() {
  return getCollection("appointments");
}

function findById(id) {
  return findAll().find((appointment) => appointment.id === id);
}

function create(appointment) {
  updateCollection("appointments", (current) => [appointment, ...current]);
  return appointment;
}

function update(id, payload) {
  const appointments = findAll();
  const current = appointments.find((item) => item.id === id);
  if (!current) return null;
  const updated = { ...current, ...payload };
  updateCollection("appointments", (items) => items.map((item) => (item.id === id ? updated : item)));
  return updated;
}

function remove(id) {
  const appointments = findAll();
  const current = appointments.find((item) => item.id === id);
  if (!current) return null;
  updateCollection("appointments", (items) => items.filter((item) => item.id !== id));
  return current;
}

module.exports = {
  create,
  findById,
  findAll,
  remove,
  update,
};
