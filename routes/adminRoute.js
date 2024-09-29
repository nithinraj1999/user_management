
const bodyParser = require("body-parser")
const express = require("express")
const session = require("express-session")
const adminRoute = express()
const config = require("../config/config")
const adminController = require("../controllers/adminController")



adminRoute.set("view engine", "ejs")
adminRoute.set("views", "./views/admin")

adminRoute.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))



adminRoute.use(bodyParser.json())
adminRoute.use(bodyParser.urlencoded({ extended: true }))



adminRoute.get("/", adminController.loginLoad)
adminRoute.post("/", adminController.verifyLogin)
adminRoute.get("/dashBoard", adminController.loadDashBoard)
adminRoute.get("/new-user", adminController.newUserLoad)
adminRoute.post("/new-user", adminController.addUser)
adminRoute.get("/edit-user", adminController.editUserLoad)
adminRoute.post("/edit-user", adminController.updateUser)
adminRoute.get("/delete-user", adminController.deleteUser)
adminRoute.get("/logout", adminController.adminLogout)

module.exports = adminRoute;
