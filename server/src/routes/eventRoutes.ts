//@ts-ignore
const { Router } = require("express");
const eventControllers = require("../controllers/eventControllers");
//@ts-ignore
const router = Router();

router.post("/create/event", eventControllers.createEvent);
router.get("/get/event-image/:imageId", eventControllers.getEventImage);
router.post("/user/joinevent", eventControllers.joinEvent)
router.post("/get/event/joinrequests", eventControllers.getEventRequests)
router.post('/event/accept/user', eventControllers.acceptUser)
router.post("/event/reject/user", eventControllers.rejectUser)

module.exports = router;
