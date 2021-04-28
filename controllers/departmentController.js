exports.department_list = (req, res) =>
  res.send("this is the department route");

exports.department_single = (req, res) =>
  res.send(`This is department with id ${req.params.id}`);

exports.department_create = (req, res) => res.send("New department enrolled");

exports.department_update = (req, res) =>
  res.send(`department with id ${req.params.id} updated`);

exports.department_remove = (req, res) =>
  res.send(`department with id ${req.params.id} removed`);
