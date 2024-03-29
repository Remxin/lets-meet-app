"use strict";
//@ts-ignore
const { Router } = require("express");
const userControllers = require("../controllers/userControllers");
//@ts-ignore
const router = Router();
router.post("/forgot-password", userControllers.forgotPassword);
router.post("/email/verifyuser", userControllers.verifyUserFromEmailLink);
router.put("/update/user/password", userControllers.changeUserPassword);
router.post("/send/user/avatar", userControllers.addAvatar);
router.get("/get/user/avatar", userControllers.getAvatar);
router.put("/update/user/informations", userControllers.updateInformations);
router.put("/update/user/password-verified", userControllers.updatePassword);
module.exports = router;
