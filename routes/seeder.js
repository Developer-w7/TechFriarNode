var express = require("express");
var router = express.Router();


const SeedController = require("../controller/SeedController");

router.post("/", SeedController.seedUser);


module.exports = router;