//TODO Teacher id route permission
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const permission = require("../middleware/permission");
const teacherController = require("../controllers/teacherController");

///GENERAL///

//GET recent teachers
router.get("/recent", teacherController.teacher_recent);

//GET year leaders
router.get("/year-leaders", teacherController.year_leaders);

//GET all teachers
router.get("/", teacherController.teacher_list);

//GET single teacher
router.get("/:id", teacherController.teacher_single);

/// AUTHORISED ///

//PUT update teacher details
router.put(
  "/:id",
  auth,
  permission(["teacher", "admin"]),
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
  teacherController.teacher_remove
);

module.exports = router;
