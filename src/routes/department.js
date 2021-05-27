const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const permission = require("../middleware/permission");
const departmentController = require("../controllers/departmentController");

///GENERAL///
//GET all departments
router.get("/", auth, departmentController.department_list);

//GET single department
router.get("/:id", auth, departmentController.department_single);

///ADMIN///
//POST create a department
router.post(
  "/",
  auth,
  permission(["admin"]),
  departmentController.department_create
);

//PUT update department details
router.put(
  "/:id",
  auth,
  permission(["admin"]),
  departmentController.department_update
);

//DELETE remove a department
router.delete(
  "/:id",
  auth,
  permission(["admin"]),
  departmentController.department_remove
);

module.exports = router;
