const { YearGroup, validateYearGroup } = require("../models/yearGroup");
const { User } = require("../models/user");
const Helper = require("./controllerHelperFunctions");
/// FIXME Obj id can be added even if its a reference to the wrong document

exports.yearGroup_list = async (req, res) => {
  try {
    const all = await YearGroup.find().sort("year_group");
    res.json(all);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.yearGroup_single = async (req, res) => {
  try {
    const single = await YearGroup.findById({ _id: req.params.id });
    res.json(single);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.yearGroup_create = async (req, res) => {
  let { error } = validateYearGroup(req.body);
  if (error) return res.status(400).json(error);
  const yearGroup = new YearGroup({
    year_group: req.body.year_group,
    year_leader: req.body.year_leader,
    students: [],
  });
  try {
    // Check if yeargroup or yearleader exist
    const yearGroupExists = await Helper.inDatabase(
      YearGroup,
      "year_group",
      req.body.year_group
    );
    if (yearGroupExists) {
      return res
        .status(409)
        .json({ message: "This year group already exists" });
    }
    const yearLeaderExists = await Helper.inDatabase(
      YearGroup,
      "year_leader",
      req.body.year_leader
    );
    if (yearLeaderExists) {
      const temp = await Teacher.findById(req.body.year_leader);
      return res.status(409).json({
        message: `${temp.name} is already a year head`,
      });
    }

    //Cheack if students are in another yeargroup
    if (req.body.students && req.body.students.length > 0) {
      let obj = await Helper.studentsInYearGroup(req.body.students, YearGroup);
      if (obj.err) return res.status(400).json({ message: obj.message });
      obj.students.forEach((student) => yearGroup.students.push(student));
    }
    const saved = await yearGroup.save();
    return res.json(saved);
  } catch (err) {
    res.status(400).json({ message: `${err}` });
  }
};

exports.yearGroup_update = async (req, res) => {
  //validate
  let { error } = validateYearGroup(req.body);
  if (error) return res.status(400).json(error);
  try {
    // Check if another user has email or username
    const exists = await YearGroup.findOne({
      _id: { $ne: req.params.id },
      year_group: req.body.year_group,
    });
    if (exists)
      return res.status(409).json({ message: "Yeargroup already exists." });

    //update
    const update = await YearGroup.updateOne(
      { _id: req.params.id },
      {
        $set: {
          year_leader: req.body.year_leader,
          students: req.body.students,
        },
      }
    );
    res.json(update);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.yearGroup_remove = async (req, res) => {
  try {
    const removed = await YearGroup.deleteOne({ _id: req.params.id });
    res.json({ removed: removed, message: "Year group removed" });
  } catch (err) {
    res.status(400).json({ message: `${err}` });
  }
};
