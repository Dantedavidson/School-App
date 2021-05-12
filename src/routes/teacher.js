const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");

///GENERAL///
//GET all teachers
router.get("/", teacherController.teacher_list);

//GET single teacher
router.get("/:id", teacherController.teacher_single);

/// AUTHORISED ///

//PUT update teacher details
router.put("/:id", teacherController.teacher_update);

//POST login as teacher

router.post("/login", teacherController.teacher_login);

///ADMIN///

//POST create a teacher
router.post("/", teacherController.teacher_create);

//DELETE remove a teacher
router.delete("/:id", teacherController.teacher_remove);

module.exports = router;
