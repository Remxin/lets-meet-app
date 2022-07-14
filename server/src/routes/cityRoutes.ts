//@ts-ignore
const { Router } = require("express");
const cityControllers = require("../controllers/cityControllers")
//@ts-ignore
const router = Router();

router.post("/add/city", cityControllers.addCity)
router.post("/get/city", cityControllers.getCities)

module.exports = router;
