exports.lesson_list = (req, res) => res.send("this is the lesson route");

exports.lesson_single = (req, res) =>
  res.send(`This is lesson with id ${req.params.id}`);

exports.lesson_create = (req, res) => res.send("New lesson enrolled");

exports.lesson_update = (req, res) =>
  res.send(`lesson with id ${req.params.id} updated`);

exports.lesson_remove = (req, res) =>
  res.send(`lesson with id ${req.params.id} removed`);
