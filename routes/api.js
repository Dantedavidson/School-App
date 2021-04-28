const express = require("express");
const router = express.Router();

//Controllers
const studentController = require("../controllers/studentController");
const teacherController = require("../controllers/teacherController");
const departmentController = require("../controllers/departmentController");
const lessonController = require("../controllers/lessonController");
const yearGroupController = require("../controllers/yearGroupController");

/// STUDENT ROUTES ///

//GET all students
router.get("/students", studentController.student_list);

//GET single student
router.get("/students/:id", studentController.student_single);

//POST create a student
router.post("/students", studentController.student_create);

//PUT update student details
router.put("/students/:id", studentController.student_update);

//DELETE remove a student
router.delete("/students/:id", studentController.student_remove);

/// TEACHER ROUTES ///

//GET all teachers
router.get("/teachers", teacherController.teacher_list);

//GET single teacher
router.get("/teachers/:id", teacherController.teacher_single);

//POST create a teacher
router.post("/teachers", teacherController.teacher_create);

//PUT update teacher details
router.put("/teachers/:id", teacherController.teacher_update);

//DELETE remove a teacher
router.delete("/teachers/:id", teacherController.teacher_remove);

/// DEPARTMENT ROUTES ///

//GET all departments
router.get("/departments", departmentController.department_list);

//GET single department
router.get("/departments/:id", departmentController.department_single);

//POST create a department
router.post("/departments", departmentController.department_create);

//PUT update department details
router.put("/departments/:id", departmentController.department_update);

//DELETE remove a department
router.delete("/departments/:id", departmentController.department_remove);

/// LESSON ROUTES ///

//GET all lessons
router.get("/lessons", lessonController.lesson_list);

//GET single lesson
router.get("/lessons/:id", lessonController.lesson_single);

//POST create a lesson
router.post("/lessons", lessonController.lesson_create);

//PUT update lesson details
router.put("/lessons/:id", lessonController.lesson_update);

//DELETE remove a lesson
router.delete("/lessons/:id", lessonController.lesson_remove);

/// YEARGROUP ROUTES ///

//GET all yeargroups
router.get("/yeargroups", yearGroupController.yearGroup_list);

//GET single yeargroup
router.get("/yeargroups/:id", yearGroupController.yearGroup_single);

//POST create a yeargroup
router.post("/yeargroups", yearGroupController.yearGroup_create);

//PUT update yeargroup details
router.put("/yeargroups/:id", yearGroupController.yearGroup_update);

//DELETE remove a yeargroup
router.delete("/yeargroups/:id", yearGroupController.yearGroup_remove);

module.exports = router;
