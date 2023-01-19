const firebase = require("../firebase");
const db = firebase.firestore;
const {
  collection,
  where,
  getDocs,
  doc,
  limit,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query
} = require("firebase/firestore");

module.exports = {
  viewUsers: async (req, res) => {
    const usersData = req.usersData;

    return res.render("admin/viewAdmin", {
      usersData: usersData
    });
  },

  addUser: async (req, res) => {
    const userData = {
      name: req.body.name,
      role: req.body.role
    };

    await addDoc(collection(db, "users"), userData)
      .then(async () => {
        return res.status(200).redirect("/admin/user");
      })
      .catch((error) => {
        console.log(error);
      });
  },

  deleteUser: async (req, res) => {
    const userId = req.params.userId;

    await deleteDoc(doc(db, "users", userId));

    return res.status(200).redirect("/admin/user");
  }
};
