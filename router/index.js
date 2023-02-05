const express = require("express");
const router = express.Router();

const { checkAuth, checkToken } = require("../middleware");

const clientRouter = require("./clientRouter");
const authRouter = require("./authRouter");
const adminRouter = require("./adminRouter");
const apiRouter = require("./apiRouter");

router.use("/", authRouter);

router.use("/", clientRouter);

router.use("/admin", checkAuth, adminRouter);

router.use("/api", checkToken, apiRouter);

module.exports = router;
