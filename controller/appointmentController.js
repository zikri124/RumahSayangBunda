const firebase = require("../firebase");

const jwt = require("jsonwebtoken");
const {
  google
} = require("googleapis");
const db = firebase.firestore;
const {
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  Timestamp
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
    const serviceCare = req.query.serviceCare;
    const sessions = req.response.sessions;

    const serviceData = await commonFunc.getAServiceData(serviceId);

    const temp = req.sessionsData;
    const sessionsDataTemp = []
    const onGoingVisits = req.onGoingVisits

    temp.forEach((sessionData) => {
      let status = sessionData.data.status 
      if (status == false) {
        sessionsDataTemp.push(sessionData)
      }
    })

    const sessionsData = sessionsDataTemp.concat(onGoingVisits)

    console.log(sessionsData)
    console.log(sessions)

    return res.render("client/reservasi", {
      sessionsData: sessionsData,
      date: date,
      serviceId: serviceId,
      serviceData: serviceData,
      serviceCare: serviceCare,
      sessions: sessions
    });
  },

  createAppointment: async (req, res) => {
    const timestamp = Timestamp.now()
    const name = req.body.input_name
    const time = req.body.input_time
    const date = req.body.input_date
    const serviceId = req.body.input_serviceId
    const serviceCare = req.body.serviceCare
    const address = req.body.input_address

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
      igAccount: req.body.nama_ig,
      serviceCare: serviceCare,
      address: address,
      createdAt: timestamp,
      serviceName: req.body.serviceName
    };

    let location

    if (address != "-") {
      location = address
    } else {
      location = "Rumah Sayang Bunda, Perum Plandi Permai Blok F2, Plandi, Kec. Jombang, Kabupaten Jombang, Jawa Timur 61411, Indonesia"
    }

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
          description: "Reservasi layanan " +
            serviceData.data.name +
            " atas nama " +
            name +
            " pada " +
            date +
            " pukul " +
            time,
          location: location,
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
            overrides: [{
                method: "popup",
                minutes: 60
              },
              {
                method: "popup",
                minutes: 30
              }
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
    const appointmentId = req.params.appId;

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
    const timestamp = Timestamp.now()

    const appointmentData = doc(db, "appointments", appointmentId);

    await updateDoc(appointmentData, {
        status: "cancelled",
        updatedAt: timestamp
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
        serviceId: serviceId,
      });
    }
  },

  editAppointment: async (req, res) => {
    const appointmentId = req.params.appId;
    const serviceId = req.body.serviceId;
    const time = req.body.time;
    const date = req.body.date;
    const timestamp = Timestamp.now()

    const appointmentData = doc(db, "appointments", appointmentId);

    await updateDoc(appointmentData, {
        time: time,
        date: date,
        serviceId: serviceId,
        updatedAt: timestamp
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
    const timestamp = Timestamp.now()

    const appointmentData = doc(db, "appointments", appointmentId);

    await updateDoc(appointmentData, {
        status: "cancelled",
        updatedAt: timestamp
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
    const sessionsData = req.sessionsData;

    return res.json({
      success: true,
      sessionsData: sessionsData
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
    const timestamp = Timestamp.now()

    const appointmentData = doc(db, "appointments", appointmentId);

    await updateDoc(appointmentData, updatedData)
      .then(() => {
        return res.json({
          success: true,
          message: "Update data success",
          updatedAt: timestamp
        });
      })
      .catch((error) => {
        console.log(error)
        return res.json({
          success: false,
          message: error
        });
      });
  },

  cancelAppointmentAsAdminAPI: async (req, res) => {
    const appointmentId = req.params.appId;
    const timestamp = Timestamp.now()

    const appointmentData = doc(db, "appointments", appointmentId);

    await updateDoc(appointmentData, {
        status: "cancelled",
        updatedAt: timestamp
      })
      .then(() => {
        return res.json({
          success: true,
          message: "Cancel appointment success"
        });
      })
      .catch((error) => {
        console.log(error)
        return res.json({
          success: false,
          message: error
        });
      });
  },

  getSessionsNTimeAPI: (req, res) => {
    const sessionsData = req.sessionsData;
    const sessions = req.response.sessions;

    return res.json({
      sessionsData: sessionsData,
      sessions: sessions
    });
  },

  getSessionsTimeAPI: (req, res) => {
    const response = req.response

    return res.json({
      response: response
    });
  }
}
