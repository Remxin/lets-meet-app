//@ts-ignore
const { Router } = require("express");
const placeControllers = require("../controllers/placeControllers");
//@ts-ignore
const router = Router();

router.post("/request/create/place", placeControllers.placeCreationRequest);
router.put("/verify/place", placeControllers.verifyPlace);
router.get("/get/place/imgLen", placeControllers.placeImgLen)
router.get("/get/place/img", placeControllers.getPlaceImg)

module.exports = router;
