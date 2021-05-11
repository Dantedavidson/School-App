const express = require("express");
const router = express.Router();
const yearGroupController = require("../controllers/yearGroupController");

///GENERAL///
//GET all yeargroups
router.get("/", yearGroupController.yearGroup_list);

//GET single yeargroup
router.get("/:id", yearGroupController.yearGroup_single);

///ADMIN///
//POST create a yeargroup
router.post("/", yearGroupController.yearGroup_create);

//PUT update yeargroup details
router.put("/:id", yearGroupController.yearGroup_update);

//DELETE remove a yeargroup
router.delete("/:id", yearGroupController.yearGroup_remove);

module.exports = router;
