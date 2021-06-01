//TODO Teacher id route permission
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const permission = require("../middleware/permission");
const authId = require("../middleware/authId");
const teacherController = require("../controllers/teacherController");

///GENERAL///

//GET recent teachers
router.get("/recent", auth, teacherController.teacher_recent);

//GET year leaders
router.get("/year-leaders", auth, teacherController.year_leaders);

//GET all teachers
router.get("/", auth, teacherController.teacher_list);

//GET single teacher
router.get("/:id", auth, teacherController.teacher_single);

/// AUTHORISED ///

//PUT update teacher details
router.put(
  "/:id",
  auth,
  permission(["teacher"]),
  authId(false),
  teacherController.teacher_update
);

//POST login as teacher

router.post("/login", teacherController.teacher_login);

///ADMIN///

//POST create a teacher
router.post("/", auth, permission(["admin"]), teacherController.teacher_create);

//DELETE remove a teacher
router.delete(
  "/:id",
  auth,
  permission(["teacher", "admin"]),
  authId(true),
  teacherController.teacher_remove
);

module.exports = router;
