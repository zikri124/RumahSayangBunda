const express = require("express");
const router = express.Router();
const { getGTokens } = require("../middleware");

const queryDb = require("../middleware/query");
const pageController = require("../controller/pageController");
const appointmentController = require("../controller/appointmentController");

router.get("/", queryDb.getServicesData, pageController.viewUserLandingPage);

router.get("/oauthcallback", appointmentController.processGoogleLogin);

router.get("/privacy", pageController.viewPrivacyPolicyPage);

router.get(
  "/appointment/new/form1",
  // getGTokens,
  queryDb.getServicesData,
  appointmentController.viewSelectDateService
);

router.get("/appointment/new/form2", queryDb.getOnGoingVisit, queryDb.getAppointmentsDataByDate, queryDb.getSessions, appointmentController.viewAppointmentFormUser2);

router.post(
  "/appointment/new/form2",
  // getGTokens,
  appointmentController.createAppointment
);

router.get("/appointment/success/:appId", appointmentController.viewSuccessPage);

router.post("/appointment/cancel/:appId", appointmentController.cancelAppointment);

module.exports = router;
