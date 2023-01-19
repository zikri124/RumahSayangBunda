const express = require("express");
const app = express();
const router = require("./router");
const PORT = process.env.PORT || 8081;

const bodyParser = require("body-parser"); 
const morgan = require("morgan");

const server = app.listen(PORT, () => {
  console.log("Server Online, Listening to port", server.address().port);
});

app.use(express.json());
app.use(morgan("tiny"));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.set("views", __dirname + "/views");
app.set("view engine", "pug");

app.use(express.static("public"));
app.use("/css", express.static(__dirname + "/views/css"));
app.use("/js", express.static(__dirname + "/views/js"));
app.use("/img", express.static(__dirname + "/images"));

app.use("/", router);
