exports.student_list = (req, res) => res.send("this is the student route");

exports.student_single = (req, res) =>
  res.send(`This is student with id ${req.params.id}`);

exports.student_create = (req, res) => res.send("New student enrolled");

exports.student_update = (req, res) =>
  res.send(`Student with id ${req.params.id} updated`);

exports.student_remove = (req, res) =>
  res.send(`Student with id ${req.params.id} removed`);
