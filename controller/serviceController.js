const firebase = require("../firebase");
const db = firebase.firestore;
const {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc
} = require("firebase/firestore");

module.exports = {
  viewServices: (req, res) => {
    const servicesData = req.servicesData;

    return res.render("admin/viewServices", {
      servicesData: servicesData
    });
  },

  addService: async (req, res) => {
    const serviceData = {
      name: req.body.name,
      price: req.body.price,
      room: req.body.room,
      description: req.body.description
    };

    await addDoc(collection(db, "services"), serviceData)
      .then(async () => {
        return res.status(200).redirect("/admin/service");
      })
      .catch((error) => {
        console.log(error);
      });
  },

  updateService: async (req, res) => {
    const serviceId = req.params.serviceId;

    const serviceData = doc(db, "services", serviceId);

    await updateDoc(serviceData, {
      name: req.body.name,
      price: req.body.price,
      room: req.body.room,
      description: req.body.description
    })
      .then(() => {
        return res.cookie("data", "").status(200).redirect("/admin/service");
      })
      .catch((error) => {
        return console.log(error);
      });
  },

  deleteService: async (req, res) => {
    const serviceId = req.params.serviceId;

    await deleteDoc(doc(db, "services", serviceId));

    return res.status(200).redirect("/admin/service");
  },

  //api
  getServicesAPI: (req, res) => {
    const servicesData = req.servicesData;

    return res.json({
      success: true,
      servicesData: servicesData
    });
  },

  getAServiceAPI: (req, res) => {
    const serviceData = req.serviceData;

    return res.json({
      success: true,
      serviceData: serviceData
    });
  },

  createServiceAPI: async (req, res) => {
    const serviceData = {
      name: req.body.name,
      price: req.body.price,
      room: req.body.room,
      description: req.body.description
    };

    await addDoc(collection(db, "services"), serviceData)
      .then(async () => {
        return res.json({
          success: true,
          message: "Successfully added service"
        });
      })
      .catch((error) => {
        console.log(error)
        return res.status(500)
      });
  },

  updateServiceAPI: async (req, res) => {
    const serviceId = req.params.serviceId;

    const serviceData = doc(db, "services", serviceId);

    await updateDoc(serviceData, {
      name: req.body.name,
      price: req.body.price,
      room: req.body.room,
      description: req.body.description
    })
      .then(async () => {
        return res.json({
          success: true,
          message: "Service updated"
        });
      })
      .catch((error) => {
        console.log(error)
        return res.status(500)
      });
  },

  deleteServiceAPI: async (req, res) => {
    const serviceId = req.params.serviceId;

    await deleteDoc(doc(db, "services", serviceId));

    return res.json({
      success: true,
      message: "Service deleted"
    });
  }
};
