const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

///GENERAL///
//GET all students
router.get("/", studentController.student_list);

//GET single student
router.get("/:id", studentController.student_single);

/// AUTHORISED ///
//POST create a student
router.post("/", studentController.student_create);

//PUT update student details
router.put("/:id", studentController.student_update);

///ADMIN///
//TODO authorise delete for student and admin
//DELETE remove a student
router.delete("/:id", studentController.student_remove);

module.exports = router;
