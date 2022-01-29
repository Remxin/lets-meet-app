//@ts-ignore
const { Router } = require("express");
const placeControllers = require("../controllers/placeControllers");
//@ts-ignore
const router = Router();

router.post("/request/create/place", placeControllers.placeCreationRequest);
router.put("/verify/place", placeControllers.verifyPlace);

module.exports = router;
