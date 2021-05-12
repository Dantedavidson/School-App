const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

/// AUTHORISED ///

//PUT update admin details
//router.put("/:id", adminController.admin_update);

//POST login as admin

router.post("/login", adminController.admin_login);

//POST create a admin
router.post("/", adminController.admin_create);

module.exports = router;
