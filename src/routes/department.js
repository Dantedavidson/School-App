const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");

///GENERAL///
//GET all departments
router.get("/", departmentController.department_list);

//GET single department
router.get("/:id", departmentController.department_single);

///ADMIN///
//POST create a department
router.post("/", departmentController.department_create);

//PUT update department details
router.put("/:id", departmentController.department_update);

//DELETE remove a department
router.delete("/:id", departmentController.department_remove);

module.exports = router;