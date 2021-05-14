const { YearGroup, validateYearGroup } = require("../models/yearGroup");
const { Teacher } = require("../models/teacher");
const Helper = require("./controllerHelperFunctions");
/// FIXME Obj id can be added even if its a reference to the wrong document

exports.yearGroup_list = async (req, res) => {
  try {
    const all = await YearGroup.find();
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
    const yearLeaderExists = await Helper.inDatabase(
      YearGroup,
      "year_leader",
      req.body.year_leader
    );

    //Cheack if students are in another yeargroup
    if (req.body.students && req.body.students.length > 0) {
      let obj = await Helper.studentsInYearGroup(req.body.students, YearGroup);
      if (obj.err) return res.status(400).json({ message: obj.message });
      obj.students.forEach((student) => yearGroup.students.push(student));
    }

    if (!yearGroupExists && !yearLeaderExists) {
      const saved = await yearGroup.save();
      return res.json(saved);
    }
    if (yearGroupExists) {
      return res
        .status(409)
        .json({ message: "This year group already exists" });
    }
    if (yearLeaderExists) {
      const temp = await Teacher.findById(req.body.year_leader);
      return res.status(409).json({
        message: `${temp.name} is already a year head`,
      });
    }
    return res.status(400).json({ message: "Unexpected error" });
  } catch (err) {
    res.status(400).json({ message: `${err}` });
  }
};

exports.yearGroup_update = async (req, res) => {
  try {
    //Make copy of previous year
    const prev = await YearGroup.findOne({ _id: req.params.id });
    const temp = {
      year_leader: prev.year_leader,
      students: prev.students,
    };
    //set year leader
    if (req.body.year_leader) {
      temp.year_leader = req.body.year_leader;
    }

    //check if students are in another yeargroup
    if (req.body.students.length > 0) {
      let obj = await Helper.studentsInYearGroup(req.body.students, YearGroup);
      if (obj.err) return res.status(400).json({ message: obj.message });
      obj.students.forEach((student) => temp.students.push(student));
    }
    //validate
    let { error } = validateYearGroup(temp);
    if (error) return res.status(400).json(error);
    //update
    const update = await YearGroup.updateOne(
      { _id: req.params.id },
      {
        $set: {
          year_leader: temp.year_leader,
          students: temp.students,
        },
      }
    );
    res.json(update);
  } catch (err) {
    res.status(400).json({ message: `${err}` });
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