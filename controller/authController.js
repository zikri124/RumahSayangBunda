const firebase = require("../firebase");
const jwt = require("jsonwebtoken");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getDoc, doc } = require("firebase/firestore");
const db = firebase.firestore;

module.exports = {
  viewLoginAdmin: (req, res) => {
    return res.render("admin/login");
  },

  processLoginAdmin: async (req, res) => {
    var auth = getAuth(firebase.app);
    const email = req.body.email;
    const password = req.body.password;

    var uid = "";

    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        uid = userCredential.user.uid;

        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        const payload = {
          uid: uid,
          name: userSnap.data().name
        };

        const token = await jwt.sign(payload, process.env.JWT_KEY);

        return res.cookie("access_token", token).redirect("/admin");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        var message = errorMessage;
        console.log(errorCode);
        if (errorMessage == "Firebase: Error (auth/user-not-found).") {
          message = "Email yang dimasukkan salah";
        } else if (errorMessage == "Firebase: Error (auth/wrong-password).") {
          message = "Password yang dimasukkan salah";
        }
        return res.status(401).render("admin/login", {
          error: true,
          message: message
        });
      });
  },

  processLogout: async (req, res) => {
    return res
      .clearCookie("access_token")
      .status(200)
      .redirect("/admin/signin");
  },

  processLoginAdminAPI: async (req, res) => {
    var auth = getAuth(firebase.app);
    const email = req.body.email;
    const password = req.body.password;

    var uid = "";

    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        uid = userCredential.user.uid;

        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        const payload = {
          uid: uid,
          name: userSnap.data().name
        };

        const token = await jwt.sign(payload, process.env.JWT_KEY);

        return res.json({
          success: true,
          message: "Login Success",
          token: token,
          payload: payload
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        var message = errorMessage;
        console.log(errorCode);
        if (errorMessage == "Firebase: Error (auth/user-not-found).") {
          message = "Email yang dimasukkan salah";
        } else if (errorMessage == "Firebase: Error (auth/wrong-password).") {
          message = "Password yang dimasukkan salah";
        }
        
        return res.json({
          success: false,
          message: message
        });
      });
  },

  processLogoutAPI: async (req, res) => {
    return res.json({
      success: true,
      message: "Success Signout"
    });
  }
};
