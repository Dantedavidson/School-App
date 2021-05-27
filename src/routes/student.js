//TODO id protected routes
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const permission = require("../middleware/permission");
const studentController = require("../controllers/studentController");

///GENERAL///
//GET recent students
router.get(
  "/recent",
  auth,
  permission(["admin", "teacher"]),
  studentController.student_recent
);

//GET all students
router.get("/", auth, studentController.student_list);

//GET single student
router.get("/:id", auth, studentController.student_single);

//POST create a student
router.post("/", studentController.student_create);

/// AUTHORISED ///
//PUT update student details
router.put("/:id", studentController.student_update);

//POST login as student

router.post("/login", studentController.student_login);

///ADMIN///
//TODO authorise delete for student and admin
//DELETE remove a student
router.delete(
  "/:id",
  auth,
  permission(["student", "admin"]),
  studentController.student_remove
);

module.exports = router;
