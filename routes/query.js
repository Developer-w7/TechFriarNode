var express = require("express");
var router = express.Router();

const QueryController = require("../controller/QueryController");
const SeedController = require("../controller/SeedController");

router.get("/", QueryController.listCategories);
router.post("/insert", SeedController.seedUser);


module.exports = router;