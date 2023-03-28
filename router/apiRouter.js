const express = require("express");
const router = express.Router();
const appointmentController = require("../controller/appointmentController");
const serviceController = require("../controller/serviceController");

const queryDb = require("../middleware/query");

//appointment
router.get(
  "/alldata",
  queryDb.getAppointmentsData,
  queryDb.getServicesData,
  appointmentController.getAllDataAPI
);

router.get(
  "/appointment",
  queryDb.getAppointmentsData,
  appointmentController.getAppointmentsAPI
);

router.get(
  "/appointment/filter/:timeCode",
  queryDb.getAppointmentsDataByTime,
  queryDb.getServicesData,
  appointmentController.getAppointmentsAPI
);

router.get(
  "/appointment/session",
  queryDb.getAppointmentsDataByDate,
  appointmentController.getSessionsAPI
);

router.get(
  "/appointment/filter/today",
  queryDb.getServicesData,
  appointmentController.getAllDataAPI
);

router.get(
  "/appointment/:appId",
  queryDb.getAppointmentsData,
  appointmentController.getAnAppointmentAPI
);

router.put(
  "/appointment/update/:appId",
  appointmentController.editAppointmentAPI
);

router.put(
  "/appointment/cancel/:appId",
  appointmentController.cancelAppointmentAsAdminAPI
);

//service
router.get(
  "/service",
  queryDb.getServicesData,
  serviceController.getServicesAPI
);

router.get(
  "/service/:serviceId",
  queryDb.getAServiceData,
  serviceController.getAServiceAPI
);

router.post("/service/new", serviceController.createServiceAPI);

router.put("/service/edit/:serviceId", serviceController.updateServiceAPI);

router.delete("/service/delete/:serviceId", serviceController.deleteServiceAPI);

module.exports = router;
