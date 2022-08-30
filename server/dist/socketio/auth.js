"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySocketUser = void 0;
const auth_1 = require("../helpers/auth");
// ------ function for converting cookie string into cookie object -----
function getCookiesFromString(cookieString) {
    let returnObj = {};
    if (!cookieString)
        return;
    const separateCookiesArr = cookieString.split("; ");
    const cookiesVals = separateCookiesArr.map((cookie) => {
        const cookieKey = cookie.split("=")[0];
        const cookieVal = cookie.split("=")[1];
        return { key: cookieKey, value: cookieVal };
    });
    cookiesVals.forEach((cookie) => {
        //@ts-ignore
        returnObj[cookie.key] = cookie.value;
    });
    return returnObj;
}
function verifySocketUser(req, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        //@ts-ignore
        const cookies = getCookiesFromString(req.headers.cookie);
        //@ts-ignore
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
            return callback(null, false);
        //@ts-ignore
        const verifiedUser = yield (0, auth_1.verifyUser)(cookies.jwt);
        const isOriginValid = !!verifiedUser;
        callback(null, isOriginValid);
    });
}
exports.verifySocketUser = verifySocketUser;
