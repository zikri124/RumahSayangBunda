const express = require("express");
const router = express.Router();

const pageController = require("../controller/pageController");
const appointmentController = require("../controller/appointmentController");
const serviceController = require("../controller/serviceController");

const queryDb = require("../middleware/query");

router.get(
  "/",
  queryDb.getServicesData,
  queryDb.getAppointmentsDataToday,
  pageController.viewAdminDashboard
);

//-------------------------------------------------------------
// APPOINTMENT
router.get(
  "/appointment",
  queryDb.getAppointmentsData,
  queryDb.getServicesData,
  appointmentController.viewAppointments
);

router.get(
  "/appointment/:timeCode",
  queryDb.getAppointmentsDataByTime,
  queryDb.getServicesData,
  appointmentController.viewAppointments
);

router.get(
  "/appointment/update/:appId",
  queryDb.getAppointmentsDataByDate,
  queryDb.getAnAppointmentData,
  queryDb.getServicesData,
  appointmentController.viewEditAppointment
);

router.post(
  "/appointment/update/:appId",
  queryDb.getAnAppointmentData,
  appointmentController.editAppointment
);

router.post(
  "/appointment/cancel/:appId",
  appointmentController.cancelAppointmentAsAdmin
);

//-------------------------------------------------------------
// SERVICE
router.get("/service", queryDb.getServicesData, serviceController.viewServices);

router.post("/service/new", serviceController.addService);

router.post("/service/edit/:serviceId", serviceController.updateService);

router.post("/service/delete/:serviceId", serviceController.deleteService);

//-------------------------------------------------------------
// USER
// router.get("/user", queryDb.getUsersData, userController.viewUsers);

// router.post("/user/new", userController.addUser);

// router.post("/user/delete/:userId", userController.deleteUser);

module.exports = router;