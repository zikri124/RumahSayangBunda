const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

// as admin
router.get("/admin/signin", authController.viewLoginAdmin);

router.post("/admin/signin", authController.processLoginAdmin);

router.get("/admin/signout", authController.processLogout);

// api
router.post("/api/signin", authController.processLoginAdminAPI);

router.get("/api/signout", authController.processLogoutAPI);

module.exports = router;
