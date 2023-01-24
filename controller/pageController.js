const firebase = require("../firebase");
const db = firebase.firestore;
const {
  collection,
  query,
  where,
  getDocs,
  doc,
  limit,
  getDoc
} = require("firebase/firestore");

const gCalendar = require("../middleware/googleCalendar");

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

    // const dateClass = new Date();
    // let month = dateClass.getMonth() + 1;
    // if (month < 10) {
    //   month = "0" + month;
    // }
    // let date = dateClass.getDate();
    // if (date < 10) {
    //   date = "0" + date;
    // }

    // const dateNow = dateClass.getFullYear() + "-" + month + "-" + date;

    // const appointmentQuery = query(
    //   collection(db, "appointments"),
    //   where("date", "==", dateNow)
    // );

    // await getDocs(appointmentQuery)
    //   .then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       const appointment = {
    //         data: doc.data(),
    //         id: doc.id
    //       };
    //       appointmentData.push(appointment);
    //     });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // console.log({
    //   appointmentData: appointmentData,
    //   servicesData: servicesData,
    //   dateNow: dateNow
    // });

    return res.render("admin/dashboard", {
      appointmentData: appointmentData,
      servicesData: servicesData
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
