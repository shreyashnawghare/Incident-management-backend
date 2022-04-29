const IncidentRoute = require('express').Router();
const incident = require("../Models/Incident");
const { createIncident,listIncidents, assignIncident, deleteIncident, singleIncident, resolveIncident } = require("../Controllers/MainController");
const {authenticate} = require('../Middleware/Authenticate');

IncidentRoute.post("/create",[authenticate],createIncident);
IncidentRoute.delete("/delete",[authenticate],deleteIncident);
IncidentRoute.post("/assign-user",[authenticate],assignIncident);
IncidentRoute.get("/incidents",listIncidents);
IncidentRoute.put("/resolve/:id",resolveIncident);
IncidentRoute.get("/:id",singleIncident);

module.exports = IncidentRoute;