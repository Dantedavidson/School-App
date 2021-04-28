exports.yearGroup_list = (req, res) => res.send("this is the year group route");

exports.yearGroup_single = (req, res) =>
  res.send(`This is year group with id ${req.params.id}`);

exports.yearGroup_create = (req, res) => res.send("New year group enrolled");

exports.yearGroup_update = (req, res) =>
  res.send(`Year group with id ${req.params.id} updated`);

exports.yearGroup_remove = (req, res) =>
  res.send(`Year group with id ${req.params.id} removed`);
