const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lessonController");

///GENERAL///
//GET all lessons
router.get("/", lessonController.lesson_list);

//GET single lesson
router.get("/:id", lessonController.lesson_single);

/// AUTHORISED ///

//POST create a lesson
router.post("/", lessonController.lesson_create);

//PUT update lesson details
router.put("/:id", lessonController.lesson_update);

//DELETE remove a lesson
router.delete("/:id", lessonController.lesson_remove);

module.exports = router;
