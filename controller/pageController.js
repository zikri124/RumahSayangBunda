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