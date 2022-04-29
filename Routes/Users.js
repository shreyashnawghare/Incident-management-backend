const UserRoute = require("express").Router();
const { listUsers, singleUserDetails } = require("../Controllers/MainController");

UserRoute.get("/all",listUsers);
UserRoute.get("/:id",singleUserDetails);

module.exports = UserRoute;