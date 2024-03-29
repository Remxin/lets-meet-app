//@ts-ignore
const { Router } = require("express");
const placeControllers = require("../controllers/placeControllers");
//@ts-ignore
const router = Router();

router.post("/request/create/place", placeControllers.placeCreationRequest);
router.put("/verify/place", placeControllers.verifyPlace);
router.delete("/delete/place", placeControllers.rejectPlace)
router.get("/get/place/imgLen", placeControllers.placeImgLen)
router.get("/get/place/img", placeControllers.getPlaceImg)
router.post("/get/place", placeControllers.getCityPlaces)
router.post("/upload/place/images", placeControllers.uploadPlaceImages)
router.post("/place/send/opinion", placeControllers.sendOpinion)

module.exports = router;
