const gCalendar = require("../middleware/googleCalendar");
const firebase = require("../firebase");
const db = firebase.firestore;
const {
  collection,
  query,
  where,
  getDocs,
  Timestamp
} = require("firebase/firestore");

const commonFunction = require("../middleware/commonFunctions")

module.exports = {
  viewUserLandingPage: (req, res) => {
    const link = gCalendar.getConnectionUrl();

    return res.render("client/home", {
      link: link
    });
  },

  viewAdminDashboard: async (req, res) => {
    const appointmentData = req.appointmentsData;
    const servicesData = req.servicesData;
    const queryData = []

    const currentDate = commonFunction.getCurrentDate()
    const date2 = Timestamp.now().toDate()
    date2.setDate(date2.getDate() - 14)

    let month = date2.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let date = date2.getDate();
    if (date < 10) {
      date = "0" + date;
    }

    const dateString2 = date2.getFullYear() + "-" + month + "-" + date;

    const appointmentsQuery = query(
      collection(db, "appointments"),
      where("date", "<=", currentDate.string),
      where("date", ">", dateString2)
    );

    await getDocs(appointmentsQuery)
      .then((querySnapshot) => {
        let dateTemp = ""
        let totalAppointment = 0
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          if (dateTemp != "") {
            if (dateTemp == data.date) {
              totalAppointment += 1
            } else {
              const appointmentDateData = {
                totalAppointment: totalAppointment,
                date: dateTemp
              }
              queryData.push(appointmentDateData)
              if (data.total != undefined) {
                totalSumTemp = data.total
              } else {
                totalSumTemp = 0
              }
              dateTemp = data.date
              totalAppointment = 1
            }
          } else {
            dateTemp = data.date
            if (data.total != undefined) {
              totalSumTemp += data.total
            }
            totalAppointment += 1
          }
        });

        const appointmentDateData = {
          totalAppointment: totalAppointment,
          date: dateTemp
        }
        queryData.push(appointmentDateData)
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(queryData)

    return res.render("admin/dashboard", {
      appointmentData: appointmentData,
      servicesData: servicesData,
      queryData: queryData
    });
  },

  viewPrivacyPolicyPage: (req, res) => {
    return res.render("client/privacyPolicy");
  },

  test: async (res) => {
    const output = process.env.google_private_key.replace(/\\n/gm, "\n");
    console.log(output);
    return;
  }
};