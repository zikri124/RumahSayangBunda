require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;
//const firebase = require("../firebase");
//const db = firebase.firestore;
//const { collection, query, getDocs } = require("firebase/firestore");

module.exports = {
  checkAuth: async (req, res, next) => {
    let cookies = {};
    let cookiesArray;

    try {
      cookiesArray = req.headers.cookie.split(";");
    } catch (error) {
      const err = new Error(error);
      console.log(err);
      return res.status(403).redirect("/admin/signin");
    }

    cookiesArray.forEach((cookie) => {
      const [key, value] = cookie.trim().split("=");
      cookies[key] = value;
    });

    if (!cookies["access_token"]) {
      const err = new Error("Login first");
      console.log(err);
      return res.status(403).redirect("/admin/signin");
    }
    const token = cookies["access_token"];
    try {
      const payload = await jwt.verify(token, JWT_KEY);
      if (payload) {
        req.user = payload;
        next();
      } else {
        return res.status(403).redirect("/admin/signin");
      }
    } catch (err) {
      res.status(500);
      next(err);
    }
  },

  checkToken: async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (token) {
        try {
          const payload = await jwt.verify(token, JWT_KEY);
          if (payload) {
            req.user = payload;
            next();
          } else {
            res.status(403);
            const err = new Error("Wrong Token");
            next(err);
          }
        } catch (err) {
          res.status(500);
          next(err);
        }
      }
    } else {
      res.status(403);
      const err = new Error("Login First");
      next(err);
    }
  },

  getGTokens: async (req, res, next) => {
    let cookies = {};
    const cookiesArray = req.headers.cookie.split(";");

    cookiesArray.forEach((cookie) => {
      const [key, value] = cookie.trim().split("=");
      cookies[key] = value;
    });

    // console.log(cookies.google_token);

    if (!cookies["google_token"]) {
      const err = new Error("Login first");
      console.log(err);
      return res.status(403).redirect("/");
    }

    const tokens = cookies["google_token"];

    try {
      const payload = await jwt.verify(tokens, JWT_KEY);
      if (payload) {
        req.tokens = payload;
        next();
      } else {
        return res.status(403).redirect("/");
      }
    } catch (err) {
      res.status(500);
      next(err);
    }
  }
};

//https://codesandbox.io/s/web-sandi-yang-berhasil-1-dblxn9?file=/views/admin/login.pug:390-394
