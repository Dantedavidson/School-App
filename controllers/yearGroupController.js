const YearGroup = require("../models/yearGroup");
const Teacher = require("../models/teacher");
const Helper = require("./controllerHelperFunctions");

exports.yearGroup_list = async (req, res) => {
  try {
    const all = await YearGroup.find();
    res.json(all);
  } catch (err) {
    res.json({ message: err });
  }
};

exports.yearGroup_single = async (req, res) => {
  try {
    const single = await YearGroup.findById({ _id: req.params.id });
    res.json(single);
  } catch (err) {
    res.json({ message: err });
  }
};

exports.yearGroup_create = async (req, res) => {
  const yearGroup = new YearGroup({
    year_group: req.body.year_group,
    year_leader: req.body.year_leader,
    students: req.body.students ? req.body.students : [],
  });
  try {
    const exists = await Helper.inDatabase(
      YearGroup,
      "year_group",
      req.body.year_group
    );
    const yearLeaderExists = await Helper.inDatabase(
      YearGroup,
      "year_leader",
      req.body.year_leader
    );
    if (!exists && !yearLeaderExists) {
      const saved = await yearGroup.save();
      return res.json(saved);
    }
    if (exists) {
      return res.json({ message: "This year group already exists" });
    }
    if (yearLeaderExists) {
      const temp = await Teacher.findById(req.body.year_leader);
      return res.json({
        message: `${temp.name} is already a year head`,
      });
    }
    return res.json({ message: "Unexpected error" });
  } catch (err) {
    res.json({ message: err });
  }
};

exports.yearGroup_update = async (req, res) =>
  res.send(`Year group with id ${req.params.id} updated`);

exports.yearGroup_remove = async (req, res) => {
  try {
    const removed = await YearGroup.remove({ _id: req.params.id });
    res.json({ removed: removed, message: "Year group removed" });
  } catch (err) {
    res.json({ message: err });
  }
};
