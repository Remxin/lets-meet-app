//@ts-ignore
const { Router } = require("express");
const eventControllers = require("../controllers/eventControllers");
//@ts-ignore
const router = Router();

router.post("/create/event", eventControllers.createEvent);

module.exports = router;
