const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const permission = require("../middleware/permission");
const lessonController = require("../controllers/lessonController");

///GENERAL///
//GET all lessons
router.get("/", auth, lessonController.lesson_list);

//GET single lesson
router.get("/:id", auth, lessonController.lesson_single);

/// AUTHORISED ///

//TODO create middleware that allows all admins or teacher with relation to lesson(department?lesson teacher?) to edit

//POST create a lesson
router.post(
  "/",
  auth,
  permission(["admin", "teacher"]),
  lessonController.lesson_create
);

//PUT update lesson details
router.put(
  "/:id",
  auth,
  permission(["admin", "teacher"]),
  lessonController.lesson_update
);

//DELETE remove a lesson
router.delete(
  "/:id",
  auth,
  permission(["admin", "teacher"]),
  lessonController.lesson_remove
);

module.exports = router;
