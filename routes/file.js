var express = require("express");
var router = express.Router();


const FileController = require("../controller/FileController");


router.post("/", FileController.listCategories);
router.get("/getFiles", FileController.getFiles);



module.exports = router;