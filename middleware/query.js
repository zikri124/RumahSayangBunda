const firebase = require("../firebase");
const db = firebase.firestore;
const {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy
} = require("firebase/firestore");

module.exports = {
  getAnUserData: async (req, res, next) => {
    const userId = req.params.userId;

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      req.userData = [];
      console.log("No Document Found");
      next();
    }

    const user = {
      id: userSnap.id,
      data: userSnap.data()
    };

    req.userData = user;
    next();
  },

  getUsersData: async (req, res, next) => {
    const usersData = [];

    const userQuery = query(collection(db, "users"));
    await getDocs(userQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const user = {
            id: doc.id,
            data: doc.data()
          };
          usersData.push(user);
        });
        req.usersData = usersData;
        next();
      })
      .catch((error) => {
        return console.log(error);
      });
  },

  getAppointmentsData: async (req, res, next) => {
    const appointmentsData = [];

    const appointmentQuery = query(
      collection(db, "appointments"),
      orderBy("date"),
      orderBy("time")
    );
    await getDocs(appointmentQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const appointment = {
            id: doc.id,
            data: doc.data()
          };
          appointmentsData.push(appointment);
        });
        req.appointmentsData = appointmentsData;
        next();
      })
      .catch((error) => {
        return console.log(error);
      });
  },

  getAppointmentsDataByTime: async (req, res, next) => {
    const appointmentsData = [];
    const timeCode = req.params.timeCode;

    const dateClass = new Date();
    let month = dateClass.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let date = dateClass.getDate();
    if (date < 10) {
      date = "0" + date;
    }

    const dateNow = dateClass.getFullYear() + "-" + month + "-" + date;

    let code = "";

    if (timeCode == "past") {
      code = "<";
    } else if (timeCode == "soon") {
      code = ">=";
    }

    const appointmentQuery = query(
      collection(db, "appointments"),
      where("date", code, dateNow),
      orderBy("date"),
      orderBy("time")
    );

    await getDocs(appointmentQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const appointment = {
            id: doc.id,
            data: doc.data()
          };
          appointmentsData.push(appointment);
        });
        req.appointmentsData = appointmentsData;
        next();
      })
      .catch((error) => {
        return console.log(error);
      });
  },

  getAppointmentsDataToday: async (req, res, next) => {
    const appointmentsData = [];

    const dateClass = new Date();
    let month = dateClass.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let date = dateClass.getDate();
    if (date < 10) {
      date = "0" + date;
    }

    const dateNow = dateClass.getFullYear() + "-" + month + "-" + date;

    const appointmentQuery = query(
      collection(db, "appointments"),
      where("date", "==", dateNow)
    );

    await getDocs(appointmentQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const appointment = {
            data: doc.data(),
            id: doc.id
          };
          appointmentsData.push(appointment);
        });
        req.appointmentsData = appointmentsData;
        next();
      })
      .catch((error) => {
        console.log(error);
        return;
      });
  },

  getAppointmentsDataByDate: async (req, res, next) => {
    console.log(req.query);
    if (req.query.date == null || req.query.serviceId == null) {
      req.sessionsData = null;
      next();
    } else {
      const date = req.query.date;
      const serviceId = req.query.serviceId;

      const sessionsData = [];

      const appointmentQuery = query(
        collection(db, "appointments"),
        where("date", "==", date),
        where("serviceId", "==", serviceId)
      );

      await getDocs(appointmentQuery)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const session = {
              id: doc.id,
              data: doc.data()
            };
            sessionsData.push(session);
          });
          req.sessionsData = sessionsData;
          next();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },

  getAnAppointmentData: async (req, res, next) => {
    const appointmentId = req.params.appId;

    const appointmentRef = doc(db, "appointments", appointmentId);
    const appointmentSnap = await getDoc(appointmentRef);

    if (!appointmentSnap.exists()) {
      req.userData = [];
      console.log("No Document Found");
      next();
    }

    const appointment = {
      id: appointmentSnap.id,
      data: appointmentSnap.data()
    };

    req.appointmentData = appointment;
    next();
  },

  getServicesData: async (req, res, next) => {
    const servicesData = [];

    const serviceQuery = query(collection(db, "services"), orderBy("name"));
    await getDocs(serviceQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const service = {
            id: doc.id,
            data: doc.data()
          };
          servicesData.push(service);
        });
        req.servicesData = servicesData;
        next();
      })
      .catch((error) => {
        return console.log(error);
      });
  },

  getAServiceData: async (req, res, next) => {
    const serviceId = req.params.serviceId;

    const serviceRef = doc(db, "services", serviceId);
    const serviceSnap = await getDoc(serviceRef);

    if (!serviceSnap.exists()) {
      req.userData = [];
      console.log("No Document Found");
      next();
    }

    const service = {
      id: serviceSnap.id,
      data: serviceSnap.data()
    };

    req.serviceData = service;
    next();
  },

  getSessions: async (req, res, next) => {
    const sessions = [];

    const serviceQuery = query(collection(db, "sessions"), orderBy("time"));
    await getDocs(serviceQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const session = {
            id: doc.id,
            data: doc.data()
          };
          sessions.push(session);
        });
        req.sessions = sessions;
        next();
      })
      .catch((error) => {
        return console.log(error);
      });
  }
};