const express = require("express");
const session = require("express-session");
const userRoute = express();
const nocache = require("nocache");
const userController = require("../controllers/userController");
const bodyParser = require("body-parser");


userRoute.set("view engine", "ejs");
userRoute.set("views", "./views/user");

userRoute.use(nocache());
userRoute.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({ extended: true }));

userRoute.get("/signup", userController.loadRegister);
userRoute.post("/signup", userController.insertUser);
userRoute.get("/login", userController.loginLoad);
userRoute.get("/", userController.loginLoad);
userRoute.post("/login", userController.verifyLogin);
userRoute.get("/home", userController.loadHome);
userRoute.get("/logout", userController.userLogout);

module.exports = userRoute;
