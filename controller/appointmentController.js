const firebase = require("../firebase");

const jwt = require("jsonwebtoken");
const { google } = require("googleapis"); //s
const db = firebase.firestore;
const {
  collection,
  query,
  where,
  getDocs,
  doc,
  limit,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc
} = require("firebase/firestore");

const gCalendar = require("../middleware/googleCalendar");
const commonFunc = require("../middleware/commonFunctions");

module.exports = {
  // CLIENT
  processGoogleLogin: async (req, res) => {
    const code = req.query.code;

    if (req.query.error) {
      return res.redirect("/");
    }

    const tokens = await gCalendar.getToken(code);

    // const userData = await gCalendar.getUserDetail(tokens);

    // console.log(userData.data.email);

    return res
      .cookie("google_token", jwt.sign(tokens, process.env.JWT_KEY))
      .redirect("/appointment/new/form1");
  },

  viewSelectDateService: (req, res) => {
    const servicesData = req.servicesData;

    return res.render("client/form1", {
      servicesData: servicesData
    });
  },

  viewAppointmentFormUser2: async (req, res) => {
    const date = req.query.date;
    const serviceId = req.query.serviceId;

    const serviceData = await commonFunc.getAServiceData(serviceId);

    const sessionsData = req.sessionsData;

    return res.render("client/reservasi", {
      sessionsData: sessionsData,
      date: date,
      serviceId: serviceId,
      serviceData: serviceData
    });
  },

  createAppointment: async (req, res) => {
    const name = req.body.input_name;
    const time = req.body.input_time;
    const date = req.body.input_date;
    const serviceId = req.body.input_serviceId;

    let ig = "";
    if (req.body.nama_ig != null) {
      ig = req.body.nama_ig;
    }

    const appointmentData = {
      name: name,
      status: false,
      time: time,
      dateOfBirth: req.body.input_dob,
      date: date,
      serviceId: serviceId,
      numWa: req.body.no_hp,
      igAccount: ig
    };

    try {
      const tokens = req.tokens;

      const oauth2Client = gCalendar.getOAuth2Client(tokens);

      const dateClass = new Date(date + "T" + time + ":00");
      dateClass.setTime(dateClass.getTime() + 30 * 60000);

      let hours = dateClass.getHours();
      if (hours < 10) {
        hours = "0" + hours;
      }

      const serviceData = await commonFunc.getAServiceData(serviceId);

      const calendar = google.calendar("v3");
      let response = await calendar.events.insert({
        auth: oauth2Client,
        calendarId: "primary",
        requestBody: {
          summary: "Reservasi Layanan Rumah Sayang Bunda",
          description:
            "Reservasi layanan " +
            serviceData.data.name +
            " atas nama " +
            name +
            " pada " +
            date +
            " pukul " +
            time,
          location:
            "Rumah Sayang Bunda, Perum Plandi Permai Blok F2, Plandi, Kec. Jombang, Kabupaten Jombang, Jawa Timur 61411, Indonesia",
          colorId: "7",
          start: {
            dateTime: date + "T" + time + ":00",
            timeZone: "Asia/Jakarta"
          },
          end: {
            dateTime: date + "T" + hours + ":" + dateClass.getMinutes() + ":00",
            timeZone: "Asia/Jakarta"
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: "popup", minutes: 60 },
              { method: "popup", minutes: 30 }
            ]
          }
        }
      });
      if (response) {
        const appRef = await addDoc(
          collection(db, "appointments"),
          appointmentData
        );
        if (appRef) {
          return res.redirect("/appointment/success/" + appRef.id);
        } else {
          console.log(appRef);
          return res.redirect("/");
        }
      } else {
        console.log("Login Gagal");
        return res.redirect("/");
      }
    } catch (error) {
      console.log(error);
      return res.redirect("/");
    }
  },

  viewSuccessPage: async (req, res) => {
    const appointmentId = req.params.appId; //req.params.appId;

    const appointmentRef = doc(db, "appointments", appointmentId);
    const appointmentSnap = await getDoc(appointmentRef);

    if (!appointmentSnap.exists()) {
      return console.log("No such document!");
    }

    const appointmentData = appointmentSnap.data();

    const serviceData = await commonFunc.getAServiceData(
      appointmentData.serviceId
    );

    return res.render("client/reservasiSuccess", {
      appointmentData: appointmentData,
      serviceData: serviceData
    });
  },

  cancelAppointment: async (req, res) => {
    const appointmentId = req.params.appId;

    const appointmentData = doc(db, "appointments", appointmentId);

    await updateDoc(appointmentData, {
      status: "cancelled"
    })
      .then(() => {
        return res.status(200).redirect("/");
      })
      .catch((error) => {
        return console.log(error);
      });
  },

  // ADMIN
  viewAppointments: async (req, res) => {
    const appointmentsData = req.appointmentsData;
    const servicesData = req.servicesData;

    console.log(appointmentsData);

    return res.render("admin/viewNextReservasi", {
      appointmentsData: appointmentsData,
      servicesData: servicesData
    });
  },

  viewEditAppointment: async (req, res) => {
    const appointmentData = req.appointmentData;
    const servicesData = req.servicesData;
    if (req.sessionsData == null) {
      return res.render("admin/viewEditReservasi", {
        appointmentData: appointmentData,
        servicesData: servicesData
      });
    } else {
      const date = req.query.date;
      const serviceId = req.query.serviceId;
      const serviceData = await commonFunc.getAServiceData(serviceId);

      const sessionsData = req.sessionsData;

      return res.render("admin/viewEditReservasi", {
        sessionsData: sessionsData,
        servicesData: servicesData,
        serviceData: serviceData,
        appointmentData: appointmentData,
        date: date,
        serviceId: serviceId
      });
    }
  },

  editAppointment: async (req, res) => {
    const appointmentId = req.params.appId;
    const serviceId = req.body.serviceId;
    const time = req.body.time;
    const date = req.body.date;

    const appointmentData = doc(db, "appointments", appointmentId);

    await updateDoc(appointmentData, {
      time: time,
      date: date,
      serviceId: serviceId
    })
      .then(() => {
        return res.status(200).redirect("/admin/appointment");
      })
      .catch((error) => {
        return console.log(error);
      });
  },

  cancelAppointmentAsAdmin: async (req, res) => {
    const appointmentId = req.params.appId;

    const appointmentData = doc(db, "appointments", appointmentId);

    await updateDoc(appointmentData, {
      status: "cancelled"
    })
      .then(() => {
        return res.status(200).redirect("/admin");
      })
      .catch((error) => {
        return console.log(error);
      });
  },

  // API
  getAllDataAPI: (req, res) => {
    const appointmentsData = req.appointmentsData;
    const servicesData = req.servicesData;

    return res.json({
      success: true,
      appointmentsData: appointmentsData,
      servicesData: servicesData
    });
  },

  getAppointmentsAPI: async (req, res) => {
    const appointmentsData = req.appointmentsData;

    return res.json({
      success: true,
      appointmentsData: appointmentsData
    });
  },

  getSessionsAPI: async (req, res) => {
    const serviceId = req.query.serviceId;
    const sessionsData = req.sessionsData;

    const serviceData = commonFunc.getAServiceData(serviceId);

    return res.json({
      success: true,
      sessionsData: sessionsData,
      serviceData: serviceData
    });
  },

  getAnAppointmentAPI: (req, res) => {
    const appointmentsData = req.appointmentsData;
    const appointmentId = req.params.appId;

    appointmentsData.forEach((appointmentData) => {
      if (appointmentData.id == appointmentId) {
        return res.json({
          success: true,
          appointmentData: appointmentData
        });
      }
    });
  },

  editAppointmentAPI: async (req, res) => {
    const appointmentId = req.params.appId;
    const updatedData = req.body;

    const appointmentData = doc(db, "appointments", appointmentId);

    await updateDoc(appointmentData, updatedData)
      .then(() => {
        return res.json({
          success: true,
          message: "Update data success"
        });
      })
      .catch((error) => {
        console.log(error)
        return res.status(500)
      });
  },

  cancelAppointmentAsAdminAPI: async (req, res) => {
    const appointmentId = req.params.appId;

    const appointmentData = doc(db, "appointments", appointmentId);

    await updateDoc(appointmentData, {
      status: "cancelled"
    })
      .then(() => {
        return res.json({
          success: true,
          message: "Cancel appointment success"
        });
      })
      .catch((error) => {
        console.log(error)
        return res.status(500)
      });
  }
};
