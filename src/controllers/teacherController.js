//TODO Look at how you are sending/setting access tokens. Especially when you update. Maybe should be sent seperatly and not validated in joi.
//TODO Maybe in the auth middleware you can check the header and then req.body.account.access = token.
const {
  User: Teacher,
  validateUser,
  validateAccount,
} = require("../models/user");
const { Department } = require("../models/department");
const { YearGroup } = require("../models/yearGroup");
const bcrypt = require("bcrypt");
const Helper = require("./controllerHelperFunctions");
const jwt = require("jsonwebtoken");

//TODO Return if teacher is department head

exports.teacher_list = async (req, res) => {
  try {
    let teachers = await Teacher.find({ "account.access": "teacher" }).sort({
      "details.family_name": 1,
    });
    let tempArr = [];
    for await (teacher of teachers) {
      let department = await Department.find({ teachers: teacher._id }).select(
        "name"
      );
      const tempObj = {
        details: {
          ...teacher.details.toObject(),
          department:
            department.length > 0 ? department[0].name : "No Department",
          fullname: teacher.fullname,
        },
        account: {
          enrolled: teacher.account.enrolled,
        },
        id: teacher._id,
      };
      tempArr.push(tempObj);
    }

    res.json(tempArr);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
//TODO Change the object to match teacher list
exports.teacher_single = async (req, res) => {
  try {
    let department = await Department.find({
      teachers: `${req.params.id}`,
    });
    let teacher = await Teacher.findById(req.params.id);
    const tempObj = {
      details: {
        ...teacher.details.toObject(),
        department:
          department.length > 0 ? department[0].name : "No Department",
        fullname: teacher.fullname,
      },
      account: {
        enrolled: teacher.account.enrolled,
      },
      id: teacher._id,
    };
    res.json(tempObj);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.year_leaders = async (req, res) => {
  try {
    console.log("i went off");
    let year_leaders = await YearGroup.find()
      .select("year_leader year_group")
      .populate("year_leader");
    //.populate("year_leader");

    //select: "_id details",
    //select: "_id details.first_name details.family_name",
    res.json(year_leaders);
  } catch (err) {
    res.status(400).json({ message: "Resource not found" });
  }
};

exports.teacher_recent = async (req, res) => {
  try {
    let recent = await Teacher.find({ "account.access": "teacher" })
      .sort({ "account.enrollment": -1 })
      .limit(5);
    res.json(recent);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.teacher_create = async (req, res) => {
  //validate
  //let { error } = validateUser(req.body.teacher);
  //if (error) return res.status(400).json(error);

  //check account info is unique
  const user = await Teacher.findOne({
    $or: [
      { "details.email": req.body.teacher.details.email },
      { "account.username": req.body.teacher.account.username },
    ],
  });
  if (user) return res.status(409).send("This user already exists");
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(
    req.body.teacher.account.password,
    salt
  );
  const teacher = new Teacher({
    details: {
      first_name: req.body.teacher.details.first_name,
      family_name: req.body.teacher.details.family_name,
      email: req.body.teacher.details.email,
      phone: req.body.teacher.details.phone,
      age: req.body.teacher.details.age,
    },
    account: {
      username: req.body.teacher.account.username,
      access: req.body.teacher.account.access,
      password: hashedPassword,
    },
  });
  try {
    if (req.body.department) {
      await Department.findByIdAndUpdate(
        { _id: req.body.department },
        { $push: { teachers: teacher._id } }
      );
    }
    const saved = await teacher.save();
    return res.json(saved);
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

exports.teacher_login = async (req, res) => {
  //Validate login details
  const { error } = validateAccount(req.body);
  if (error) return res.status(400).json({ message: "Invalid Inputs" });
  try {
    //Check user exists
    const user = await Teacher.findOne({
      "account.username": req.body.username,
    });
    if (!user) return res.status(400).json({ message: "User does not exist" });
    //Check password
    const validPass = await bcrypt.compare(
      req.body.password,
      user.account.password
    );
    if (!validPass)
      return res.status(400).json({ message: "Invalid password" });
    const token = jwt.sign(
      { _id: user._id, access: user.account.access },
      process.env.TOKEN_SECERET
    );

    //Return user
    res
      .status(200)
      .header("auth-token", token)
      .json({ user: token, message: "Log in success" });
  } catch (err) {
    res.status(400).json({ message: `${err}` });
  }
};

exports.teacher_update = async (req, res) => {
  let { error } = validateUser(req.body);
  if (error) return res.status(400).json({ message: error });
  try {
    // Check if another user has email or username
    const exists = await Teacher.findOne({
      _id: { $ne: req.params.id },
      $or: [
        { "details.email": req.body.details.email },
        { "account.username": req.body.account.username },
      ],
    });
    if (exists)
      return res
        .status(409)
        .json({ message: "Email or Username already taken" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.account.password, salt);
    const update = await Teacher.updateOne(
      { _id: req.params.id },
      {
        $set: {
          details: {
            first_name: req.body.details.first_name,
            family_name: req.body.details.family_name,
            email: req.body.details.email,
            phone: req.body.details.phone,
            age: req.body.details.age,
          },
          account: {
            username: req.body.account.username,
            access: req.body.account.access,
            password: hashedPassword,
          },
        },
      }
    );
    res.json(update);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.teacher_remove = async (req, res) => {
  try {
    const removed = await Teacher.deleteOne({ _id: req.params.id });
    res.json({ removed: removed, message: "Teacher removed" });
  } catch (err) {
    res.status(400).send({ message: err });
  }
};
