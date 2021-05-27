const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const permission = require("../middleware/permission");
const yearGroupController = require("../controllers/yearGroupController");

///GENERAL///
//GET all yeargroups
router.get("/", yearGroupController.yearGroup_list);

//GET single yeargroup
router.get("/:id", yearGroupController.yearGroup_single);

///ADMIN///
//POST create a yeargroup
router.post(
  "/",
  auth,
  permission(["admin"]),
  yearGroupController.yearGroup_create
);

//PUT update yeargroup details
router.put(
  "/:id",
  auth,
  permission(["admin"]),
  yearGroupController.yearGroup_update
);

//DELETE remove a yeargroup
router.delete(
  "/:id",
  auth,
  permission(["admin"]),
  yearGroupController.yearGroup_remove
);

module.exports = router;
