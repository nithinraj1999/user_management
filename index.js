const mongoose = require("mongoose");
const express = require("express");
const app = express();
const nocache = require("nocache");
const bodyParser = require("body-parser");

const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/views/layout"));
app.use(express.static(__dirname + "/views/user"));
app.use(express.static(__dirname + "/views/admin"));

app.use("/", userRoute);
app.use("/admin", adminRoute);
userRoute.use(nocache());

mongoose.connect("mongodb://127.0.0.1/userMgt");

app.listen(2000, () => {
  console.log("running....http://localhost:2000");
});
