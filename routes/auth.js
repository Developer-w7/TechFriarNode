var express = require("express");
var router = express.Router();


const AuthController = require("../controller/AuthController");


router.post("/", AuthController.checkLogin);



module.exports = router;