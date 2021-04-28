exports.teacher_list = (req, res) => res.send("this is the teacher route");

exports.teacher_single = (req, res) =>
  res.send(`This is teacher with id ${req.params.id}`);

exports.teacher_create = (req, res) => res.send("New teacher enrolled");

exports.teacher_update = (req, res) =>
  res.send(`teacher with id ${req.params.id} updated`);

exports.teacher_remove = (req, res) =>
  res.send(`teacher with id ${req.params.id} removed`);
